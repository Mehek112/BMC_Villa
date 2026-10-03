import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Check,
    ChevronDown,
    RefreshCw,
    Star,
    Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AdminFeedback.module.scss";

function AdminFeedback() {
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const fetchFeedback = async () => {
        setLoading(true);
        setError("");

        const { data, error: fetchError } = await supabase
            .from("feedback")
            .select(`
        id,
        booking_id,
        rating,
        review,
        status,
        created_at,
        bookings (
          booking_reference,
          check_in,
          check_out,
          customers (
            name,
            email,
            phone
          )
        )
      `)
            .order("created_at", { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
            setFeedback([]);
        } else {
            setFeedback(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const filteredFeedback = useMemo(() => {
        const query = search.trim().toLowerCase();

        return feedback.filter((item) => {
            const customer = item.bookings?.customers;
            const bookingReference =
                item.bookings?.booking_reference?.toLowerCase() || "";

            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;

            const matchesSearch =
                !query ||
                customer?.name?.toLowerCase().includes(query) ||
                customer?.email?.toLowerCase().includes(query) ||
                bookingReference.includes(query) ||
                item.review?.toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [feedback, statusFilter, search]);

    const pendingCount = feedback.filter(
        (item) => item.status === "pending"
    ).length;

    const approvedCount = feedback.filter(
        (item) => item.status === "approved"
    ).length;

    const handleApprove = async (feedbackId) => {
        setActionLoading(feedbackId);
        setError("");

        const { error: updateError } = await supabase
            .from("feedback")
            .update({ status: "approved" })
            .eq("id", feedbackId);

        if (updateError) {
            setError(updateError.message);
        } else {
            setFeedback((current) =>
                current.map((item) =>
                    item.id === feedbackId
                        ? { ...item, status: "approved" }
                        : item
                )
            );
        }

        setActionLoading("");
    };

    const handleDelete = async (feedbackId) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this review?"
        );

        if (!confirmed) {
            return;
        }

        setActionLoading(feedbackId);
        setError("");

        const { error: deleteError } = await supabase
            .from("feedback")
            .delete()
            .eq("id", feedbackId);

        if (deleteError) {
            setError(deleteError.message);
        } else {
            setFeedback((current) =>
                current.filter((item) => item.id !== feedbackId)
            );
        }

        setActionLoading("");
    };

    const renderStars = (rating) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        fill={star <= rating ? "currentColor" : "none"}
                    />
                ))}
            </div>
        );
    };

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                {/* Back to Dashboard */}
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

                {/* Page Header */}
                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>
                            CUSTOMER FEEDBACK
                        </span>

                        <h1>Manage Reviews</h1>

                        <p>
                            Review customer feedback and decide which reviews
                            should be displayed publicly.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.refreshButton}
                        onClick={fetchFeedback}
                        disabled={loading}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </header>

                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <span>Total Reviews</span>
                        <strong>{feedback.length}</strong>
                    </div>

                    <div className={styles.statCard}>
                        <span>Pending</span>
                        <strong>{pendingCount}</strong>
                    </div>

                    <div className={styles.statCard}>
                        <span>Approved</span>
                        <strong>{approvedCount}</strong>
                    </div>
                </div>

                <div className={styles.toolbar}>
                    <input
                        type="text"
                        placeholder="Search by name, email, booking or review..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <div className={styles.selectWrapper}>
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="all">All Reviews</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>

                        <ChevronDown size={16} />
                    </div>
                </div>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className={styles.emptyState}>
                        <p>Loading feedback...</p>
                    </div>
                ) : filteredFeedback.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No feedback found.</p>
                    </div>
                ) : (
                    <div className={styles.feedbackList}>
                        {filteredFeedback.map((item) => {
                            const customer = item.bookings?.customers;
                            const booking = item.bookings;

                            return (
                                <article
                                    key={item.id}
                                    className={styles.feedbackCard}
                                >
                                    <div className={styles.cardTop}>
                                        <div>
                                            <div
                                                className={
                                                    styles.customerName
                                                }
                                            >
                                                {customer?.name ||
                                                    "Unknown Customer"}
                                            </div>

                                            <div
                                                className={
                                                    styles.customerEmail
                                                }
                                            >
                                                {customer?.email ||
                                                    "No email"}
                                            </div>
                                        </div>

                                        <span
                                            className={`${styles.status} ${item.status === "approved"
                                                    ? styles.approved
                                                    : styles.pending
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            styles.reviewContent
                                        }
                                    >
                                        {renderStars(item.rating)}

                                        <p className={styles.review}>
                                            “{item.review}”
                                        </p>
                                    </div>

                                    <div className={styles.details}>
                                        <div>
                                            <span>Booking</span>

                                            <strong>
                                                {booking?.booking_reference || "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Stay</span>

                                            <strong>
                                                {booking?.check_in || "—"}
                                                {" → "}
                                                {booking?.check_out || "—"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Submitted</span>

                                            <strong>
                                                {item.created_at
                                                    ? new Date(
                                                        item.created_at
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : "—"}
                                            </strong>
                                        </div>

                                        <div className={styles.detailsAction}>
                                            <button
                                                type="button"
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(item.id)}
                                                disabled={actionLoading === item.id}
                                            >
                                                <Trash2 size={16} />
                                                {actionLoading === item.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </div>


                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

export default AdminFeedback;