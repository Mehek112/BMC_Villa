
// import React, { useState } from "react";
// import {
//     ArrowLeft,
//     CalendarDays,
//     CheckCircle2,
//     Clock3,
//     CreditCard,
//     Mail,
//     Search,
//     Users,
//     XCircle,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { supabase } from "../../lib/supabaseClient";
// import styles from "./MyBookings.module.scss";
// import Navbar from "../../components/Navbar/Navbar";
// import Footer from "../../components/Footer/Footer";

// function MyBookings() {
//     const [email, setEmail] = useState("");
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searched, setSearched] = useState(false);
//     const [error, setError] = useState("");
//     const [selectedBooking, setSelectedBooking] = useState(null);

//     const [showCancelPreview, setShowCancelPreview] = useState(false);
//     const [cancellationReason, setCancellationReason] = useState(
//         "Cancelled by customer"
//     );
//     const [cancelling, setCancelling] = useState(false);
//     const [cancellationError, setCancellationError] = useState("");

//     const handleSearch = async (event) => {
//         event.preventDefault();

//         const trimmedEmail = email.trim();

//         if (!trimmedEmail) {
//             setError("Please enter your email address.");
//             setBookings([]);
//             setSearched(false);
//             return;
//         }

//         setLoading(true);
//         setError("");
//         setBookings([]);
//         setSelectedBooking(null);
//         setShowCancelPreview(false);

//         const { data, error: rpcError } = await supabase.rpc(
//             "get_my_bookings",
//             {
//                 p_email: trimmedEmail,
//             }
//         );

//         if (rpcError) {
//             setError(rpcError.message);
//             setSearched(true);
//             setLoading(false);
//             return;
//         }

//         if (!data?.success) {
//             setError(
//                 data?.message ||
//                     "No bookings were found for this email address."
//             );
//             setSearched(true);
//             setLoading(false);
//             return;
//         }

//         setBookings(data.bookings || []);
//         setSearched(true);
//         setLoading(false);
//     };

//     const formatDate = (date) => {
//         if (!date) {
//             return "—";
//         }

//         return new Date(`${date}T00:00:00`).toLocaleDateString(
//             "en-IN",
//             {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//             }
//         );
//     };

//     const formatAmount = (amount) => {
//         return new Intl.NumberFormat("en-IN", {
//             style: "currency",
//             currency: "INR",
//             maximumFractionDigits: 0,
//         }).format(Number(amount || 0));
//     };

//     const getStatusClass = (status) => {
//         switch (status) {
//             case "confirmed":
//                 return styles.confirmed;

//             case "completed":
//                 return styles.completed;

//             case "cancelled":
//                 return styles.cancelled;

//             case "pending":
//                 return styles.pending;

//             default:
//                 return "";
//         }
//     };

//     const getStatusIcon = (status) => {
//         switch (status) {
//             case "confirmed":
//                 return <CheckCircle2 size={15} />;

//             case "completed":
//                 return <CheckCircle2 size={15} />;

//             case "cancelled":
//                 return <XCircle size={15} />;

//             case "pending":
//                 return <Clock3 size={15} />;

//             default:
//                 return null;
//         }
//     };

//     /*
//      * Calculate the cancellation policy on the client only
//      * so the customer can see the refund preview.
//      *
//      * The actual cancellation/refund amount is determined
//      * again by the secure Supabase function.
//      */
//     const getCancellationDetails = (booking) => {
//         if (!booking?.check_in) {
//             return {
//                 percentage: 50,
//                 charge: Number(booking?.amount || 0) * 0.5,
//                 refund: Number(booking?.amount || 0) * 0.5,
//                 hoursRemaining: 0,
//             };
//         }

//         const now = new Date();

//         const checkIn = new Date(
//             `${booking.check_in}T00:00:00`
//         );

//         const hoursRemaining =
//             (checkIn.getTime() - now.getTime()) /
//             (1000 * 60 * 60);

//         let percentage;

//         if (hoursRemaining > 48) {
//             percentage = 5;
//         } else if (hoursRemaining > 24) {
//             percentage = 25;
//         } else {
//             percentage = 50;
//         }

//         const amount = Number(booking.amount || 0);

//         const charge =
//             Math.round(
//                 amount * (percentage / 100) * 100
//             ) / 100;

//         const refund =
//             Math.round(
//                 (amount - charge) * 100
//             ) / 100;

//         return {
//             percentage,
//             charge,
//             refund,
//             hoursRemaining,
//         };
//     };

