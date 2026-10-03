import React, { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    IndianRupee,
    LogOut,
    MessageSquare,
    Users,
    XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

import styles from "./AdminDashboard.module.scss";

function AdminDashboard() {
    const navigate = useNavigate();

    const [adminEmail, setAdminEmail] = useState("");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        pendingFeedback: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        setLoading(true);
        setError("");

        try {
            const { data: userData } = await supabase.auth.getUser();

            if (userData?.user?.email) {
                setAdminEmail(userData.user.email);
            }

            const [
                bookingsResponse,
                completedResponse,
                cancelledResponse,
                feedbackResponse,
            ] = await Promise.all([
                supabase
                    .from("bookings")
                    .select("id, check_in, check_out, amount, status"),

                supabase
                    .from("bookings")
                    .select("id", { count: "exact", head: true })
                    .eq("status", "completed"),

                supabase
                    .from("bookings")
                    .select("id", { count: "exact", head: true })
                    .eq("status", "cancelled"),

                supabase
                    .from("feedback")
                    .select("id", { count: "exact", head: true })
                    .eq("status", "pending"),
            ]);

            if (bookingsResponse.error) {
                throw bookingsResponse.error;
            }

            if (completedResponse.error) {
                throw completedResponse.error;
            }

            if (cancelledResponse.error) {
                throw cancelledResponse.error;
            }

            if (feedbackResponse.error) {
                throw feedbackResponse.error;
            }

            const bookings = bookingsResponse.data || [];

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcomingBookings = bookings.filter((booking) => {
                if (
                    booking.status === "cancelled" ||
                    booking.status === "completed"
                ) {
                    return false;
                }

                const checkIn = new Date(`${booking.check_in}T00:00:00`);

                return checkIn >= today;
            });

            const totalRevenue = bookings
                .filter((booking) => booking.status !== "cancelled")
                .reduce(
                    (total, booking) => total + Number(booking.amount || 0),
                    0
                );

            setStats({
                totalBookings: bookings.length,
                upcomingBookings: upcomingBookings.length,
                completedBookings: completedResponse.count || 0,
                cancelledBookings: cancelledResponse.count || 0,
                totalRevenue,
                pendingFeedback: feedbackResponse.count || 0,
            });
        } catch (error) {
            console.error("Dashboard loading error:", error);

            setError(
                error.message || "Unable to load dashboard information."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
            return;
        }

        navigate("/admin/login", { replace: true });
    }

    return (
        <main className={styles.dashboardPage}>

            <header className={styles.header}>

                <div>
                    <span className={styles.eyebrow}>
                        SAMRAJYA Villa
                    </span>

                    <h1>Admin Dashboard</h1>

                    <p>
                        Manage your villa bookings, payments, availability and customer feedback.
                    </p>
                </div>

                <div className={styles.headerActions}>

                    {adminEmail && (
                        <span className={styles.adminEmail}>
                            {adminEmail}
                        </span>
                    )}

                    <button
                        type="button"
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <LogOut size={17} />

                        {isLoggingOut ? "Signing Out..." : "Sign Out"}
                    </button>

                </div>

            </header>

            {error && (
                <div className={styles.errorMessage}>
                    <XCircle size={19} />

                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={loadDashboard}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <section className={styles.statsGrid}>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <CalendarDays size={22} />
                    </div>

                    <div>
                        <span>Total Bookings</span>

                        <strong>
                            {loading ? "—" : stats.totalBookings}
                        </strong>
                    </div>
                </article>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Clock3 size={22} />
                    </div>

                    <div>
                        <span>Upcoming Bookings</span>

                        <strong>
                            {loading ? "—" : stats.upcomingBookings}
                        </strong>
                    </div>
                </article>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <CheckCircle2 size={22} />
                    </div>

                    <div>
                        <span>Completed</span>

                        <strong>
                            {loading ? "—" : stats.completedBookings}
                        </strong>
                    </div>
                </article>

                <article className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <IndianRupee size={22} />
                    </div>

                    <div>
                        <span>Revenue</span>

                        <strong>
                            {loading
                                ? "—"
                                : `₹${stats.totalRevenue.toLocaleString("en-IN")}`}
                        </strong>
                    </div>
                </article>

            </section>

            <section className={styles.managementSection}>

                <div className={styles.sectionHeader}>
                    <div>
                        <span className={styles.sectionEyebrow}>
                            MANAGEMENT
                        </span>

                        <h2>Villa Operations</h2>
                    </div>
                </div>

                <div className={styles.managementGrid}>

                    <button
                        type="button"
                        className={styles.managementCard}
                        onClick={() => navigate("/admin/bookings")}
                    >
                        <CalendarDays size={25} />

                        <div>
                            <h3>Bookings</h3>

                            <p>
                                View and manage all villa bookings.
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        className={styles.managementCard}
                        onClick={() => navigate("/admin/customers")}
                    >
                        <Users size={25} />

                        <div>
                            <h3>Customers</h3>

                            <p>
                                View customer and guest information.
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        className={styles.managementCard}
                        onClick={() => navigate("/admin/payments")}
                    >
                        <IndianRupee size={25} />

                        <div>
                            <h3>Payments</h3>

                            <p>
                                Track booking payments and transactions.
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        className={styles.managementCard}
                        onClick={() => navigate("/admin/feedback")}
                    >
                        <MessageSquare size={25} />

                        <div>
                            <h3>Feedback</h3>

                            <p>
                                Review and approve customer feedback.
                            </p>

                            {stats.pendingFeedback > 0 && (
                                <span className={styles.pendingBadge}>
                                    {stats.pendingFeedback} pending
                                </span>
                            )}
                        </div>
                    </button>

                    <button
                        type="button"
                        className={styles.managementCard}
                        onClick={() => navigate("/admin/availability")}
                    >
                        <CalendarDays size={25} />

                        <div>
                            <h3>Availability</h3>

                            <p>
                                Manage available and unavailable dates.
                            </p>
                        </div>
                    </button>

                </div>

            </section>

            <section className={styles.statusSection}>

                <div className={styles.statusCard}>

                    <div className={styles.statusHeader}>
                        <div>
                            <span className={styles.sectionEyebrow}>
                                BOOKING STATUS
                            </span>

                            <h2>Current Overview</h2>
                        </div>
                    </div>

                    <div className={styles.statusGrid}>

                        <div>
                            <span>Completed</span>

                            <strong>
                                {loading ? "—" : stats.completedBookings}
                            </strong>
                        </div>

                        <div>
                            <span>Cancelled</span>

                            <strong>
                                {loading ? "—" : stats.cancelledBookings}
                            </strong>
                        </div>

                        <div>
                            <span>Feedback Pending</span>

                            <strong>
                                {loading ? "—" : stats.pendingFeedback}
                            </strong>
                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default AdminDashboard;