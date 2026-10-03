import React, { useEffect, useMemo, useState } from "react";


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

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { supabase } from "../../lib/supabaseClient";

import styles from "./Booking.module.scss";

function formatDateForInput(date) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
}

function getNumberOfNights(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const difference = end.getTime() - start.getTime();

  return Math.round(difference / (1000 * 60 * 60 * 24));
}

function Booking() {
  const navigate = useNavigate();

  const [stayType, setStayType] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  const [visitDate, setVisitDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const [formError, setFormError] = useState("");

  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");

  const today = formatDateForInput(new Date());

  /*
    Load availability rules from Supabase.
  */
  useEffect(() => {
    async function fetchAvailability() {
      setAvailabilityLoading(true);
      setAvailabilityError("");

      const { data, error } = await supabase
        .from("availability")
        .select("date, is_available, note")
        .order("date", { ascending: true });

      if (error) {
        console.error("Availability fetch error:", error);
        setAvailabilityError(
          "Unable to load live availability. Please try again."
        );
        setAvailability([]);
      } else {
        setAvailability(data || []);
      }

      setAvailabilityLoading(false);
    }

    fetchAvailability();
  }, []);

  /*
    Only dates explicitly marked unavailable by admin
    are treated as blocked here.

    Dates with no availability entry remain available.
  */
  const unavailableDateMap = useMemo(() => {
    const map = new Map();

    availability.forEach((item) => {
      if (!item.is_available) {
        map.set(item.date, item.note || "This date is unavailable.");
      }
    });

    return map;
  }, [availability]);

  const pricePerGuest = stayType === "day" ? 1500 : 2000;

  /*
    Number of nights and days
  */
  const numberOfNights = useMemo(() => {
    if (stayType === "day") {
      return 0;
    }

    return getNumberOfNights(visitDate, endDate);
  }, [visitDate, endDate, stayType]);

  const numberOfDays = useMemo(() => {
    if (stayType === "day") {
      return visitDate ? 1 : 0;
    }

    if (numberOfNights > 0) {
      return numberOfNights + 1;
    }

    return 0;
  }, [visitDate, numberOfNights, stayType]);

  const totalPrice = useMemo(() => {
    return pricePerGuest * guestCount;
  }, [pricePerGuest, guestCount]);

  /*
    Check whether any selected date is unavailable.
  */
  const unavailableDatesInRange = useMemo(() => {
    if (!visitDate) {
      return [];
    }

    const blockedDates = [];

    if (stayType === "day") {
      if (unavailableDateMap.has(visitDate)) {
        blockedDates.push(visitDate);
      }

      return blockedDates;
    }

    if (!endDate) {
      return [];
    }

    const start = new Date(`${visitDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    const current = new Date(start);

    while (current <= end) {
      const currentDate = formatDateForInput(current);

      if (unavailableDateMap.has(currentDate)) {
        blockedDates.push(currentDate);
      }

      current.setDate(current.getDate() + 1);
    }

    return blockedDates;
  }, [visitDate, endDate, stayType, unavailableDateMap]);

  const isDateRangeUnavailable =
    unavailableDatesInRange.length > 0;

  const firstUnavailableDate =
    unavailableDatesInRange.length > 0
      ? unavailableDatesInRange[0]
      : null;

  const unavailableDateNote = firstUnavailableDate
    ? unavailableDateMap.get(firstUnavailableDate)
    : "";

  const isDateAvailable =
    visitDate &&
    (stayType === "day" || endDate) &&
    !isDateRangeUnavailable &&
    (stayType === "day" || numberOfNights > 0) &&
    !availabilityLoading;

  function handleStayTypeChange(type) {
    setStayType(type);
    setVisitDate("");
    setEndDate("");
    setFormError("");
  }

  function handleStartDateChange(selectedDate) {
    setVisitDate(selectedDate);
    setFormError("");

    if (stayType === "day") {
      setEndDate(selectedDate);
    } else {
      if (
        endDate &&
        new Date(`${endDate}T00:00:00`) <=
          new Date(`${selectedDate}T00:00:00`)
      ) {
        setEndDate("");
      }
    }
  }

  function handleEndDateChange(selectedDate) {
    setEndDate(selectedDate);
    setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setFormError("");

    const phonePattern = /^[6-9]\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!stayType) {
      setFormError("Please choose a stay type.");
      return;
    }

    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!phonePattern.test(phoneNumber)) {
      setFormError(
        "Please enter a valid 10-digit phone number starting with 6, 7, 8 or 9."
      );
      return;
    }

    if (!visitDate) {
      setFormError("Please select a check-in/visit date.");
      return;
    }

    if (stayType === "overnight" && !endDate) {
      setFormError("Please select your check-out date.");
      return;
    }

    if (
      stayType === "overnight" &&
      endDate &&
      new Date(`${endDate}T00:00:00`) <=
        new Date(`${visitDate}T00:00:00`)
    ) {
      setFormError(
        "Check-out date must be after the check-in date."
      );
      return;
    }

    if (availabilityLoading) {
      setFormError(
        "Availability is still loading. Please wait a moment and try again."
      );
      return;
    }

    if (isDateRangeUnavailable) {
      setFormError(
        unavailableDateNote ||
          "One or more selected dates are unavailable. Please choose another date range."
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
        email: email.trim().toLowerCase(),
        phoneNumber,
        visitDate,
        endDate,
        guestCount,
        stayType,
        pricePerGuest,
        totalPrice,
        numberOfDays,
        numberOfNights,
        message,
      },
    });
  }

  return (
    <>
      <Navbar />

      <main className={styles.bookingPage}>
        {/* ================= HERO ================= */}

        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>

          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              Plan Your Escape
            </span>

            <h1>Book Lake View Villa</h1>

            <p>
              Choose your preferred stay, check availability and
              complete your booking securely.
            </p>
          </div>
        </section>

        {/* ================= BOOKING ================= */}

        <section className={styles.bookingSection}>
          <div className={styles.container}>
            <div className={styles.bookingLayout}>
              {/* ================= FORM ================= */}

              <div className={styles.formCard}>
                <div className={styles.sectionHeading}>
                  <span>Villa Reservation</span>

                  <h2>Plan Your Stay</h2>

                  <p>
                    Select your preferred dates and enter your
                    details. You can proceed to payment when the
                    villa is available.
                  </p>
                </div>

                <div className={styles.availabilityNotice}>
                  <CalendarDays size={21} />

                  <div className={styles.availabilityContent}>
                    <div className={styles.timingRow}>
                      <strong>Day Stay</strong>

                      <span>
                        10:00 AM check-in – 6:00 PM check-out
                      </span>
                    </div>

                    <div className={styles.timingRow}>
                      <strong>Day + Night Stay</strong>

                      <span>
                        2:00 PM check-in – 11:00 AM check-out
                      </span>
                    </div>

                    <p>
                      Availability is updated from our booking
                      system. Select your dates below to check
                      availability.
                    </p>
                  </div>
                </div>

                {availabilityError && (
                  <div className={styles.unavailableMessage}>
                    <XCircle size={17} />

                    <span>{availabilityError}</span>
                  </div>
                )}

                {/* ================= FORM ================= */}

                <form
                  className={styles.bookingForm}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* ================= STAY TYPE ================= */}

                  <div className={styles.formGroup}>
                    <label>Choose Stay Type</label>

                    <div className={styles.stayOptions}>
                      <button
                        type="button"
                        className={`${styles.stayOption} ${
                          stayType === "day"
                            ? styles.activeOption
                            : ""
                        }`}
                        onClick={() =>
                          handleStayTypeChange("day")
                        }
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
                          stayType === "overnight"
                            ? styles.activeOption
                            : ""
                        }`}
                        onClick={() =>
                          handleStayTypeChange("overnight")
                        }
                      >
                        <Moon size={24} />

                        <div>
                          <strong>Day + Night Stay</strong>

                          <span>₹2,000 per person</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* ================= PERSONAL DETAILS ================= */}

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fullName">
                        Full Name
                      </label>

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
                      <label htmlFor="email">
                        Email Address
                      </label>

                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setFormError("");
                        }}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phoneNumber">
                        Phone Number
                      </label>

                      <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        maxLength={10}
                        inputMode="numeric"
                        onChange={(event) => {
                          setPhoneNumber(
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          );

                          setFormError("");
                        }}
                      />
                    </div>

                    {/* ================= CHECK-IN ================= */}

                    <div className={styles.formGroup}>
                      <label htmlFor="visitDate">
                        {stayType === "day"
                          ? "Visit Date"
                          : "Check-in Date"}
                      </label>

                      <div className={styles.inputWithIcon}>
                        <CalendarDays size={20} />

                        <input
                          id="visitDate"
                          type="date"
                          min={today}
                          value={visitDate}
                          onChange={(event) =>
                            handleStartDateChange(
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* ================= CHECK-OUT ================= */}

                    {stayType === "overnight" && (
                      <div className={styles.formGroup}>
                        <label htmlFor="endDate">
                          Check-out Date
                        </label>

                        <div className={styles.inputWithIcon}>
                          <CalendarDays size={20} />

                          <input
                            id="endDate"
                            type="date"
                            min={
                              visitDate
                                ? formatDateForInput(
                                    new Date(
                                      new Date(
                                        `${visitDate}T00:00:00`
                                      ).getTime() +
                                        24 *
                                          60 *
                                          60 *
                                          1000
                                    )
                                  )
                                : today
                            }
                            value={endDate}
                            onChange={(event) =>
                              handleEndDateChange(
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* ================= GUESTS ================= */}

                    <div className={styles.formGroup}>
                      <label htmlFor="guestCount">
                        Number of Guests
                      </label>

                      <div className={styles.inputWithIcon}>
                        <Users size={20} />

                        <input
                          id="guestCount"
                          type="number"
                          min="1"
                          max="20"
                          value={guestCount}
                          onChange={(event) => {
                            setGuestCount(
                              Number(event.target.value)
                            );

                            setFormError("");
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ================= AVAILABILITY ================= */}

                  {visitDate &&
                    stayType === "overnight" &&
                    endDate &&
                    numberOfNights > 0 && (
                      <div
                        className={
                          isDateRangeUnavailable
                            ? styles.unavailableMessage
                            : styles.availableMessage
                        }
                        role={
                          isDateRangeUnavailable
                            ? "alert"
                            : "status"
                        }
                      >
                        {isDateRangeUnavailable ? (
                          <XCircle size={17} />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}

                        <span>
                          {isDateRangeUnavailable
                            ? unavailableDateNote ||
                              "One or more selected dates are unavailable."
                            : `Available for ${numberOfNights} ${
                                numberOfNights === 1
                                  ? "night"
                                  : "nights"
                              } / ${numberOfDays} ${
                                numberOfDays === 1
                                  ? "day"
                                  : "days"
                              }.`}
                        </span>
                      </div>
                    )}

                  {visitDate && stayType === "day" && (
                    <div
                      className={
                        isDateRangeUnavailable
                          ? styles.unavailableMessage
                          : styles.availableMessage
                      }
                      role={
                        isDateRangeUnavailable
                          ? "alert"
                          : "status"
                      }
                    >
                      {isDateRangeUnavailable ? (
                        <XCircle size={17} />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}

                      <span>
                        {isDateRangeUnavailable
                          ? unavailableDateNote ||
                            "This date is unavailable."
                          : "This date is currently available — 1 day stay."}
                      </span>
                    </div>
                  )}

                  {/* ================= MESSAGE ================= */}

                  <div className={styles.formGroup}>
                    <label htmlFor="message">
                      Additional Message
                    </label>

                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Mention any special requests or questions"
                      value={message}
                      onChange={(event) => {
                        setMessage(event.target.value);
                        setFormError("");
                      }}
                    />
                  </div>

                  {/* ================= ERROR ================= */}

                  {formError && (
                    <p
                      className={styles.formError}
                      role="alert"
                    >
                      {formError}
                    </p>
                  )}

                  {/* ================= SUBMIT ================= */}

                  <button
                    className={styles.submitButton}
                    type="submit"
                    disabled={
                      availabilityLoading ||
                      isDateRangeUnavailable
                    }
                  >
                    {availabilityLoading
                      ? "Checking Availability..."
                      : isDateRangeUnavailable
                        ? "Selected Date Unavailable"
                        : "Proceed to Payment"}
                  </button>
                </form>
              </div>

              {/* ================= SUMMARY ================= */}

              <aside className={styles.summaryCard}>
                <span className={styles.summaryEyebrow}>
                  Booking Summary
                </span>

                <h2>Your Stay</h2>

                <div className={styles.summaryDetails}>
                  {/* Stay type */}

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

                  {/* Price */}

                  <div>
                    <span>
                      <IndianRupee size={20} />
                      Price Per Guest
                    </span>

                    <strong>
                      ₹
                      {pricePerGuest.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  {/* Guests */}

                  <div>
                    <span>
                      <Users size={20} />
                      Guests
                    </span>

                    <strong>{guestCount}</strong>
                  </div>

                  {/* Check-in */}

                  <div>
                    <span>
                      <CalendarDays size={20} />

                      {stayType === "day"
                        ? "Visit Date"
                        : "Check-in"}
                    </span>

                    <strong>
                      {visitDate || "Not selected"}
                    </strong>
                  </div>

                  {/* Check-out */}

                  {stayType === "overnight" && (
                    <div>
                      <span>
                        <CalendarDays size={20} />
                        Check-out
                      </span>

                      <strong>
                        {endDate || "Not selected"}
                      </strong>
                    </div>
                  )}

                  {/* Duration */}

                  <div>
                    <span>
                      <Clock3 size={20} />
                      Duration
                    </span>

                    <strong>
                      {stayType === "day"
                        ? visitDate
                          ? "1 day"
                          : "Not selected"
                        : numberOfNights > 0
                          ? `${numberOfNights} ${
                              numberOfNights === 1
                                ? "night"
                                : "nights"
                            } / ${numberOfDays} ${
                              numberOfDays === 1
                                ? "day"
                                : "days"
                            }`
                          : "Not selected"}
                    </strong>
                  </div>

                  {/* Timing */}

                  <div>
                    <span>
                      <Clock3 size={20} />
                      Timing
                    </span>

                    <strong>
                      {stayType === "day"
                        ? "10 AM – 6 PM"
                        : "2 PM – 11 AM"}
                    </strong>
                  </div>

                  {/* Availability */}

                  {visitDate &&
                    (stayType === "day" || endDate) && (
                      <div>
                        <span>
                          {isDateRangeUnavailable ? (
                            <XCircle size={20} />
                          ) : (
                            <CheckCircle2 size={20} />
                          )}

                          Availability
                        </span>

                        <strong>
                          {availabilityLoading
                            ? "Checking..."
                            : isDateRangeUnavailable
                              ? "Unavailable"
                              : "Available"}
                        </strong>
                      </div>
                    )}
                </div>

                {/* ================= TOTAL ================= */}

                <div className={styles.totalSection}>
                  <span>Total Amount</span>

                  <strong>
                    ₹
                    {totalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className={styles.notice}>
                  <CheckCircle2 size={21} />

                  <p>
                    Your booking will be confirmed after
                    successful payment. Availability is
                    checked again before payment
                    completion.
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