//     const cancellationDetails =
//         selectedBooking && showCancelPreview
//             ? getCancellationDetails(selectedBooking)
//             : null;

//     const openCancellationPreview = () => {
//         if (!selectedBooking) {
//             return;
//         }

//         setCancellationError("");
//         setCancellationReason("Cancelled by customer");
//         setShowCancelPreview(true);
//     };

//     const closeCancellationPreview = () => {
//         if (cancelling) {
//             return;
//         }

//         setShowCancelPreview(false);
//         setCancellationError("");
//     };

//     const handleCancelBooking = async () => {
//         if (!selectedBooking || cancelling) {
//             return;
//         }

//         setCancelling(true);
//         setCancellationError("");

//         const trimmedEmail = email.trim();

//         if (!trimmedEmail) {
//             setCancellationError(
//                 "Your email address is required."
//             );
//             setCancelling(false);
//             return;
//         }

//         const reason =
//             cancellationReason.trim() ||
//             "Cancelled by customer";

//         try {
//             const { data, error: rpcError } =
//                 await supabase.rpc(
//                     "cancel_booking",
//                     {
//                         p_booking_reference:
//                             selectedBooking.booking_reference,
//                         p_email: trimmedEmail,
//                         p_reason: reason,
//                     }
//                 );

//             if (rpcError) {
//                 console.error(
//                     "Cancellation error:",
//                     rpcError
//                 );

//                 throw new Error(
//                     rpcError.message ||
//                         "Unable to cancel the booking."
//                 );
//             }

//             if (!data?.success) {
//                 throw new Error(
//                     data?.message ||
//                         "Unable to cancel the booking."
//                 );
//             }

//             /*
//              * The database function has now:
//              * - changed booking status to cancelled
//              * - stored cancellation reason
//              * - calculated the actual refund
//              * - marked refund as pending
//              */

//             const cancelledBooking = {
//                 ...selectedBooking,
//                 status: "cancelled",
//                 cancellation_reason: reason,
//                 refund_status: "pending",
//                 refund_amount: data.refund_amount,
//             };

//             setSelectedBooking(cancelledBooking);
//             setShowCancelPreview(false);

//             /*
//              * Refresh the booking list so the card immediately
//              * shows the cancelled status and refund information.
//              */
//             const { data: refreshedData, error: refreshError } =
//                 await supabase.rpc(
//                     "get_my_bookings",
//                     {
//                         p_email: trimmedEmail,
//                     }
//                 );

//             if (!refreshError && refreshedData?.success) {
//                 setBookings(
//                     refreshedData.bookings || []
//                 );

//                 const refreshedBooking =
//                     (refreshedData.bookings || []).find(
//                         (booking) =>
//                             booking.id === selectedBooking.id
//                     );

//                 if (refreshedBooking) {
//                     setSelectedBooking(
//                         refreshedBooking
//                     );
//                 }
//             }
//         } catch (error) {
//             console.error(
//                 "Booking cancellation failed:",
//                 error
//             );

//             setCancellationError(
//                 error.message ||
//                     "Something went wrong while cancelling your booking."
//             );
//         } finally {
//             setCancelling(false);
//         }
//     };

//     return (
//         <>
//             <Navbar />

//             <main className={styles.page}>
//                 <div className={styles.container}>
//                     <Link
//                         to="/"
//                         className={styles.backLink}
//                     >
//                         <ArrowLeft size={17} />
//                         Back to Home
//                     </Link>

//                     <section className={styles.hero}>
//                         <span className={styles.eyebrow}>
//                             YOUR STAYS
//                         </span>

//                         <h1>My Bookings</h1>

//                         <p>
//                             Enter the email address used for your
//                             booking to view and manage your stays.
//                         </p>
//                     </section>

//                     <section className={styles.lookupCard}>
//                         <div className={styles.lookupIcon}>
//                             <Mail size={22} />
//                         </div>

//                         <div className={styles.lookupContent}>
//                             <h2>Find your bookings</h2>

//                             <p>
//                                 Use the same email address you provided
//                                 when making your reservation.
//                             </p>

//                             <form
//                                 className={styles.form}
//                                 onSubmit={handleSearch}
//                             >
//                                 <div
//                                     className={
//                                         styles.inputWrapper
//                                     }
//                                 >
//                                     <Mail size={18} />

//                                     <input
//                                         type="email"
//                                         value={email}
//                                         onChange={(event) =>
//                                             setEmail(
//                                                 event.target.value
//                                             )
//                                         }
//                                         placeholder="Enter your email address"
//                                         autoComplete="email"
//                                     />
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                 >
//                                     <Search size={18} />

