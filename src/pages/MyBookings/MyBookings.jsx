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
    const [selectedBooking, setSelectedBooking] = useState(null);

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

        const { data, error: rpcError } = await supabase.rpc(
            "get_my_bookings",
            {
                p_email: trimmedEmail,
            }
        );

        if (rpcError) {
            setError(rpcError.message);
            setSearched(true);
            setLoading(false);
            return;
        }

        if (!data?.success) {
            setError(
                data?.message ||
                "No bookings were found for this email address."
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
        if (!date) {
            return "—";
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
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
                return <CheckCircle2 size={15} />;

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
                        <span className={styles.eyebrow}>
                            YOUR STAYS
                        </span>

                        <h1>My Bookings</h1>

                        <p>
                            Enter the email address used for your
                            booking to view and manage your stays.
                        </p>
                    </section>

                    <section className={styles.lookupCard}>
                        <div className={styles.lookupIcon}>
                            <Mail size={22} />
                        </div>

                        <div className={styles.lookupContent}>
                            <h2>Find your bookings</h2>

                            <p>
                                Use the same email address you provided
                                when making your reservation.
                            </p>

                            <form
                                className={styles.form}
                                onSubmit={handleSearch}
                            >
                                <div className={styles.inputWrapper}>
                                    <Mail size={18} />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                >
                                    <Search size={18} />

                                    {loading
                                        ? "Searching..."
                                        : "View My Bookings"}
                                </button>
                            </form>
                        </div>
                    </section>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    {searched && !error && bookings.length > 0 && (
                        <section className={styles.results}>
                            <div className={styles.resultsHeader}>
                                <div>
                                    <span
                                        className={
                                            styles.resultsEyebrow
                                        }
                                    >
                                        BOOKINGS
                                    </span>

                                    <h2>
                                        Your booking history
                                    </h2>
                                </div>

                                <span className={styles.bookingCount}>
                                    {bookings.length}{" "}
                                    {bookings.length === 1
                                        ? "Booking"
                                        : "Bookings"}
                                </span>
                            </div>

                            <div className={styles.bookingList}>
                                {bookings.map((booking) => (
                                    <article
                                        key={booking.id}
                                        className={
                                            styles.bookingCard
                                        }
                                    >
                                        <div
                                            className={
                                                styles.bookingTop
                                            }
                                        >
                                            <div>
                                                <span
                                                    className={
                                                        styles.bookingLabel
                                                    }
                                                >
                                                    BOOKING REFERENCE
                                                </span>

                                                <h3>
                                                    {
                                                        booking.booking_reference
                                                    }
                                                </h3>
                                            </div>

                                            <span
                                                className={`${styles.status} ${getStatusClass(
                                                    booking.status
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    booking.status
                                                )}

                                                {booking.status}
                                            </span>
                                        </div>

                                        <div
                                            className={
                                                styles.bookingDetails
                                            }
                                        >
                                            <div>
                                                <CalendarDays
                                                    size={18}
                                                />

                                                <div>
                                                    <span>
                                                        Stay
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            booking.check_in
                                                        )}{" "}
                                                        →{" "}
                                                        {formatDate(
                                                            booking.check_out
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div>
                                                <Users size={18} />

                                                <div>
                                                    <span>
                                                        Guests
                                                    </span>

                                                    <strong>
                                                        {
                                                            booking.guests
                                                        }
                                                    </strong>
                                                </div>
                                            </div>

                                            <div>
                                                <CreditCard
                                                    size={18}
                                                />

                                                <div>
                                                    <span>
                                                        Amount
                                                    </span>

                                                    <strong>
                                                        {formatAmount(
                                                            booking.amount
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={
                                                styles.bookingBottom
                                            }
                                        >
                                            <div>
                                                <span>
                                                    Stay Type
                                                </span>

                                                <strong>
                                                    {booking.stay_type ===
                                                        "day"
                                                        ? "Day Stay"
                                                        : "Overnight"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Payment
                                                </span>

                                                <strong
                                                    className={
                                                        booking.payment_status ===
                                                            "successful"
                                                            ? styles.paymentSuccess
                                                            : ""
                                                    }
                                                >
                                                    {booking.payment_status ||
                                                        "—"}
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedBooking(
                                                        booking
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {selectedBooking && (
                    <div
                        className={styles.modalOverlay}
                        onClick={() =>
                            setSelectedBooking(null)
                        }
                    >
                        <div
                            className={styles.modal}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className={styles.modalHeader}>
                                <div>
                                    <span
                                        className={
                                            styles.resultsEyebrow
                                        }
                                    >
                                        BOOKING DETAILS
                                    </span>

                                    <h2>
                                        {
                                            selectedBooking.booking_reference
                                        }
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className={styles.closeButton}
                                    onClick={() =>
                                        setSelectedBooking(null)
                                    }
                                >
                                    <XCircle size={22} />
                                </button>
                            </div>

                            <div className={styles.modalStatus}>
                                <span
                                    className={`${styles.status} ${getStatusClass(
                                        selectedBooking.status
                                    )}`}
                                >
                                    {getStatusIcon(
                                        selectedBooking.status
                                    )}

                                    {selectedBooking.status}
                                </span>
                            </div>

                            <div className={styles.modalGrid}>
                                <div>
                                    <span>Check-in</span>
                                    <strong>
                                        {formatDate(
                                            selectedBooking.check_in
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Check-out</span>
                                    <strong>
                                        {formatDate(
                                            selectedBooking.check_out
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Guests</span>
                                    <strong>
                                        {selectedBooking.guests}
                                    </strong>
                                </div>

                                <div>
                                    <span>Stay Type</span>
                                    <strong>
                                        {selectedBooking.stay_type ===
                                            "day"
                                            ? "Day Stay"
                                            : "Overnight"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Amount</span>
                                    <strong>
                                        {formatAmount(
                                            selectedBooking.amount
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Payment</span>
                                    <strong>
                                        {selectedBooking.payment_status ||
                                            "—"}
                                    </strong>
                                </div>
                            </div>

                            {selectedBooking.status ===
                                "cancelled" && (
                                    <div
                                        className={
                                            styles.cancellationInfo
                                        }
                                    >
                                        <h3>
                                            Cancellation Information
                                        </h3>

                                        <div>
                                            <span>
                                                Reason
                                            </span>

                                            <strong>
                                                {selectedBooking.cancellation_reason ||
                                                    "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Refund Status
                                            </span>

                                            <strong>
                                                {selectedBooking.refund_status ||
                                                    "—"}
                                            </strong>
                                        </div>

                                        {selectedBooking.refund_amount !==
                                            null &&
                                            selectedBooking.refund_amount !==
                                            undefined && (
                                                <div>
                                                    <span>
                                                        Refund Amount
                                                    </span>

                                                    <strong>
                                                        {formatAmount(
                                                            selectedBooking.refund_amount
                                                        )}
                                                    </strong>
                                                </div>
                                            )}
                                    </div>
                                )}

                            {selectedBooking.status ===
                                "confirmed" && (
                                    <div
                                        className={
                                            styles.manageInfo
                                        }
                                    >
                                        <h3>
                                            Manage Your Booking
                                        </h3>

                                        <p>
                                            Cancellation and refund
                                            options will be available
                                            here.
                                        </p>

                                        <button
                                            type="button"
                                            disabled
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                )}

                            <button
                                type="button"
                                className={styles.closeModalButton}
                                onClick={() =>
                                    setSelectedBooking(null)
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default MyBookings;