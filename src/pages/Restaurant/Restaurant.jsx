import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import {
  Coffee,
  Soup,
  Drumstick,
  Phone,
  MessageCircle,
  Clock3,
  Leaf,
  HeartHandshake,
  UtensilsCrossed,
  Check,
} from "lucide-react";

import styles from "./Restaurant.module.scss";

import {
  gallery1,
  gallery14,
  gallery15,
  gallery16,
  gallery17,
  gallery18,
} from "../../assets";

export default function Restaurant() {
  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}

      <section className={styles.hero}>

        <div className={styles.heroImage}>
          <img src={gallery1} alt="Dining experience at Lake View Villa" />
        </div>

        <div className={styles.heroOverlay}></div>

        <div className={`container ${styles.heroContent}`}>

          <span className={styles.heroTag}>
            IN-HOUSE DINING
          </span>

          <h1>
            A Taste of Home,
            <br />
            Away From Home
          </h1>

          <p>
            Enjoy freshly prepared meals, traditional flavours and warm
            hospitality throughout your stay at Lake View Villa.
          </p>

          <a href="#menu" className={styles.heroButton}>
            Explore Our Menu
          </a>

        </div>

        <div className={styles.priceCard}>

          <div className={styles.price}>
            <span>Premium Food Adventure</span>
            <strong>₹2,000</strong>
            <small>per person</small>
          </div>

          <div className={styles.priceDivider}></div>

          <div className={styles.packageItems}>
            <span>
              <Check size={16} />
              Dinner
            </span>

            <span>
              <Check size={16} />
              Breakfast
            </span>

            <span>
              <Check size={16} />
              Lunch
            </span>

            <span>
              <Check size={16} />
              Tea / Coffee
            </span>
          </div>

        </div>

      </section>


      {/* ================= INTRO ================= */}

      <section className={styles.intro}>

        <div className="container">

          <div className={styles.introGrid}>

            <div className={styles.introImage}>

              <img
                src={gallery14}
                alt="Food experience at Lake View Villa"
              />

              <div className={styles.imageBadge}>
                <UtensilsCrossed size={20} />
                <span>Freshly Prepared</span>
              </div>

            </div>

            <div className={styles.introContent}>

              <span className={styles.sectionTag}>
                DINE WITH US
              </span>

              <h2>
                Good Food Makes
                <br />
                Great Memories
              </h2>

              <p>
                At Lake View Villa, dining is more than just a meal. We
                bring together fresh ingredients, comforting home-style
                cooking and authentic flavours to make every meal part of
                your holiday experience.
              </p>

              <p>
                Whether you're starting your morning with breakfast,
                enjoying a relaxed lunch or gathering around the table for
                dinner, our meals are prepared fresh for our guests.
              </p>

              <div className={styles.introHighlights}>

                <div>
                  <Leaf size={20} />
                  <span>Fresh Ingredients</span>
                </div>

                <div>
                  <HeartHandshake size={20} />
                  <span>Home-style Cooking</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= MENU ================= */}

      <section className={styles.menu} id="menu">

        <div className="container">

          <div className={styles.menuHeading}>

            <span className={styles.sectionTag}>
              OUR MENU
            </span>

            <h2>
              Freshly Prepared Every Day
            </h2>

            <p>
              Enjoy a selection of comforting favourites prepared fresh during your stay.
            </p>

          </div>

          <div className={styles.menuLayout}>

            {/* DINNER */}
            <div className={styles.menuItem}>
              <div className={styles.menuImage}>
                <img src={gallery15} alt="Breakfast at Lake View Villa" />
                <div className={styles.menuIcon}>
                  <Coffee size={22} />
                </div>
              </div>

              <div className={styles.menuContent}>
                <div className={styles.menuTitle}>
                  <div>
                    
                    <h3>Breakfast</h3>
                  </div>

                  
                </div>

                <ul>
                  <li>Tea / Coffee</li>
                  <li>Misal Pav</li>
                  <li>Poha</li>
                  <li>Burji Pav</li>
                  <li>Omelette</li>
                </ul>
              </div>
            </div>

            <div className={styles.menuItem}>
              <div className={styles.menuImage}>
                <img src={gallery16} alt="Lunch at Lake View Villa" />
                <div className={styles.menuIcon}>
                  <Soup size={22} />
                </div>
              </div>

              <div className={styles.menuContent}>
                <div className={styles.menuTitle}>
                  <div>
                  
                    <h3>Lunch</h3>
                  </div>

                 
                </div>

                <ul>
                  <li>Veg Subzi</li>
                  <li>Chicken Sukka</li>
                  <li>Dal Rice</li>
                  <li>Bhakri</li>
                  <li>Papad</li>
                  <li>Fresh Salad</li>
                </ul>
              </div>
            </div>

            <div className={styles.menuItem}>
              <div className={styles.menuImage}>
                <img src={gallery17} alt="Evening refreshments at Lake View Villa" />
                <div className={styles.menuIcon}>
                  <Coffee size={22} />
                </div>
              </div>

              <div className={styles.menuContent}>
                <div className={styles.menuTitle}>
                  <div>
                   
                    <h3>Evening Refreshments</h3>
                  </div>

                  
                </div>

                <ul>
                  <li>Tea</li>
                  <li>Coffee</li>
                </ul>
              </div>
            </div>
            <div className={styles.menuItem}>
              <div className={styles.menuImage}>
                <img src={gallery18} alt="Dinner at Lake View Villa" />
                <div className={styles.menuIcon}>
                  <Drumstick size={22} />
                </div>
              </div>

              <div className={styles.menuContent}>
                <div className={styles.menuTitle}>
                  <div>
                   
                    <h3>Dinner</h3>
                  </div>

                  
                </div>

                <ul>
                  <li>Chicken Starter</li>
                  <li>Chicken Curry</li>
                  <li>Veg Subzi</li>
                  <li>Bhakri</li>
                  <li>Dal Rice</li>
                  <li>Papad</li>
                  <li>Fresh Salad</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </section>


      {/* ================= DINING EXPERIENCE ================= */}

      <section className={styles.experience}>

        <div className="container">

          <div className={styles.experienceHeading}>

            <span className={styles.sectionTag}>
              THE DINING EXPERIENCE
            </span>

            <h2>
              Simple Food.
              <br />
              Beautiful Moments.
            </h2>

          </div>

          <div className={styles.experienceGrid}>

            <div className={styles.experienceCard}>

              <Leaf size={28} />

              <h3>Fresh Ingredients</h3>

              <p>
                Quality ingredients are selected and prepared fresh for
                every meal.
              </p>

            </div>

            <div className={styles.experienceCard}>

              <HeartHandshake size={28} />

              <h3>Home-style Cooking</h3>

              <p>
                Familiar flavours and comforting recipes that make you
                feel right at home.
              </p>

            </div>

            <div className={styles.experienceCard}>

              <Clock3 size={28} />

              <h3>Freshly Prepared</h3>

              <p>
                Meals are prepared during your stay so you can enjoy them
                at their freshest.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className={styles.cta}>

        <div className="container">

          <span className={styles.sectionTag}>
            PLAN YOUR MEALS
          </span>

          <h2>
            Make Your Stay
            <br />
            Even More Delicious
          </h2>

          <p>
            Reserve our Premium Food Adventure package before your arrival
            and enjoy freshly prepared meals throughout your stay.
          </p>

          <div className={styles.contactButtons}>

            <a href="tel:8450996544">
              <Phone size={18} />
              8450996544
            </a>

            <a
              href="https://wa.me/918450996544"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>

            <a href="tel:9920967770">
              <Phone size={18} />
              9920967770
            </a>

          </div>

        </div>

      </section>


      <Footer />
    </>
  );
}