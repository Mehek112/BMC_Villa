import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Moon,
  Sun,
  Users,
  XCircle,
} from "lucide-react";

import styles from "./Booking.module.scss";

function formatDateForInput(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
}

function Booking() {
  const navigate = useNavigate();

  const [stayType, setStayType] = useState("day");
  const [guestCount, setGuestCount] = useState(1);
  const [visitDate, setVisitDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formError, setFormError] = useState("");

  const today = formatDateForInput(new Date());

  // Dummy unavailable dates for frontend testing.
  // Later, replace these with dates from your backend/database.
  const unavailableDates = useMemo(() => {
    const baseDate = new Date();

    return [3, 7, 10].map((numberOfDays) => {
      const unavailableDate = new Date(baseDate);
      unavailableDate.setDate(baseDate.getDate() + numberOfDays);

      return formatDateForInput(unavailableDate);
    });
  }, []);

  const pricePerGuest = stayType === "day" ? 1500 : 2000;

  const totalPrice = useMemo(() => {
    return pricePerGuest * guestCount;
  }, [pricePerGuest, guestCount]);

  const isDateUnavailable =
    visitDate !== "" && unavailableDates.includes(visitDate);

  const isDateAvailable = visitDate !== "" && !isDateUnavailable;

  function handleDateChange(selectedDate) {
    setVisitDate(selectedDate);
    setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const phonePattern = /^[6-9]\d{9}$/;

    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!phonePattern.test(phoneNumber)) {
      setFormError(
        "Please enter a valid 10-digit phone number starting with 6, 7, 8 or 9.",
      );
      return;
    }

    if (!visitDate) {
      setFormError("Please select a visit date.");
      return;
    }

    if (isDateUnavailable) {
      setFormError(
        "The selected date is already booked. Please choose another date.",
      );
      return;
    }

    if (
      !Number.isFinite(guestCount) ||
      guestCount < 1 ||
      guestCount > 20
    ) {
      setFormError("Guest count must be between 1 and 20.");
      return;
    }

    navigate("/payment", {
      state: {
        fullName: fullName.trim(),
        phoneNumber,
        visitDate,
        guestCount,
        stayType,
        pricePerGuest,
        totalPrice,
      },
    });
  }

  return (
    <>
      <Navbar />
    <main className={styles.bookingPage}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Plan Your Escape</span>

          <h1>Book Lake View Villa</h1>

          <p>
            Choose your preferred stay, check availability and complete your
            booking securely.
          </p>
        </div>
      </section>

      <section className={styles.bookingSection}>
        <div className={styles.container}>
          <div className={styles.bookingLayout}>
            <div className={styles.formCard}>
              <div className={styles.sectionHeading}>
                <span>Villa Reservation</span>

                <h2>Plan Your Stay</h2>

                <p>
                  Select your preferred date and enter your details. You can
                  proceed to payment when the villa is available.
                </p>
              </div>

              <div className={styles.availabilityNotice}>
                <CalendarDays size={21} />

                <p>
                  Some dates may already have confirmed bookings. Select a date
                  below to check the villa's availability.
                </p>
              </div>

              <form
                className={styles.bookingForm}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className={styles.formGroup}>
                  <label>Choose Stay Type</label>

                  <div className={styles.stayOptions}>
                    <button
                      type="button"
                      className={`${styles.stayOption} ${
                        stayType === "day" ? styles.activeOption : ""
                      }`}
                      onClick={() => {
                        setStayType("day");
                        setFormError("");
                      }}
                    >
                      <Sun size={24} />

                      <div>
                        <strong>Day Stay</strong>
                        <span>₹1,500 per person</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`${styles.stayOption} ${
                        stayType === "overnight" ? styles.activeOption : ""
                      }`}
                      onClick={() => {
                        setStayType("overnight");
                        setFormError("");
                      }}
                    >
                      <Moon size={24} />

                      <div>
                        <strong>Day + Night Stay</strong>
                        <span>₹2,000 per person</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">Full Name</label>

                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                        setFormError("");
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone Number</label>

                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      maxLength={10}
                      inputMode="numeric"
                      onChange={(event) => {
                        setPhoneNumber(
                          event.target.value.replace(/\D/g, ""),
                        );
                        setFormError("");
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="visitDate">Visit Date</label>

                    <div className={styles.inputWithIcon}>
                      <CalendarDays size={20} />

                      <input
                        id="visitDate"
                        type="date"
                        min={today}
                        value={visitDate}
                        onChange={(event) =>
                          handleDateChange(event.target.value)
                        }
                      />
                    </div>

                    {isDateAvailable && (
                      <p className={styles.availableMessage} role="status">
                        <CheckCircle2 size={17} />
                        This date is currently available.
                      </p>
                    )}

                    {isDateUnavailable && (
                      <p className={styles.unavailableMessage} role="alert">
                        <XCircle size={17} />
                        This date is already booked. Please choose another
                        date.
                      </p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="guestCount">Number of Guests</label>

                    <div className={styles.inputWithIcon}>
                      <Users size={20} />

                      <input
                        id="guestCount"
                        type="number"
                        min="1"
                        max="20"
                        value={guestCount}
                        onChange={(event) => {
                          setGuestCount(Number(event.target.value));
                          setFormError("");
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Additional Message</label>

                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Mention any special requests or questions"
                  ></textarea>
                </div>

                {formError && (
                  <p className={styles.formError} role="alert">
                    {formError}
                  </p>
                )}

                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={isDateUnavailable}
                >
                  {isDateUnavailable
                    ? "Selected Date Unavailable"
                    : "Proceed to Payment"}
                </button>
              </form>
            </div>

            <aside className={styles.summaryCard}>
              <span className={styles.summaryEyebrow}>Booking Summary</span>

              <h2>Your Stay</h2>

              <div className={styles.summaryDetails}>
                <div>
                  <span>
                    {stayType === "day" ? (
                      <Sun size={20} />
                    ) : (
                      <Moon size={20} />
                    )}
                    Stay Type
                  </span>

                  <strong>
                    {stayType === "day"
                      ? "Day Stay"
                      : "Day + Night Stay"}
                  </strong>
                </div>

                <div>
                  <span>
                    <IndianRupee size={20} />
                    Price Per Guest
                  </span>

                  <strong>
                    ₹{pricePerGuest.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>
                    <Users size={20} />
                    Guests
                  </span>

                  <strong>{guestCount}</strong>
                </div>

                <div>
                  <span>
                    <Clock3 size={20} />
                    Date
                  </span>

                  <strong>{visitDate || "Not selected"}</strong>
                </div>

                {visitDate && (
                  <div>
                    <span>
                      {isDateUnavailable ? (
                        <XCircle size={20} />
                      ) : (
                        <CheckCircle2 size={20} />
                      )}
                      Availability
                    </span>

                    <strong>
                      {isDateUnavailable
                        ? "Already Booked"
                        : "Available"}
                    </strong>
                  </div>
                )}
              </div>

              <div className={styles.totalSection}>
                <span>Total Amount</span>

                <strong>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className={styles.notice}>
                <CheckCircle2 size={21} />

                <p>
                  Your booking will be confirmed after successful payment.
                  Availability is checked again before payment completion.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
     <Footer />
    </>
  );
}
export default Booking;