//                                     {loading
//                                         ? "Searching..."
//                                         : "View My Bookings"}
//                                 </button>
//                             </form>
//                         </div>
//                     </section>

//                     {error && (
//                         <div className={styles.error}>
//                             {error}
//                         </div>
//                     )}

//                     {searched &&
//                         !error &&
//                         bookings.length > 0 && (
//                             <section
//                                 className={styles.results}
//                             >
//                                 <div
//                                     className={
//                                         styles.resultsHeader
//                                     }
//                                 >
//                                     <div>
//                                         <span
//                                             className={
//                                                 styles.resultsEyebrow
//                                             }
//                                         >
//                                             BOOKINGS
//                                         </span>

//                                         <h2>
//                                             Your booking history
//                                         </h2>
//                                     </div>

//                                     <span
//                                         className={
//                                             styles.bookingCount
//                                         }
//                                     >
//                                         {bookings.length}{" "}
//                                         {bookings.length === 1
//                                             ? "Booking"
//                                             : "Bookings"}
//                                     </span>
//                                 </div>

//                                 <div
//                                     className={
//                                         styles.bookingList
//                                     }
//                                 >
//                                     {bookings.map(
//                                         (booking) => (
//                                             <article
//                                                 key={
//                                                     booking.id
//                                                 }
//                                                 className={
//                                                     styles.bookingCard
//                                                 }
//                                             >
//                                                 <div
//                                                     className={
//                                                         styles.bookingTop
//                                                     }
//                                                 >
//                                                     <div>
//                                                         <span
//                                                             className={
//                                                                 styles.bookingLabel
//                                                             }
//                                                         >
//                                                             BOOKING REFERENCE
//                                                         </span>

//                                                         <h3>
//                                                             {
//                                                                 booking.booking_reference
//                                                             }
//                                                         </h3>
//                                                     </div>

//                                                     <span
//                                                         className={`${styles.status} ${getStatusClass(
//                                                             booking.status
//                                                         )}`}
//                                                     >
//                                                         {getStatusIcon(
//                                                             booking.status
//                                                         )}

//                                                         {
//                                                             booking.status
//                                                         }
//                                                     </span>
//                                                 </div>

//                                                 <div
//                                                     className={
//                                                         styles.bookingDetails
//                                                     }
//                                                 >
//                                                     <div>
//                                                         <CalendarDays
//                                                             size={
//                                                                 18
//                                                             }
//                                                         />

//                                                         <div>
//                                                             <span>
//                                                                 Stay
//                                                             </span>

//                                                             <strong>
//                                                                 {formatDate(
//                                                                     booking.check_in
//                                                                 )}{" "}
//                                                                 →{" "}
//                                                                 {formatDate(
//                                                                     booking.check_out
//                                                                 )}
//                                                             </strong>
//                                                         </div>
//                                                     </div>

//                                                     <div>
//                                                         <Users
//                                                             size={
//                                                                 18
//                                                             }
//                                                         />

//                                                         <div>
//                                                             <span>
//                                                                 Guests
//                                                             </span>

//                                                             <strong>
//                                                                 {
//                                                                     booking.guests
//                                                                 }
//                                                             </strong>
//                                                         </div>
//                                                     </div>

//                                                     <div>
//                                                         <CreditCard
//                                                             size={
//                                                                 18
//                                                             }
//                                                         />

//                                                         <div>
//                                                             <span>
//                                                                 Amount
//                                                             </span>

//                                                             <strong>
//                                                                 {formatAmount(
//                                                                     booking.amount
//                                                                 )}
//                                                             </strong>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div
//                                                     className={
//                                                         styles.bookingBottom
//                                                     }
//                                                 >
//                                                     <div>
//                                                         <span>
//                                                             Stay Type
//                                                         </span>

//                                                         <strong>
//                                                             {booking.stay_type ===
//                                                             "day"
//                                                                 ? "Day Stay"
//                                                                 : "Overnight"}
//                                                         </strong>
//                                                     </div>

//                                                     <div>
//                                                         <span>
//                                                             Payment
//                                                         </span>

//                                                         <strong
//                                                             className={
//                                                                 booking.payment_status ===
//                                                                 "successful"
//                                                                     ? styles.paymentSuccess
//                                                                     : ""
//                                                             }
//                                                         >
//                                                             {booking.payment_status ||
//                                                                 "—"}
//                                                         </strong>
//                                                     </div>

