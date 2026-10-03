import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Eye,
  RefreshCw,
  Search,
  X,
  XCircle,
  Clock3,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./AdminPayments.module.scss";

function AdminPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setError("");

    const { data, error: fetchError } = await supabase
      .from("payments")
      .select(`
        id,
        booking_id,
        amount,
        payment_status,
        transaction_id,
        created_at,
        refund_status,
        refund_amount,
        refunded_at,
        bookings (
          booking_reference,
          check_in,
          check_out,
          stay_type,
          guests,
          status,
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
      setPayments([]);
    } else {
      setPayments(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return payments.filter((payment) => {
      const booking = payment.bookings;
      const customer = booking?.customers;

      const matchesSearch =
        !search ||
        customer?.name?.toLowerCase().includes(search) ||
        customer?.email?.toLowerCase().includes(search) ||
        customer?.phone?.toLowerCase().includes(search) ||
        booking?.booking_reference?.toLowerCase().includes(search) ||
        payment.transaction_id?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        payment.payment_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const totalAmount = payments.reduce((sum, payment) => {
    if (payment.payment_status === "successful") {
      return sum + Number(payment.amount || 0);
    }

    return sum;
  }, 0);

  const pendingCount = payments.filter(
    (payment) => payment.payment_status === "pending"
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.payment_status === "failed"
  ).length;

  const refundedAmount = payments.reduce((sum, payment) => {
    if (
      payment.refund_status === "successful" ||
      payment.refund_status === "pending"
    ) {
      return sum + Number(payment.refund_amount || 0);
    }

    return sum;
  }, 0);

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  const getStatusClass = (status) => {
    return styles[status] || "";
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
                <CreditCard size={24} />
              </div>

              <div>
                <h1>Payments</h1>
                <p>View payment transactions and refund information.</p>
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
              <CreditCard size={20} />
            </div>

            <div>
              <span>Total Payments</span>
              <strong>{payments.length}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Successful Amount</span>
              <strong>{formatAmount(totalAmount)}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <XCircle size={20} />
            </div>

            <div>
              <span>Failed</span>
              <strong>{failedCount}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <RotateCcw size={20} />
            </div>

            <div>
              <span>Refund Amount</span>
              <strong>{formatAmount(refundedAmount)}</strong>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search customer, booking or transaction..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className={styles.filterWrapper}>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className={styles.resultCount}>
            {filteredPayments.length}{" "}
            {filteredPayments.length === 1 ? "payment" : "payments"}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Payments Table */}
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.emptyState}>
              <RefreshCw className={styles.spinning} size={28} />
              <p>Loading payments...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className={styles.emptyState}>
              <CreditCard size={34} />
              <h3>No payments found</h3>
              <p>
                {searchTerm || statusFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Payment records will appear here."}
              </p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Booking</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Refund</th>
                    <th>Transaction</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => {
                    const customer = payment.bookings?.customers;

                    return (
                      <tr key={payment.id}>
                        <td>
                          <div className={styles.customerCell}>
                            <strong>
                              {customer?.name || "Unknown Customer"}
                            </strong>
                            <span>{customer?.email || "—"}</span>
                          </div>
                        </td>

                        <td>
                          <div className={styles.bookingCell}>
                            <strong>
                              {payment.bookings?.booking_reference || "—"}
                            </strong>

                            <span>
                              {formatDate(payment.bookings?.check_in)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <strong className={styles.amount}>
                            {formatAmount(payment.amount)}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${getStatusClass(
                              payment.payment_status
                            )}`}
                          >
                            {payment.payment_status}
                          </span>
                        </td>

                        <td>
                          {payment.refund_status &&
                          payment.refund_status !== "not_applicable" ? (
                            <div className={styles.refundCell}>
                              <span
                                className={`${styles.refundStatus} ${
                                  styles[payment.refund_status]
                                }`}
                              >
                                {payment.refund_status}
                              </span>

                              {payment.refund_amount && (
                                <small>
                                  {formatAmount(payment.refund_amount)}
                                </small>
                              )}
                            </div>
                          ) : (
                            <span className={styles.notApplicable}>—</span>
                          )}
                        </td>

                        <td>
                          <span className={styles.transactionId}>
                            {payment.transaction_id || "—"}
                          </span>
                        </td>

                        <td>{formatDate(payment.created_at)}</td>

                        <td>
                          <button
                            type="button"
                            className={styles.viewButton}
                            onClick={() =>
                              setSelectedPayment(payment)
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

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>Payment Details</h2>
                <p>
                  {selectedPayment.bookings?.booking_reference || "Payment"}
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedPayment(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.amountBox}>
                <span>Payment Amount</span>
                <strong>
                  {formatAmount(selectedPayment.amount)}
                </strong>

                <span
                  className={`${styles.status} ${
                    styles[selectedPayment.payment_status]
                  }`}
                >
                  {selectedPayment.payment_status}
                </span>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span>Customer</span>
                  <strong>
                    {selectedPayment.bookings?.customers?.name || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Email</span>
                  <strong>
                    {selectedPayment.bookings?.customers?.email || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Phone</span>
                  <strong>
                    {selectedPayment.bookings?.customers?.phone || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Booking Reference</span>
                  <strong>
                    {selectedPayment.bookings?.booking_reference || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Stay Dates</span>
                  <strong>
                    {formatDate(selectedPayment.bookings?.check_in)}
                    {" — "}
                    {formatDate(selectedPayment.bookings?.check_out)}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Stay Type</span>
                  <strong>
                    {selectedPayment.bookings?.stay_type || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Guests</span>
                  <strong>
                    {selectedPayment.bookings?.guests || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Booking Status</span>
                  <strong>
                    {selectedPayment.bookings?.status || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Transaction ID</span>
                  <strong className={styles.breakText}>
                    {selectedPayment.transaction_id || "—"}
                  </strong>
                </div>

                <div className={styles.detailItem}>
                  <span>Payment Date</span>
                  <strong>
                    {formatDateTime(selectedPayment.created_at)}
                  </strong>
                </div>
              </div>

              <div className={styles.refundBox}>
                <div className={styles.refundTitle}>
                  <RotateCcw size={17} />
                  <h3>Refund Information</h3>
                </div>

                <div className={styles.refundGrid}>
                  <div>
                    <span>Refund Status</span>
                    <strong>
                      {selectedPayment.refund_status || "Not applicable"}
                    </strong>
                  </div>

                  <div>
                    <span>Refund Amount</span>
                    <strong>
                      {selectedPayment.refund_amount
                        ? formatAmount(selectedPayment.refund_amount)
                        : "₹0"}
                    </strong>
                  </div>

                  <div>
                    <span>Refunded At</span>
                    <strong>
                      {formatDateTime(selectedPayment.refunded_at)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className={styles.demoNotice}>
                <strong>Payment gateway</strong>
                <p>
                  Refund records are currently managed in the admin system.
                  The real payment gateway and automatic refund processing
                  will be connected later.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;