import React, { useEffect, useState } from "react";
import {
    CheckCircle2,
    MessageSquare,
    Star,
    XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Feedback.module.scss";

function Feedback() {
    const [email, setEmail] = useState("");
    const [verification, setVerification] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState("");

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState("");

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState("");

    async function fetchReviews() {
        setReviewsError("");

        const { data, error } = await supabase
            .from("feedback")
            .select(`
                id,
                rating,
                review,
                created_at,
                bookings (
                    customers (
                        name
                    )
                )
            `)
            .eq("status", "approved")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Reviews fetch error:", error);
            setReviewsError("Unable to load reviews right now.");
            setReviews([]);
        } else {
            setReviews(data || []);
        }

        setReviewsLoading(false);
    }

    useEffect(() => {
        fetchReviews();

        const channel = supabase
            .channel("public-feedback")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "feedback",
                },
                () => {
                    fetchReviews();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function handleVerify(event) {
        event.preventDefault();

        setVerificationError("");
        setVerification(null);

        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            setVerificationError("Please enter your email address.");
            return;
        }

        setIsVerifying(true);

        try {
            const { data, error } = await supabase.rpc(
                "verify_feedback_eligibility",
                {
                    p_email: trimmedEmail,
                }
            );

            if (error) {
                throw error;
            }

            if (!data?.eligible) {
                setVerificationError(
                    data?.message ||
                        "You are not eligible to submit feedback."
                );
                return;
            }

            setVerification(data);
        } catch (error) {
            console.error("Feedback verification error:", error);

            setVerificationError(
                error.message ||
                    "Unable to verify your booking. Please try again."
            );
        } finally {
            setIsVerifying(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSubmitError("");
        setSubmitMessage("");

        if (!verification?.booking_id) {
            setSubmitError(
                "Please verify your booking before submitting feedback."
            );
            return;
        }

        if (rating < 1 || rating > 5) {
            setSubmitError("Please select a rating from 1 to 5 stars.");
            return;
        }

        if (!review.trim()) {
            setSubmitError("Please write a review.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error } = await supabase.rpc(
                "submit_feedback",
                {
                    p_email: email.trim().toLowerCase(),
                    p_booking_id: verification.booking_id,
                    p_rating: rating,
                    p_review: review.trim(),
                }
            );

            if (error) {
                throw error;
            }

            if (!data?.success) {
                throw new Error(
                    data?.message || "Unable to submit feedback."
                );
            }

            setSubmitMessage(
                data.message ||
                    "Thank you! Your feedback has been published."
            );

            setRating(0);
            setReview("");

            // Fetch immediately so the new review appears
            // without waiting for the realtime event.
            await fetchReviews();
        } catch (error) {
            console.error("Feedback submission error:", error);

            setSubmitError(
                error.message ||
                    "Unable to submit your feedback. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function renderStars(ratingValue, size = 18) {
        return (
            <div className={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        fill={
                            star <= ratingValue
                                ? "currentColor"
                                : "none"
                        }
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <main className={styles.page}>
                <section className={styles.hero}>
                    <span className={styles.eyebrow}>
                        YOUR EXPERIENCE MATTERS
                    </span>

                    <h1>Share Your Experience</h1>

                    <p>
                        We would love to hear about your stay at Lake View
                        Villa.
                    </p>
                </section>

                <section className={styles.feedbackCard}>
                    {!verification ? (
                        <>
                            <div className={styles.iconWrapper}>
                                <MessageSquare size={28} />
                            </div>

                            <h2>Verify Your Stay</h2>

                            <p className={styles.description}>
                                Enter the email address used for your booking
                                to verify that you are eligible to leave
                                feedback.
                            </p>

                            <form
                                className={styles.form}
                                onSubmit={handleVerify}
                            >
                                <div className={styles.field}>
                                    <label htmlFor="feedbackEmail">
                                        Email Address
                                    </label>

                                    <input
                                        id="feedbackEmail"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="Enter your booking email"
                                        autoComplete="email"
                                        disabled={isVerifying}
                                    />
                                </div>

                                {verificationError && (
                                    <div className={styles.errorMessage}>
                                        <XCircle size={18} />
                                        <span>{verificationError}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={styles.primaryButton}
                                    disabled={isVerifying}
                                >
                                    {isVerifying
                                        ? "Verifying..."
                                        : "Verify Booking"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className={styles.successIcon}>
                                <CheckCircle2 size={28} />
                            </div>

                            <span className={styles.verifiedLabel}>
                                BOOKING VERIFIED
                            </span>

                            <h2>How Was Your Stay?</h2>

                            <p className={styles.bookingReference}>
                                Booking:{" "}
                                <strong>
                                    {verification.booking_reference}
                                </strong>
                            </p>

                            <form
                                className={styles.form}
                                onSubmit={handleSubmit}
                            >
                                <div className={styles.ratingSection}>
                                    <label>Your Rating</label>

                                    <div className={styles.stars}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={
                                                    star <= rating
                                                        ? styles.starActive
                                                        : styles.star
                                                }
                                                onClick={() =>
                                                    setRating(star)
                                                }
                                                aria-label={`${star} star${
                                                    star > 1 ? "s" : ""
                                                }`}
                                            >
                                                <Star
                                                    size={32}
                                                    fill={
                                                        star <= rating
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="review">
                                        Your Review
                                    </label>

                                    <textarea
                                        id="review"
                                        value={review}
                                        onChange={(event) =>
                                            setReview(event.target.value)
                                        }
                                        placeholder="Tell us about your experience..."
                                        rows={6}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {submitError && (
                                    <div className={styles.errorMessage}>
                                        <XCircle size={18} />
                                        <span>{submitError}</span>
                                    </div>
                                )}

                                {submitMessage && (
                                    <div className={styles.successMessage}>
                                        <CheckCircle2 size={18} />
                                        <span>{submitMessage}</span>
                                    </div>
                                )}

                                {!submitMessage && (
                                    <button
                                        type="submit"
                                        className={styles.primaryButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Submitting..."
                                            : "Submit Feedback"}
                                    </button>
                                )}
                            </form>
                        </>
                    )}
                </section>

                <section className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                        <span className={styles.eyebrow}>
                            GUEST EXPERIENCES
                        </span>

                        <h2>What Our Guests Say</h2>

                        <p>
                            Read experiences shared by guests who have stayed
                            with us.
                        </p>
                    </div>

                    {reviewsLoading ? (
                        <div className={styles.reviewsState}>
                            <p>Loading guest reviews...</p>
                        </div>
                    ) : reviewsError ? (
                        <div className={styles.reviewsState}>
                            <p>{reviewsError}</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className={styles.reviewsState}>
                            <MessageSquare size={24} />
                            <p>
                                No guest reviews yet. Be the first to share
                                your experience.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.reviewsGrid}>
                            {reviews.map((item) => {
                                const customerName =
                                    item.bookings?.customers?.name ||
                                    "Guest";

                                return (
                                    <article
                                        key={item.id}
                                        className={styles.reviewCard}
                                    >
                                        <div
                                            className={
                                                styles.reviewCardTop
                                            }
                                        >
                                            {renderStars(item.rating)}

                                            <span
                                                className={
                                                    styles.reviewDate
                                                }
                                            >
                                                {new Date(
                                                    item.created_at
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </span>
                                        </div>

                                        <p className={styles.reviewText}>
                                            “{item.review}”
                                        </p>

                                        <div
                                            className={
                                                styles.reviewer
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.reviewerAvatar
                                                }
                                            >
                                                {customerName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {customerName}
                                                </strong>

                                                <span>
                                                    Verified Guest
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Feedback;