//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             setSelectedBooking(
//                                                                 booking
//                                                             )
//                                                         }
//                                                     >
//                                                         View Details
//                                                     </button>
//                                                 </div>
//                                             </article>
//                                         )
//                                     )}
//                                 </div>
//                             </section>
//                         )}
//                 </div>

//                 {selectedBooking && (
//                     <div
//                         className={
//                             styles.modalOverlay
//                         }
//                         onClick={() =>
//                             setSelectedBooking(null)
//                         }
//                     >
//                         <div
//                             className={styles.modal}
//                             onClick={(event) =>
//                                 event.stopPropagation()
//                             }
//                         >
//                             <div
//                                 className={
//                                     styles.modalHeader
//                                 }
//                             >
//                                 <div>
//                                     <span
//                                         className={
//                                             styles.resultsEyebrow
//                                         }
//                                     >
//                                         BOOKING DETAILS
//                                     </span>

//                                     <h2>
//                                         {
//                                             selectedBooking.booking_reference
//                                         }
//                                     </h2>
//                                 </div>

//                                 <button
//                                     type="button"
//                                     className={
//                                         styles.closeButton
//                                     }
//                                     onClick={() =>
//                                         setSelectedBooking(
//                                             null
//                                         )
//                                     }
//                                 >
//                                     <XCircle size={22} />
//                                 </button>
//                             </div>

//                             <div
//                                 className={
//                                     styles.modalStatus
//                                 }
//                             >
//                                 <span
//                                     className={`${styles.status} ${getStatusClass(
//                                         selectedBooking.status
//                                     )}`}
//                                 >
//                                     {getStatusIcon(
//                                         selectedBooking.status
//                                     )}

//                                     {
//                                         selectedBooking.status
//                                     }
//                                 </span>
//                             </div>

//                             <div
//                                 className={
//                                     styles.modalGrid
//                                 }
//                             >
//                                 <div>
//                                     <span>
//                                         Check-in
//                                     </span>

//                                     <strong>
//                                         {formatDate(
//                                             selectedBooking.check_in
//                                         )}
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>
//                                         Check-out
//                                     </span>

//                                     <strong>
//                                         {formatDate(
//                                             selectedBooking.check_out
//                                         )}
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>
//                                         Guests
//                                     </span>

//                                     <strong>
//                                         {
//                                             selectedBooking.guests
//                                         }
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>
//                                         Stay Type
//                                     </span>

//                                     <strong>
//                                         {selectedBooking.stay_type ===
//                                         "day"
//                                             ? "Day Stay"
//                                             : "Overnight"}
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>
//                                         Amount
//                                     </span>

//                                     <strong>
//                                         {formatAmount(
//                                             selectedBooking.amount
//                                         )}
//                                     </strong>
//                                 </div>

//                                 <div>
//                                     <span>
//                                         Payment
//                                     </span>

//                                     <strong>
//                                         {selectedBooking.payment_status ||
//                                             "—"}
//                                     </strong>
//                                 </div>
//                             </div>

//                             {selectedBooking.status ===
//                                 "cancelled" && (
//                                 <div
//                                     className={
//                                         styles.cancellationInfo
//                                     }
//                                 >
//                                     <h3>
//                                         Cancellation Information
//                                     </h3>

//                                     <div>
//                                         <span>
//                                             Reason
//                                         </span>

//                                         <strong>
//                                             {selectedBooking.cancellation_reason ||
//                                                 "—"}
//                                         </strong>
//                                     </div>

//                                     <div>
//                                         <span>
//                                             Refund Status
//                                         </span>

//                                         <strong>
//                                             {selectedBooking.refund_status ||
//                                                 "—"}
//                                         </strong>
//                                     </div>

//                                     {selectedBooking.refund_amount !==
//                                         null &&
//                                         selectedBooking.refund_amount !==
//                                             undefined && (
//                                             <div>
//                                                 <span>
//                                                     Refund Amount
//                                                 </span>

//                                                 <strong>
//                                                     {formatAmount(
//                                                         selectedBooking.refund_amount
//                                                     )}
//                                                 </strong>
//                                             </div>
//                                         )}
//                                 </div>
//                             )}

//                             {selectedBooking.status ===
//                                 "confirmed" && (
//                                 <div
//                                     className={
//                                         styles.manageInfo
//                                     }
//                                 >
//                                     <h3>
//                                         Manage Your Booking
//                                     </h3>

//                                     <p>
//                                         You can cancel this
//                                         booking according to
//                                         the cancellation policy.
//                                     </p>

