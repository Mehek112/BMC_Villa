import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard } from "lucide-react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import styles from "./Payment.module.scss";


function Payment() {

  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;



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



  function handlePayment() {

    alert(
      "Dummy payment successful. Booking confirmed."
    );

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
              >

                Pay ₹{booking.totalPrice.toLocaleString("en-IN")}

              </button>





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