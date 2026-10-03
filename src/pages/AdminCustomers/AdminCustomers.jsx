import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AdminCustomers.module.scss";

function AdminCustomers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    setError("");

    const { data, error: fetchError } = await supabase
      .from("customers")
      .select(`
        id,
        name,
        phone,
        email,
        created_at,
        bookings (
          id,
          booking_reference,
          check_in,
          check_out,
          guests,
          stay_type,
          amount,
          status,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setCustomers([]);
    } else {
      setCustomers(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name?.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.phone?.toLowerCase().includes(search)
      );
    });
  }, [customers, searchTerm]);

  const totalCustomers = customers.length;

  const totalBookings = customers.reduce(
    (total, customer) => total + (customer.bookings?.length || 0),
    0
  );

  const totalRevenue = customers.reduce((total, customer) => {
    const customerRevenue =
      customer.bookings?.reduce((sum, booking) => {
        if (
          booking.status === "confirmed" ||
          booking.status === "completed"
        ) {
          return sum + Number(booking.amount || 0);
        }

        return sum;
      }, 0) || 0;

    return total + customerRevenue;
  }, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const getLatestBooking = (customer) => {
    if (!customer.bookings?.length) {
      return null;
    }

    return [...customer.bookings].sort(
      (a, b) =>
        new Date(b.created_at || b.check_in) -
        new Date(a.created_at || a.check_in)
    )[0];
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <div className={styles.titleRow}>
              <div className={styles.titleIcon}>
                <Users size={24} />
              </div>

              <div>
                <h1>Customers</h1>
                <p>Manage guest information and booking history.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? styles.spinning : ""}
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={20} />
            </div>

            <div>
              <span>Total Customers</span>
              <strong>{totalCustomers}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={20} />
            </div>

            <div>
              <span>Total Bookings</span>
              <strong>{totalBookings}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <span className={styles.rupee}>₹</span>
            </div>

            <div>
              <span>Confirmed Revenue</span>
              <strong>{formatAmount(totalRevenue)}</strong>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className={styles.resultCount}>
            {filteredCustomers.length}{" "}
            {filteredCustomers.length === 1 ? "customer" : "customers"}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Table */}
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.emptyState}>
              <RefreshCw className={styles.spinning} size={28} />
              <p>Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className={styles.emptyState}>
              <Users size={34} />
              <h3>No customers found</h3>
              <p>
                {searchTerm
                  ? "Try a different search."
                  : "Customer records will appear here."}
              </p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Bookings</th>
                    <th>Latest Stay</th>
                    <th>Total Paid</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => {
                    const latestBooking = getLatestBooking(customer);

                    const totalPaid =
                      customer.bookings?.reduce((sum, booking) => {
                        if (
                          booking.status === "confirmed" ||
                          booking.status === "completed"
                        ) {
                          return sum + Number(booking.amount || 0);
                        }

                        return sum;
                      }, 0) || 0;

                    return (
                      <tr key={customer.id}>
                        <td>
                          <div className={styles.customerCell}>
                            <div className={styles.avatar}>
                              {customer.name?.charAt(0)?.toUpperCase() || "G"}
                            </div>

                            <div>
                              <strong>{customer.name || "—"}</strong>
                              <span>
                                {customer.bookings?.length || 0} booking
                                {customer.bookings?.length === 1 ? "" : "s"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className={styles.contactCell}>
                            {customer.email && (
                              <span>
                                <Mail size={14} />
                                {customer.email}
                              </span>
                            )}

                            {customer.phone && (
                              <span>
                                <Phone size={14} />
                                {customer.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className={styles.bookingCount}>
                            {customer.bookings?.length || 0}
                          </span>
                        </td>

                        <td>
                          {latestBooking ? (
                            <div className={styles.latestStay}>
                              <strong>
                                {formatDate(latestBooking.check_in)}
                              </strong>

                              <span>
                                {latestBooking.booking_reference}
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td>
                          <strong>{formatAmount(totalPaid)}</strong>
                        </td>

                        <td>{formatDateTime(customer.created_at)}</td>

                        <td>
                          <button
                            type="button"
                            className={styles.viewButton}
                            onClick={() =>
                              setSelectedCustomer(customer)
                            }
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>Customer Details</h2>
                <p>Guest information and booking history</p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.customerProfile}>
              <div className={styles.largeAvatar}>
                {selectedCustomer.name
                  ?.charAt(0)
                  ?.toUpperCase() || "G"}
              </div>

              <div>
                <h3>{selectedCustomer.name || "—"}</h3>
                <p>Customer since {formatDateTime(selectedCustomer.created_at)}</p>
              </div>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span>Email</span>
                <strong>{selectedCustomer.email || "—"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Phone</span>
                <strong>{selectedCustomer.phone || "—"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Total Bookings</span>
                <strong>
                  {selectedCustomer.bookings?.length || 0}
                </strong>
              </div>

              <div className={styles.detailItem}>
                <span>Total Paid</span>
                <strong>
                  {formatAmount(
                    selectedCustomer.bookings?.reduce((sum, booking) => {
                      if (
                        booking.status === "confirmed" ||
                        booking.status === "completed"
                      ) {
                        return sum + Number(booking.amount || 0);
                      }

                      return sum;
                    }, 0) || 0
                  )}
                </strong>
              </div>
            </div>

            <div className={styles.bookingSection}>
              <h3>Booking History</h3>

              {!selectedCustomer.bookings?.length ? (
                <div className={styles.noBookings}>
                  No bookings found for this customer.
                </div>
              ) : (
                <div className={styles.bookingList}>
                  {[...selectedCustomer.bookings]
                    .sort(
                      (a, b) =>
                        new Date(b.check_in) -
                        new Date(a.check_in)
                    )
                    .map((booking) => (
                      <div
                        className={styles.bookingItem}
                        key={booking.id}
                      >
                        <div>
                          <strong>
                            {booking.booking_reference}
                          </strong>

                          <span>
                            {formatDate(booking.check_in)} —{" "}
                            {formatDate(booking.check_out)}
                          </span>
                        </div>

                        <div className={styles.bookingRight}>
                          <span
                            className={`${styles.status} ${
                              styles[booking.status]
                            }`}
                          >
                            {booking.status}
                          </span>

                          <strong>
                            {formatAmount(booking.amount)}
                          </strong>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;