//                                     <button
//                                         type="button"
//                                         onClick={
//                                             openCancellationPreview
//                                         }
//                                     >
//                                         Cancel Booking
//                                     </button>
//                                 </div>
//                             )}

//                             <button
//                                 type="button"
//                                 className={
//                                     styles.closeModalButton
//                                 }
//                                 onClick={() =>
//                                     setSelectedBooking(
//                                         null
//                                     )
//                                 }
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {selectedBooking &&
//                     showCancelPreview &&
//                     cancellationDetails && (
//                         <div
//                             className={
//                                 styles.modalOverlay
//                             }
//                             onClick={
//                                 closeCancellationPreview
//                             }
//                         >
//                             <div
//                                 className={
//                                     styles.modal
//                                 }
//                                 onClick={(event) =>
//                                     event.stopPropagation()
//                                 }
//                             >
//                                 <div
//                                     className={
//                                         styles.modalHeader
//                                     }
//                                 >
//                                     <div>
//                                         <span
//                                             className={
//                                                 styles.resultsEyebrow
//                                             }
//                                         >
//                                             CANCEL BOOKING
//                                         </span>

//                                         <h2>
//                                             {
//                                                 selectedBooking.booking_reference
//                                             }
//                                         </h2>
//                                     </div>

//                                     <button
//                                         type="button"
//                                         className={
//                                             styles.closeButton
//                                         }
//                                         onClick={
//                                             closeCancellationPreview
//                                         }
//                                         disabled={
//                                             cancelling
//                                         }
//                                     >
//                                         <XCircle size={22} />
//                                     </button>
//                                 </div>

//                                 <div
//                                     className={
//                                         styles.cancellationPreview
//                                     }
//                                 >
//                                     <h3>
//                                         Cancellation & Refund
//                                     </h3>

//                                     <p>
//                                         Your cancellation
//                                         charge is based on
//                                         how much time remains
//                                         before check-in.
//                                     </p>

//                                     <div
//                                         className={
//                                             styles.refundBreakdown
//                                         }
//                                     >
//                                         <div>
//                                             <span>
//                                                 Booking Amount
//                                             </span>

//                                             <strong>
//                                                 {formatAmount(
//                                                     selectedBooking.amount
//                                                 )}
//                                             </strong>
//                                         </div>

//                                         <div>
//                                             <span>
//                                                 Cancellation Charge
//                                             </span>

//                                             <strong>
//                                                 {cancellationDetails.percentage}%
//                                                 {" — "}
//                                                 {formatAmount(
//                                                     cancellationDetails.charge
//                                                 )}
//                                             </strong>
//                                         </div>

//                                         <div>
//                                             <span>
//                                                 Refund Amount
//                                             </span>

//                                             <strong>
//                                                 {formatAmount(
//                                                     cancellationDetails.refund
//                                                 )}
//                                             </strong>
//                                         </div>
//                                     </div>

//                                     <div
//                                         className={
//                                             styles.policyNotice
//                                         }
//                                     >
//                                         <strong>
//                                             Cancellation policy
//                                         </strong>

//                                         <span>
//                                             More than 48 hours:
//                                             5% charge
//                                         </span>

//                                         <span>
//                                             24–48 hours:
//                                             25% charge
//                                         </span>

//                                         <span>
//                                             Less than 24 hours:
//                                             50% charge
//                                         </span>
//                                     </div>

//                                     <div
//                                         className={
//                                             styles.reasonField
//                                         }
//                                     >
//                                         <label htmlFor="cancellationReason">
//                                             Cancellation Reason
//                                         </label>

//                                         <textarea
//                                             id="cancellationReason"
//                                             value={
//                                                 cancellationReason
//                                             }
//                                             onChange={(
//                                                 event
//                                             ) =>
//                                                 setCancellationReason(
//                                                     event.target
//                                                         .value
//                                                 )
//                                             }
//                                             rows={3}
//                                             placeholder="Enter cancellation reason"
//                                             disabled={
//                                                 cancelling
//                                             }
//                                         />
//                                     </div>

//                                     {cancellationError && (
//                                         <div
//                                             className={
//                                                 styles.error
//                                             }
//                                         >
//                                             {
//                                                 cancellationError
//                                             }
//                                         </div>
//                                     )}

//                                     <div
//                                         className={
//                                             styles.cancellationActions
//                                         }
//                                     >
//                                         <button
//                                             type="button"
//                                             className={
//                                                 styles.cancelKeepButton
//                                             }
//                                             onClick={
//                                                 closeCancellationPreview
//                                             }
//                                             disabled={
//                                                 cancelling
//                                             }
//                                         >
//                                             Keep Booking
//                                         </button>

//                                         <button
//                                             type="button"
//                                             className={
//                                                 styles.confirmCancelButton
//                                             }
//                                             onClick={
//                                                 handleCancelBooking
//                                             }
//                                             disabled={
//                                                 cancelling
//                                             }
//                                         >
//                                             {cancelling
//                                                 ? "Cancelling..."
//                                                 : "Confirm Cancellation"}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//             </main>

//             <Footer />
//         </>
//     );
// }

// export default MyBookings;


import React, { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    Mail,
    Search,
    Users,
    XCircle,
    AlertTriangle,
    X,
    Eye,
    Receipt,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./MyBookings.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function MyBookings() {
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    // Modal States
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const [cancellationReason, setCancellationReason] = useState(
        "Cancelled by customer"
    );
    const [cancelling, setCancelling] = useState(false);
    const [cancellationError, setCancellationError] = useState("");

    const handleSearch = async (event) => {
        event.preventDefault();

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Please enter your email address.");
            setBookings([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setError("");
        setBookings([]);
        setSelectedBooking(null);
        setShowDetailsModal(false);
        setShowCancelConfirm(false);

        const { data, error: rpcError } = await supabase.rpc(
            "get_my_bookings",
            { p_email: trimmedEmail }
        );

        if (rpcError) {
            setError(rpcError.message);
            setSearched(true);
            setLoading(false);
            return;
        }

        if (!data?.success) {
            setError(
                data?.message || "No bookings were found for this email address."
            );
            setSearched(true);
            setLoading(false);
            return;
        }

        setBookings(data.bookings || []);
        setSearched(true);
        setLoading(false);
    };

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount || 0));
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "confirmed":
                return styles.confirmed;
            case "completed":
                return styles.completed;
            case "cancelled":
                return styles.cancelled;
            case "pending":
                return styles.pending;
            default:
                return "";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed":
            case "completed":
                return <CheckCircle2 size={15} />;
            case "cancelled":
                return <XCircle size={15} />;
            case "pending":
                return <Clock3 size={15} />;
            default:
                return null;
        }
    };

    // Calculate refund based on policy logic:
    // > 48 hours → 95% refund (5% fee)
    // 24–48 hours → 75% refund (25% fee)
    // < 24 hours → 50% refund (50% fee)
    const getCancellationDetails = (booking) => {
        const amount = Number(booking?.amount || 0);

        if (!booking?.check_in) {
            return {
                refundPercentage: 50,
                cancellationFeePercentage: 50,
                charge: amount * 0.5,
                refund: amount * 0.5,
                hoursRemaining: 0,
            };
        }

        const now = new Date();
        const checkIn = new Date(`${booking.check_in}T00:00:00`);
        const hoursRemaining =
            (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);

        let refundPercentage;
        if (hoursRemaining > 48) {
            refundPercentage = 95;
        } else if (hoursRemaining >= 24) {
            refundPercentage = 75;
        } else {
            refundPercentage = 50;
        }

        const feePercentage = 100 - refundPercentage;
        const refund = Math.round(amount * (refundPercentage / 100) * 100) / 100;
        const charge = Math.round((amount - refund) * 100) / 100;

        return {
            refundPercentage,
            cancellationFeePercentage: feePercentage,
            charge,
            refund,
            hoursRemaining,
        };
    };

    const openDetailsModal = (booking) => {
        setSelectedBooking(booking);
        setCancellationError("");
        setCancellationReason("Cancelled by customer");
        setShowCancelConfirm(false);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        if (cancelling) return;
        setShowDetailsModal(false);
        setShowCancelConfirm(false);
        setSelectedBooking(null);
        setCancellationError("");
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking || cancelling) return;

        setCancelling(true);
        setCancellationError("");

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setCancellationError("Your email address is required.");
            setCancelling(false);
            return;
        }

        const reason = cancellationReason.trim() || "Cancelled by customer";

        try {
            const { data, error: rpcError } = await supabase.rpc(
                "cancel_booking",
                {
                    p_booking_reference: selectedBooking.booking_reference,
                    p_email: trimmedEmail,
                    p_reason: reason,
                }
            );

            if (rpcError) {
                throw new Error(
                    rpcError.message || "Unable to cancel the booking."
                );
            }

            if (!data?.success) {
                throw new Error(
                    data?.message || "Unable to cancel the booking."
                );
            }

            // Refresh list from database
            const { data: refreshedData, error: refreshError } =
                await supabase.rpc("get_my_bookings", {
                    p_email: trimmedEmail,
                });

            if (!refreshError && refreshedData?.success) {
                setBookings(refreshedData.bookings || []);
                const updated = refreshedData.bookings.find(
                    (b) => b.id === selectedBooking.id
                );
                if (updated) setSelectedBooking(updated);
            }

            setShowCancelConfirm(false);
        } catch (err) {
            setCancellationError(
                err.message || "Something went wrong while cancelling your booking."
            );
        } finally {
            setCancelling(false);
        }
    };

    const cancellationDetails = selectedBooking
        ? getCancellationDetails(selectedBooking)
        : null;

    return (
        <>
            <Navbar />

            <main className={styles.page}>
                <div className={styles.container}>
                    <Link to="/" className={styles.backLink}>
                        <ArrowLeft size={17} />
                        Back to Home
                    </Link>

                    <section className={styles.hero}>
                        <span className={styles.eyebrow}>YOUR STAYS</span>
                        <h1>My Bookings</h1>
                        <p>
                            Enter the email address used for your booking to view and
                            manage your stays.
                        </p>
                    </section>

                    <section className={styles.lookupCard}>
                        <div className={styles.lookupIcon}>
                            <Mail size={22} />
                        </div>

                        <div className={styles.lookupContent}>
                            <h2>Find your bookings</h2>
                            <p>
                                Use the same email address you provided when making your
                                reservation.
                            </p>

                            <form className={styles.form} onSubmit={handleSearch}>
                                <div className={styles.inputWrapper}>
                                    <Mail size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                    />
                                </div>

                                <button type="submit" disabled={loading}>
                                    <Search size={18} />
                                    {loading ? "Searching..." : "View My Bookings"}
                                </button>
                            </form>
                        </div>
                    </section>

                    {error && <div className={styles.error}>{error}</div>}

                    {searched && !error && bookings.length > 0 && (
                        <section className={styles.results}>
                            <div className={styles.resultsHeader}>
                                <div>
                                    <span className={styles.resultsEyebrow}>
                                        BOOKINGS
                                    </span>
                                    <h2>Your booking history</h2>
                                </div>
                                <span className={styles.bookingCount}>
                                    {bookings.length}{" "}
                                    {bookings.length === 1 ? "Booking" : "Bookings"}
                                </span>
                            </div>

                            <div className={styles.bookingList}>
                                {bookings.map((booking) => (
                                    <article key={booking.id} className={styles.bookingCard}>
                                        <div className={styles.bookingTop}>
                                            <div>
                                                <span className={styles.bookingLabel}>
                                                    BOOKING REFERENCE
                                                </span>
                                                <h3>{booking.booking_reference}</h3>
                                            </div>

                                            <span
                                                className={`${styles.status} ${getStatusClass(
                                                    booking.status
                                                )}`}
                                            >
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className={styles.bookingDetails}>
                                            <div>
                                                <CalendarDays size={18} />
                                                <div>
                                                    <span>Stay</span>
                                                    <strong>
                                                        {formatDate(booking.check_in)} →{" "}
                                                        {formatDate(booking.check_out)}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div>
                                                <Users size={18} />
                                                <div>
                                                    <span>Guests</span>
                                                    <strong>{booking.guests}</strong>
                                                </div>
                                            </div>

                                            <div>
                                                <CreditCard size={18} />
                                                <div>
                                                    <span>Amount Paid</span>
                                                    <strong>
                                                        {formatAmount(booking.amount)}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.bookingBottom}>
                                            <div>
                                                <span>Type</span>
                                                <strong>
                                                    {booking.stay_type === "day"
                                                        ? "Day Stay"
                                                        : "Overnight"}
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                className={styles.viewDetailsBtn}
                                                onClick={() => openDetailsModal(booking)}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* --- BOOKING DETAILS & CANCELLATION MODAL --- */}
            {showDetailsModal && selectedBooking && (
                <div className={styles.modalOverlay} onClick={closeDetailsModal}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3>Booking Details</h3>
                            <button
                                type="button"
                                className={styles.closeBtn}
                                onClick={closeDetailsModal}
                                disabled={cancelling}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.referenceBadge}>
                                <span>Reference Number</span>
                                <h2>{selectedBooking.booking_reference}</h2>
                            </div>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span>Status</span>
                                    <strong
                                        className={`${styles.status} ${getStatusClass(
                                            selectedBooking.status
                                        )}`}
                                    >
                                        {getStatusIcon(selectedBooking.status)}
                                        {selectedBooking.status}
                                    </strong>
                                </div>

                                <div className={styles.detailItem}>
                                    <span>Stay Duration</span>
                                    <strong>
                                        {formatDate(selectedBooking.check_in)} to{" "}
                                        {formatDate(selectedBooking.check_out)}
                                    </strong>
                                </div>

                                <div className={styles.detailItem}>
                                    <span>Guests</span>
                                    <strong>{selectedBooking.guests} Person(s)</strong>
                                </div>

                                <div className={styles.detailItem}>
                                    <span>Total Price</span>
                                    <strong>{formatAmount(selectedBooking.amount)}</strong>
                                </div>
                            </div>

                            {/* Standard Details View */}
                            {!showCancelConfirm ? (
                                <>
                                    {selectedBooking.status === "cancelled" && (
                                        <div className={styles.cancelledAlert}>
                                            <AlertTriangle size={18} />
                                            <div>
                                                <strong>Booking Cancelled</strong>
                                                <p>
                                                    Refund Status:{" "}
                                                    <span className={styles.highlightPending}>
                                                        {selectedBooking.refund_status || "pending"}
                                                    </span>
                                                </p>
                                                {selectedBooking.refund_amount !== undefined && (
                                                    <p>
                                                        Eligible Refund:{" "}
                                                        <strong>
                                                            {formatAmount(
                                                                selectedBooking.refund_amount
                                                            )}
                                                        </strong>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {selectedBooking.status === "confirmed" && (
                                        <div className={styles.cancelSection}>
                                            <h4>Need to cancel this booking?</h4>
                                            <p>
                                                Cancellations requested 48+ hrs prior receive
                                                95% refund, 24–48 hrs receive 75%, and under 24
                                                hrs receive 50%.
                                            </p>
                                            <button
                                                type="button"
                                                className={styles.dangerBtn}
                                                onClick={() => setShowCancelConfirm(true)}
                                            >
                                                Initiate Cancellation
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Cancellation Step Inside Modal */
                                <div className={styles.cancellationConfirmBox}>
                                    <h4>Confirm Cancellation</h4>
                                    <p>
                                        Based on your check-in date, here is your refund
                                        breakdown:
                                    </p>

                                    {cancellationDetails && (
                                        <div className={styles.policySummary}>
                                            <div className={styles.policyRow}>
                                                <span>Total Paid:</span>
                                                <span>
                                                    {formatAmount(selectedBooking.amount)}
                                                </span>
                                            </div>
                                            <div className={styles.policyRow}>
                                                <span>
                                                    Fee (
                                                    {
                                                        cancellationDetails.cancellationFeePercentage
                                                    }
                                                    %):
                                                </span>
                                                <span>
                                                    {formatAmount(cancellationDetails.charge)}
                                                </span>
                                            </div>
                                            <div
                                                className={`${styles.policyRow} ${styles.refundRow}`}
                                            >
                                                <span>
                                                    Refund ({cancellationDetails.refundPercentage}
                                                    %):
                                                </span>
                                                <strong>
                                                    {formatAmount(cancellationDetails.refund)}
                                                </strong>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.noteBox}>
                                        <Clock3 size={16} />
                                        <span>
                                            Note: Refunds are marked as <strong>pending</strong>{" "}
                                            and will be processed back to your original payment
                                            source within 3–5 business days.
                                        </span>
                                    </div>

                                    <div className={styles.reasonField}>
                                        <label htmlFor="cancelReason">
                                            Reason for Cancellation
                                        </label>
                                        <textarea
                                            id="cancelReason"
                                            value={cancellationReason}
                                            onChange={(e) =>
                                                setCancellationReason(e.target.value)
                                            }
                                            placeholder="Provide a reason..."
                                            rows={2}
                                            disabled={cancelling}
                                        />
                                    </div>

                                    {cancellationError && (
                                        <div className={styles.modalError}>
                                            <AlertTriangle size={16} />
                                            <span>{cancellationError}</span>
                                        </div>
                                    )}

                                    <div className={styles.modalActions}>
                                        <button
                                            type="button"
                                            className={styles.secondaryBtn}
                                            onClick={() => setShowCancelConfirm(false)}
                                            disabled={cancelling}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.dangerBtn}
                                            onClick={handleCancelBooking}
                                            disabled={cancelling}
                                        >
                                            {cancelling
                                                ? "Processing..."
                                                : "Confirm & Cancel Booking"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default MyBookings;