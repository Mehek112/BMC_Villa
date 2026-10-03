import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Home,
  CalendarDays,
} from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import styles from "./BookingConfirmation.module.scss";

function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    return (
      <>
        <Navbar />

        <main className={styles.confirmationPage}>
          <div className={styles.emptyState}>
            <h1>Booking Details Not Found</h1>

            <p>
              We could not find your booking details.
              Please make a new booking.
            </p>

            <Link
              to="/booking"
              className={styles.primaryButton}
            >
              Make a Booking
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const checkOut =
    booking.stayType === "day"
      ? booking.visitDate
      : booking.endDate;

  return (
    <>
      <Navbar />

      <main className={styles.confirmationPage}>
        <section className={styles.confirmationCard}>

          <div className={styles.successIcon}>
            <CheckCircle2
              size={58}
              strokeWidth={1.8}
            />
          </div>

          <p className={styles.eyebrow}>
            BOOKING CONFIRMED
          </p>

          <h1>
            Your Stay is Confirmed!
          </h1>

          <p className={styles.intro}>
            Thank you, {booking.fullName}. Your booking at our
            villa has been successfully confirmed.
          </p>

          {booking.bookingReference && (
            <div className={styles.referenceBox}>
              <span>Booking Reference</span>

              <strong>
                {booking.bookingReference}
              </strong>
            </div>
          )}

          <div className={styles.details}>

            <div className={styles.detailItem}>
              <CalendarDays size={22} />

              <div>
                <span>Stay Date</span>

                <strong>
                  {booking.visitDate}

                  {booking.stayType === "overnight" &&
                    checkOut &&
                    ` → ${checkOut}`}
                </strong>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                ₹
              </div>

              <div>
                <span>Total Paid</span>

                <strong>
                  ₹
                  {Number(
                    booking.totalPrice
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                👤
              </div>

              <div>
                <span>Guests</span>

                <strong>
                  {booking.guestCount}
                </strong>
              </div>
            </div>

            <div className={styles.detailItem}>
              <div className={styles.detailIcon}>
                🏡
              </div>

              <div>
                <span>Stay Type</span>

                <strong>
                  {booking.stayType === "day"
                    ? "Day Stay"
                    : "Day + Night Stay"}
                </strong>
              </div>
            </div>

          </div>

          <div className={styles.contactInfo}>
            <h3>
              Booking Details Sent
            </h3>

            <p>
              Your booking details have been recorded
              successfully.

              {booking.email && (
                <>
                  {" "}
                  We will use{" "}
                  <strong>{booking.email}</strong>{" "}
                  for booking communication.
                </>
              )}
            </p>
          </div>

          <div className={styles.actions}>

            <Link
              to="/"
              className={styles.primaryButton}
            >
              <Home size={18} />
              Back to Home
            </Link>

            <Link
              to="/booking"
              className={styles.secondaryButton}
            >
              Make Another Booking
            </Link>

          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

export default BookingConfirmation;