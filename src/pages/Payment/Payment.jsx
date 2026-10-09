// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ArrowLeft, CheckCircle2, CreditCard } from "lucide-react";

// import Navbar from "../../components/Navbar/Navbar";
// import Footer from "../../components/Footer/Footer";

// import styles from "./Payment.module.scss";
// import { supabase } from "../../lib/supabaseClient";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard } from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { supabase } from "../../lib/supabaseClient";

import styles from "./Payment.module.scss";


function Payment() {

  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;
  console.log("BOOKING DATA:", {
    ...booking,
    visitDate: booking?.visitDate,
    endDate: booking?.endDate,
    stayType: booking?.stayType,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");



  if (!booking) {
    return (
      <>
        <Navbar />

        <main className={styles.emptyPage}>

          <h1>
            No booking details found
          </h1>


          <p>
            Please complete the booking form first.
          </p>


          <button
            type="button"
            onClick={() => navigate("/booking")}
          >
            Return to Booking
          </button>


        </main>

        <Footer />
      </>
    );
  }



  // function handlePayment() {

  //   alert(
  //     "Dummy payment successful. Booking confirmed."
  //   );

  // }
  async function handlePayment() {
    if (isProcessing) return;

    setPaymentError("");

    // Validate booking data before calling Supabase
    if (!booking) {
      setPaymentError(
        "Booking details are missing. Please return to the booking page."
      );
      return;
    }

    const checkIn = booking.visitDate?.trim();

    const checkOut =
      booking.stayType === "day"
        ? booking.visitDate?.trim()
        : booking.endDate?.trim();

    console.log("PAYMENT DATE CHECK:", {
      stayType: booking.stayType,
      checkIn,
      checkOut,
      visitDate: booking.visitDate,
      endDate: booking.endDate,
    });

    if (!checkIn) {
      setPaymentError(
        "Check-in date is missing. Please return to the booking page and select a date."
      );
      return;
    }

    if (!checkOut) {
      setPaymentError(
        "Check-out date is missing. Please return to the booking page and select your dates."
      );
      return;
    }

    if (!booking.fullName?.trim()) {
      setPaymentError(
        "Guest name is missing. Please return to the booking page."
      );
      return;
    }

    if (!booking.email?.trim()) {
      setPaymentError(
        "Email address is missing. Please return to the booking page."
      );
      return;
    }

    if (!booking.phoneNumber?.trim()) {
      setPaymentError(
        "Phone number is missing. Please return to the booking page."
      );
      return;
    }

    if (!booking.stayType) {
      setPaymentError(
        "Stay type is missing. Please return to the booking page."
      );
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.rpc(
        "create_booking",
        {
          p_name: booking.fullName.trim(),
          p_email: booking.email.trim().toLowerCase(),
          p_phone: booking.phoneNumber.trim(),
          p_check_in: checkIn,
          p_check_out: checkOut,
          p_guests: Number(booking.guestCount),
          p_stay_type: booking.stayType,
          p_amount: Number(booking.totalPrice),
          p_transaction_id: `DEMO-${Date.now()}`,
        }
      );

      if (error) {
        console.error("Booking creation error:", error);
        throw new Error(
          error.message || "Unable to create booking."
        );
      }

      console.log("BOOKING CREATED:", data);


      if (!data?.success) {
        throw new Error("Booking could not be completed.");
      }

      // Send the booking confirmation email.
      try {
        const { error: emailError } = await supabase.functions.invoke(
          "send-booking-confirmation",
          {
            body: {
              booking_id: data.booking_id,
              booking_reference: data.booking_reference,
            },
          }
        );

        if (emailError) {
          console.error("Confirmation email error:", emailError);
        } else {
          console.log("Confirmation email request completed.");
        }
      } catch (emailError) {
        // Email failure should not undo an already-confirmed booking.
        console.error("Could not request confirmation email:", emailError);
      }

      // Continue to the confirmation page.
      navigate("/booking-confirmation", {
        state: {
          ...booking,
          bookingId: data.booking_id,
          bookingReference: data.booking_reference,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);

      setPaymentError(
        error.message ||
        "Something went wrong while confirming your booking. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  }



  return (

    <>

      <Navbar />


      <main className={styles.paymentPage}>

        <div className={styles.container}>


          <button
            className={styles.backButton}
            type="button"
            onClick={() => navigate("/booking")}
          >

            <ArrowLeft size={20} />

            Back to Booking

          </button>




          <div className={styles.paymentLayout}>


            <section className={styles.paymentCard}>


              <div className={styles.iconWrapper}>

                <CreditCard size={32} />

              </div>



              <span className={styles.eyebrow}>
                Secure Checkout
              </span>



              <h1>
                Complete Your Payment
              </h1>



              <p>
                Your selected date is currently available.
                Complete the payment to confirm your villa booking.
              </p>




              <div className={styles.paymentOptions}>


                <label className={styles.paymentOption}>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    defaultChecked
                  />

                  <span>
                    UPI Payment
                  </span>

                </label>




                <label className={styles.paymentOption}>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                  />

                  <span>
                    Credit or Debit Card
                  </span>

                </label>




                <label className={styles.paymentOption}>

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                  />

                  <span>
                    Net Banking
                  </span>

                </label>



              </div>





              <button
                className={styles.payButton}
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Confirming Booking..."
                  : `Pay ₹${booking.totalPrice.toLocaleString("en-IN")}`}
              </button>

              {paymentError && (
                <p className={styles.paymentError} role="alert">
                  {paymentError}
                </p>
              )}





              <div className={styles.secureNotice}>

                <CheckCircle2 size={20} />

                <p>
                  This is currently a demo payment page.
                </p>

              </div>



            </section>







            <aside className={styles.summaryCard}>


              <span>
                Booking Summary
              </span>



              <h2>
                Lake View Villa
              </h2>




              <div className={styles.summaryDetails}>


                <div>
                  <span>Name</span>

                  <strong>
                    {booking.fullName}
                  </strong>

                </div>



                <div>
                  <span>Phone Number</span>

                  <strong>
                    {booking.phoneNumber}
                  </strong>

                </div>



                <div>
                  <span>Visit Date</span>

                  <strong>
                    {booking.visitDate}
                  </strong>

                </div>




                <div>

                  <span>
                    Stay Type
                  </span>


                  <strong>

                    {
                      booking.stayType === "day"
                        ? "Day Stay"
                        : "Day + Night Stay"
                    }

                  </strong>

                </div>





                <div>

                  <span>
                    Guests
                  </span>


                  <strong>
                    {booking.guestCount}
                  </strong>

                </div>





                <div>

                  <span>
                    Price Per Guest
                  </span>


                  <strong>
                    ₹{booking.pricePerGuest.toLocaleString("en-IN")}
                  </strong>

                </div>



              </div>






              <div className={styles.totalSection}>


                <span>
                  Total Amount
                </span>



                <strong>
                  ₹{booking.totalPrice.toLocaleString("en-IN")}
                </strong>



              </div>



            </aside>




          </div>


        </div>


      </main>



      <Footer />


    </>

  );

}


export default Payment;