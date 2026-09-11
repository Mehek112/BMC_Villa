import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Contact.module.scss";
import { Link } from "react-router-dom";

import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Send,
} from "lucide-react";

export default function Contact() {
  return (
    <>
      <Navbar />

      {/* HERO */}

      <section className={styles.hero}>
        <div className="container">

          

          <h1>Let's Plan Your Perfect Getaway</h1>

          <p className={styles.subtitle}>
            Whether you're planning a relaxing weekend, family vacation,
            or celebration with friends, we're here to help make your stay
            effortless from booking to checkout.
          </p>

        </div>
      </section>

      {/* CONTACT CARDS */}

      <section className={styles.cardsSection}>

        <div className="container">

          <div className={styles.cards}>

            <div className={styles.card}>
              <Phone />
              <h3>Call Us</h3>
              <p>+91 XXXXXXXXXX</p>
              <span>Available 9 AM – 9 PM</span>
            </div>

            <div className={styles.card}>
              <MessageCircle />
              <h3>WhatsApp</h3>
              <p>Quick Booking Support</p>
              <span>Replies within a few minutes</span>
            </div>

            <div className={styles.card}>
              <Mail />
              <h3>Email</h3>
              <p>your@email.com</p>
              <span>For bookings & enquiries</span>
            </div>

            <div className={styles.card}>
              <MapPin />
              <h3>Location</h3>
              <p>Samrajya Villa</p>
              <span>Dangurle,Maharashtra</span>
            </div>

          </div>

        </div>

      </section>

      {/* FORM + INFO */}

      <section className={styles.contactSection}>

        <div className="container">

          <div className={styles.wrapper}>

            {/* FORM */}

            <div className={styles.formBox}>

              <p className={styles.smallTitle}>
                SEND AN ENQUIRY
              </p>

              <h2>Book Your Stay</h2>

              <form>

                <input
                  type="text"
                  placeholder="Full Name"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                />

                <div className={styles.two}>

                  <input
                    type="date"
                  />

                  <input
                    type="date"
                  />

                </div>

                <input
                  type="number"
                  placeholder="Number of Guests"
                />

                <textarea
                  rows="6"
                  placeholder="Tell us about your stay..."
                ></textarea>

                <button>

                  <Send size={18} />

                  Send Enquiry

                </button>

              </form>

            </div>

            {/* INFO */}

            <div className={styles.infoBox}>

              <div className={styles.infoCard}>

                <Clock3 />

                <div>

                  <h3>Check-in / Check-out</h3>

                  <p>Check-in : 2:00 PM</p>

                  <p>Check-out : 11:00 AM</p>

                </div>

              </div>

              <div className={styles.infoCard}>

                <ShieldCheck />

                <div>

                  <h3>Payments</h3>

                  <p>

                    UPI • Debit Card • Credit Card

                  </p>

                </div>

              </div>

              <div className={styles.infoCard}>

                <Phone />

                <div>

                  <h3>Emergency Contact</h3>

                  <p>

                    Available throughout your stay.

                  </p>

                  <strong>

                    +91 XXXXXXXXXX

                  </strong>

                </div>

              </div>

              <div className={styles.infoCard}>

                <AlertTriangle />

                <div>

                  <h3>Property Care</h3>

                  <p>

                    Guests are requested to treat the villa
                    with care. Charges may apply for damages
                    after inspection.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MAP */}

      <section className={styles.mapSection}>

        <div className="container">

          <div className={styles.heading}>

         

            <h2>Find Us Easily</h2>

          </div>

          <div className={styles.map}>

            <iframe
              src="https://www.google.com/maps?q=18.841873,73.478177&z=15&output=embed"
              loading="lazy"
              allowFullScreen
              title="Lake View Villa"
            ></iframe>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className={styles.cta}>

        <div className="container">

          <h2>Ready for Your Lakeside Escape?</h2>

          <p>

            Relax, unwind, and create unforgettable memories
            at Lake View Villa.

          </p>

         <Link to="/booking">
          <button>
            Book Your Stay
          </button>
        </Link>

        </div>

      </section>

      <Footer />

    </>
  );
}