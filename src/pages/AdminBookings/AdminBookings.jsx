
import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    Mail,
    Phone,
    Search,
    Users,
    X,
    XCircle,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AdminBookings.module.scss";

function AdminBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [stayFilter, setStayFilter] = useState("all");

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");

    const [cancellationReason, setCancellationReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancellationError, setCancellationError] = useState("");

    async function fetchBookings() {
        setIsLoading(true);
        setError("");

        try {
            const { data, error: bookingsError } = await supabase
                .from("bookings")
                .select(`
          id,
          booking_reference,
          check_in,
          check_out,
          guests,
          stay_type,
          amount,
          status,
          created_at,
          customer_id,
          customers (
            id,
            name,
            email,
            phone
          ),
          payments (
            id,
            amount,
            payment_status,
            transaction_id,
            created_at
          )
        `)
                .order("created_at", { ascending: false });

            if (bookingsError) {
                throw bookingsError;
            }

            setBookings(data || []);
        } catch (fetchError) {
            console.error("Bookings fetch error:", fetchError);
            setError(
                fetchError.message ||
                "Unable to load bookings. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return bookings.filter((booking) => {
            const customer = booking.customers;

            const matchesSearch =
                !search ||
                booking.booking_reference?.toLowerCase().includes(search) ||
                customer?.name?.toLowerCase().includes(search) ||
                customer?.email?.toLowerCase().includes(search) ||
                customer?.phone?.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "all" ||
                booking.status === statusFilter;

            const matchesStay =
                stayFilter === "all" ||
                booking.stay_type === stayFilter;

            return matchesSearch && matchesStatus && matchesStay;
        });
    }, [bookings, searchTerm, statusFilter, stayFilter]);

    function formatDate(date) {
        if (!date) return "-";

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    async function handleCancellation() {
        if (!selectedBooking || isCancelling) return;

        setCancellationError("");

        const reason = cancellationReason.trim();

        if (!reason) {
            setCancellationError(
                "Please enter a cancellation reason."
            );
            return;
        }

        if (selectedBooking.status === "cancelled") {
            setCancellationError(
                "This booking has already been cancelled."
            );
            return;
        }

        if (!canCancelBooking(selectedBooking)) {
            setCancellationError(
                "This booking can no longer be cancelled because it is less than 48 hours before check-in."
            );
            return;
        }

        setIsCancelling(true);

        try {
            const payment = getPayment(selectedBooking);

            const refundAmount = Number(
                payment?.amount ?? selectedBooking.amount ?? 0
            );

            const cancelledAt = new Date().toISOString();

            const { data: updatedBooking, error: bookingError } =
                await supabase
                    .from("bookings")
                    .update({
                        status: "cancelled",
                        cancellation_reason: reason,
                        cancelled_at: cancelledAt,
                    })
                    .eq("id", selectedBooking.id)
                    .select(`
          id,
          booking_reference,
          check_in,
          check_out,
          guests,
          stay_type,
          amount,
          status,
          created_at,
          customer_id,
          cancellation_reason,
          cancelled_at,
          customers (
            id,
            name,
            email,
            phone
          ),
          payments (
            id,
            amount,
            payment_status,
            transaction_id,
            refund_status,
            refund_amount,
            refunded_at,
            created_at
          )
        `)
                    .single();

            if (bookingError) {
                throw bookingError;
            }

            if (payment?.id) {
                const { error: paymentError } = await supabase
                    .from("payments")
                    .update({
                        refund_status: "pending",
                        refund_amount: refundAmount,
                    })
                    .eq("id", payment.id);

                if (paymentError) {
                    throw paymentError;
                }
            }

            const updatedPayment = payment
                ? {
                    ...payment,
                    refund_status: "pending",
                    refund_amount: refundAmount,
                }
                : null;

            const bookingWithPayment = {
                ...updatedBooking,
                payments: updatedPayment
                    ? [updatedPayment]
                    : [],
            };

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === selectedBooking.id
                        ? bookingWithPayment
                        : booking
                )
            );

            setSelectedBooking(bookingWithPayment);
            setSelectedStatus("cancelled");
            setCancellationReason("");

            // Notify the customer after cancellation is saved.
            try {
                console.log("Starting cancellation email request...");
                const { data: emailData, error: emailError } =
                    await supabase.functions.invoke(
                        "send-cancellation-email",
                        {
                            body: {
                                booking_id: updatedBooking.id,
                                booking_reference: updatedBooking.booking_reference,
                            },
                        }
                    );
                console.log("Cancellation email response:", {
                    emailData,
                    emailError,
                });

                if (emailError || !emailData?.success) {
                    console.error(
                        "Cancellation email failed:",
                        emailError || emailData
                    );
                } else {
                    console.log("Cancellation email sent successfully.");
                }
            } catch (emailError) {
                console.error("Cancellation email request failed:", emailError);
            }

        } catch (cancelError) {
            console.error(
                "Booking cancellation error:",
                cancelError
            );

            setCancellationError(
                cancelError.message ||
                "Unable to cancel the booking."
            );
        } finally {
            setIsCancelling(false);
        }
    }

    function formatDateTime(date) {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function formatAmount(amount) {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    }

    function getPayment(booking) {
        return Array.isArray(booking.payments)
            ? booking.payments[0]
            : booking.payments;
    }

    function getPaymentStatus(booking) {
        return getPayment(booking)?.payment_status || "pending";
    }

    function getStatusClass(status) {
        return `${styles.status} ${styles[status] || ""}`;
    }

    function getPaymentClass(status) {
        return `${styles.paymentStatus} ${styles[status] || ""}`;
    }

    function openBooking(booking) {
        setSelectedBooking(booking);
        setSelectedStatus(booking.status);
        setUpdateError("");
        setUpdateSuccess("");
    }

    function closeBooking() {
        if (isUpdating) return;

        setSelectedBooking(null);
        setSelectedStatus("");
        setUpdateError("");
        setUpdateSuccess("");
    }

    function canCancelBooking(booking) {
        if (!booking?.check_in) return false;

        const now = new Date();
        const checkIn = new Date(`${booking.check_in}T00:00:00`);

        const difference = checkIn.getTime() - now.getTime();
        const fortyEightHours = 48 * 60 * 60 * 1000;

        return difference >= fortyEightHours;
    }

    function getCancellationDeadline(booking) {
        if (!booking?.check_in) return null;

        const checkIn = new Date(`${booking.check_in}T00:00:00`);
        return new Date(checkIn.getTime() - 48 * 60 * 60 * 1000);
    }

    async function handleStatusUpdate() {
        if (!selectedBooking || isUpdating) return;

        if (selectedStatus === selectedBooking.status) {
            setUpdateError("Please select a different booking status.");
            return;
        }

        setIsUpdating(true);
        setUpdateError("");
        setUpdateSuccess("");

        try {
            const { data, error: updateErrorResponse } = await supabase
                .from("bookings")
                .update({
                    status: selectedStatus,
                })
                .eq("id", selectedBooking.id)
                .select(`
          id,
          booking_reference,
          check_in,
          check_out,
          guests,
          stay_type,
          amount,
          status,
          created_at,
          customer_id,
          customers (
            id,
            name,
            email,
            phone
          ),
          payments (
            id,
            amount,
            payment_status,
            transaction_id,
            created_at
          )
        `)
                .single();

            if (updateErrorResponse) {
                throw updateErrorResponse;
            }

            setBookings((currentBookings) =>
                currentBookings.map((booking) =>
                    booking.id === data.id ? data : booking
                )
            );

            setSelectedBooking(data);
            setSelectedStatus(data.status);
            setUpdateSuccess("Booking status updated successfully.");

            setTimeout(() => {
                setUpdateSuccess("");
            }, 3000);
        } catch (statusError) {
            console.error("Booking status update error:", statusError);
            setUpdateError(
                statusError.message ||
                "Unable to update booking status."
            );
        } finally {
            setIsUpdating(false);
        }
    }
    async function handleDeleteBooking(booking) {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete booking ${booking.booking_reference}? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            const { error: deleteError } = await supabase
                .from("bookings")
                .delete()
                .eq("id", booking.id);

            if (deleteError) {
                throw deleteError;
            }

            setBookings((currentBookings) =>
                currentBookings.filter((item) => item.id !== booking.id)
            );

            if (selectedBooking?.id === booking.id) {
                setSelectedBooking(null);
                setSelectedStatus("");
            }
        } catch (deleteError) {
            console.error("Booking deletion error:", deleteError);

            window.alert(
                deleteError.message ||
                "Unable to delete this booking. Please try again."
            );
        }
    }


    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate("/admin")}
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>
                </div>

                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>
                            ADMIN MANAGEMENT
                        </span>

                        <h1>Bookings</h1>

                        <p>
                            View and manage all villa bookings from one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.refreshButton}
                        onClick={fetchBookings}
                        disabled={isLoading}
                    >
                        {isLoading ? "Refreshing..." : "Refresh"}
                    </button>
                </header>

                <section className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search booking, customer, email or phone..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <div className={styles.selectWrapper}>
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <ChevronDown size={16} />
                        </div>

                        <div className={styles.selectWrapper}>
                            <select
                                value={stayFilter}
                                onChange={(event) =>
                                    setStayFilter(event.target.value)
                                }
                            >
                                <option value="all">All Stay Types</option>
                                <option value="day">Day Stay</option>
                                <option value="overnight">Day + Night</option>
                            </select>

                            <ChevronDown size={16} />
                        </div>
                    </div>
                </section>

                {error && (
                    <div className={styles.errorBox}>
                        <strong>Unable to load bookings</strong>
                        <p>{error}</p>
                    </div>
                )}

                <section className={styles.summary}>
                    <div className={styles.summaryItem}>
                        <div className={styles.summaryIcon}>
                            <CalendarDays size={19} />
                        </div>

                        <div>
                            <span>Total Results</span>
                            <strong>{filteredBookings.length}</strong>
                        </div>
                    </div>

                    <div className={styles.summaryItem}>
                        <div className={styles.summaryIcon}>
                            <Users size={19} />
                        </div>

                        <div>
                            <span>Total Bookings</span>
                            <strong>{bookings.length}</strong>
                        </div>
                    </div>
                </section>

                <section className={styles.tableCard}>
                    {isLoading ? (
                        <div className={styles.emptyState}>
                            <p>Loading bookings...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className={styles.emptyState}>
                            <CalendarDays size={38} />

                            <h3>No bookings found</h3>

                            <p>
                                Try changing your search or filter options.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Booking</th>
                                        <th>Customer</th>
                                        <th>Stay</th>
                                        <th>Guests</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredBookings.map((booking) => {
                                        const customer = booking.customers;
                                        const paymentStatus =
                                            getPaymentStatus(booking);

                                        return (
                                            <tr key={booking.id}>
                                                <td>
                                                    <div className={styles.bookingCell}>
                                                        <strong>
                                                            {booking.booking_reference}
                                                        </strong>

                                                        <span>
                                                            {formatDate(booking.check_in)}
                                                            {" → "}
                                                            {formatDate(booking.check_out)}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className={styles.customerCell}>
                                                        <strong>
                                                            {customer?.name || "Unknown"}
                                                        </strong>

                                                        <span>
                                                            {customer?.email || "-"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className={styles.stayType}>
                                                        {booking.stay_type === "day"
                                                            ? "Day Stay"
                                                            : "Day + Night"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className={styles.guests}>
                                                        <Users size={14} />
                                                        {booking.guests}
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong className={styles.amount}>
                                                        {formatAmount(booking.amount)}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getPaymentClass(
                                                            paymentStatus
                                                        )}
                                                    >
                                                        {paymentStatus}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getStatusClass(
                                                            booking.status
                                                        )}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className={styles.actionButtons}>
                                                        <button
                                                            type="button"
                                                            className={styles.viewButton}
                                                            onClick={() => openBooking(booking)}
                                                            title="View booking"
                                                        >
                                                            <Eye size={16} />
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={styles.deleteButton}
                                                            onClick={() => handleDeleteBooking(booking)}
                                                            title="Delete booking"
                                                        >
                                                            <Trash2 size={16} />
                                                            
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            {selectedBooking && (
                <div
                    className={styles.modalOverlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeBooking();
                        }
                    }}
                >
                    <section
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="bookingDetailsTitle"
                    >
                        <div className={styles.modalHeader}>
                            <div>
                                <span className={styles.modalEyebrow}>
                                    BOOKING DETAILS
                                </span>

                                <h2 id="bookingDetailsTitle">
                                    {selectedBooking.booking_reference}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={closeBooking}
                                disabled={isUpdating}
                                aria-label="Close booking details"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailCard}>
                                    <span>Stay Dates</span>

                                    <strong>
                                        {formatDate(selectedBooking.check_in)}
                                        {" → "}
                                        {formatDate(selectedBooking.check_out)}
                                    </strong>
                                </div>

                                <div className={styles.detailCard}>
                                    <span>Stay Type</span>

                                    <strong>
                                        {selectedBooking.stay_type === "day"
                                            ? "Day Stay"
                                            : "Day + Night"}
                                    </strong>
                                </div>

                                <div className={styles.detailCard}>
                                    <span>Guests</span>

                                    <strong>
                                        {selectedBooking.guests}{" "}
                                        {selectedBooking.guests === 1
                                            ? "Guest"
                                            : "Guests"}
                                    </strong>
                                </div>

                                <div className={styles.detailCard}>
                                    <span>Total Amount</span>

                                    <strong>
                                        {formatAmount(selectedBooking.amount)}
                                    </strong>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3>Customer Information</h3>

                                <div className={styles.contactGrid}>
                                    <div className={styles.contactItem}>
                                        <Users size={17} />

                                        <div>
                                            <span>Name</span>
                                            <strong>
                                                {selectedBooking.customers?.name ||
                                                    "-"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className={styles.contactItem}>
                                        <Mail size={17} />

                                        <div>
                                            <span>Email</span>
                                            <strong>
                                                {selectedBooking.customers?.email ||
                                                    "-"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className={styles.contactItem}>
                                        <Phone size={17} />

                                        <div>
                                            <span>Phone</span>
                                            <strong>
                                                {selectedBooking.customers?.phone ||
                                                    "-"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3>Payment Information</h3>

                                <div className={styles.paymentBox}>
                                    <div>
                                        <span>Payment Status</span>

                                        <span
                                            className={getPaymentClass(
                                                getPaymentStatus(selectedBooking)
                                            )}
                                        >
                                            {getPaymentStatus(selectedBooking)}
                                        </span>
                                    </div>

                                    <div>
                                        <span>Transaction ID</span>

                                        <strong>
                                            {getPayment(selectedBooking)
                                                ?.transaction_id || "-"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Paid Amount</span>

                                        <strong>
                                            {formatAmount(
                                                getPayment(selectedBooking)?.amount
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3>Booking Status</h3>

                                <div className={styles.statusUpdate}>
                                    <div className={styles.statusSelectWrapper}>
                                        <select
                                            value={selectedStatus}
                                            onChange={(event) =>
                                                setSelectedStatus(event.target.value)
                                            }
                                            disabled={isUpdating}
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>

                                            <option value="confirmed">
                                                Confirmed
                                            </option>

                                            <option value="completed">
                                                Completed
                                            </option>

                                            {/* <option value="cancelled">
                                                Cancelled
                                            </option> */}
                                        </select>

                                        <ChevronDown size={16} />
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.updateButton}
                                        onClick={handleStatusUpdate}
                                        disabled={
                                            isUpdating ||
                                            selectedStatus ===
                                            selectedBooking.status
                                        }
                                    >
                                        {isUpdating
                                            ? "Updating..."
                                            : "Update Status"}
                                    </button>
                                </div>

                                {updateError && (
                                    <div className={styles.updateError}>
                                        <XCircle size={17} />
                                        <span>{updateError}</span>
                                    </div>
                                )}

                                {updateSuccess && (
                                    <div className={styles.updateSuccess}>
                                        <CheckCircle2 size={17} />
                                        <span>{updateSuccess}</span>
                                    </div>
                                )}
                            </div>
                            {selectedBooking && selectedBooking.status !== "cancelled" && (
                                <div className={styles.cancellationSection}>
                                    <div className={styles.cancellationHeader}>
                                        <div>
                                            <h3>Cancel Booking</h3>
                                            <p>
                                                Cancellation is allowed only at least 48 hours
                                                before check-in.
                                            </p>
                                        </div>
                                    </div>

                                    {canCancelBooking(selectedBooking) ? (
                                        <>
                                            <label htmlFor="cancellationReason">
                                                Cancellation Reason
                                            </label>

                                            <textarea
                                                id="cancellationReason"
                                                value={cancellationReason}
                                                onChange={(event) =>
                                                    setCancellationReason(event.target.value)
                                                }
                                                placeholder="Enter the reason for cancelling this booking..."
                                                rows={4}
                                                disabled={isCancelling}
                                            />

                                            <div className={styles.refundInfo}>
                                                <span>Refund Amount</span>

                                                <strong>
                                                    {formatAmount(
                                                        getPayment(selectedBooking)?.amount ??
                                                        selectedBooking.amount
                                                    )}
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                className={styles.cancelBookingButton}
                                                onClick={handleCancellation}
                                                disabled={isCancelling}
                                            >
                                                <XCircle size={17} />

                                                {isCancelling
                                                    ? "Cancelling Booking..."
                                                    : "Cancel Booking & Start Refund"}
                                            </button>

                                            {cancellationError && (
                                                <div className={styles.cancellationError}>
                                                    <XCircle size={17} />
                                                    <span>{cancellationError}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className={styles.cancellationBlocked}>
                                            <Clock3 size={18} />

                                            <div>
                                                <strong>
                                                    Cancellation window has closed
                                                </strong>

                                                <p>
                                                    This booking must be cancelled at least
                                                    48 hours before check-in.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {selectedBooking && selectedBooking.status === "cancelled" && (
                                <div className={styles.cancelledInfo}>
                                    <div className={styles.cancelledTitle}>
                                        <XCircle size={19} />

                                        <strong>Booking Cancelled</strong>
                                    </div>

                                    <div className={styles.cancelledDetail}>
                                        <span>Cancellation Reason</span>

                                        <p>
                                            {selectedBooking.cancellation_reason ||
                                                "No reason provided."}
                                        </p>
                                    </div>

                                    <div className={styles.cancelledDetail}>
                                        <span>Cancelled At</span>

                                        <p>
                                            {formatDateTime(
                                                selectedBooking.cancelled_at
                                            )}
                                        </p>
                                    </div>

                                    <div className={styles.cancelledDetail}>
                                        <span>Refund Status</span>

                                        <strong>
                                            {getPayment(selectedBooking)?.refund_status ||
                                                "pending"}
                                        </strong>
                                    </div>

                                    <div className={styles.cancelledDetail}>
                                        <span>Refund Amount</span>

                                        <strong>
                                            {formatAmount(
                                                getPayment(selectedBooking)?.refund_amount ??
                                                selectedBooking.amount
                                            )}
                                        </strong>
                                    </div>
                                </div>
                            )}

                            <div className={styles.createdInfo}>
                                <Clock3 size={15} />
                                Booking created{" "}
                                {formatDateTime(selectedBooking.created_at)}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default AdminBookings;