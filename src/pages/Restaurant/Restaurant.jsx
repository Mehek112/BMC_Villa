import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Restaurant.module.scss";

import {
  UtensilsCrossed,
  CircleCheck,
  Coffee,
  Soup,
  Drumstick,
  Phone,
  MessageCircle,
  Clock3,
  Leaf,
  HeartHandshake,
} from "lucide-react";

export default function Restaurant() {
  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}

      <section className={styles.hero}>
        <div className="container">

          <span className={styles.tag}>
            IN-HOUSE DINING
          </span>

          <h1>
            Premium Food Adventure
          </h1>

          <p>
            Enjoy freshly prepared home-style meals during your stay at
            Lake View Villa. Every meal is thoughtfully crafted to make
            your vacation even more relaxing and memorable.
          </p>

          <div className={styles.heroCard}>

            <div>
              <h2>₹2,000</h2>
              <span>Per Person</span>
            </div>

            <div className={styles.line}></div>

            <div className={styles.includes}>
              <span>Dinner</span>
              <span>Breakfast</span>
              <span>Lunch</span>
              <span>Tea / Coffee</span>
            </div>

          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section className={styles.about}>
        <div className="container">

          <div className={styles.aboutCard}>

            <div className={styles.iconBox}>
              <UtensilsCrossed size={34} />
            </div>

            <div>

              <h2>Dining at Lake View Villa</h2>

              <p>
                Whether you're starting your day with a hearty breakfast,
                enjoying a traditional lunch, or ending the evening with a
                delicious dinner, our in-house dining experience ensures
                every meal feels comforting and satisfying.
              </p>

              <p>
                Fresh ingredients, authentic flavours, and warm hospitality
                come together to create a memorable culinary experience for
                every guest.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ================= PACKAGE ================= */}

      <section className={styles.package}>
        <div className="container">

          <div className={styles.packageCard}>

            <span className={styles.smallTitle}>
              PREMIUM PACKAGE
            </span>

            <h2>
              What's Included
            </h2>

            <div className={styles.packageGrid}>

              <div>
                <CircleCheck size={18} />
                Dinner
              </div>

              <div>
                <CircleCheck size={18} />
                Breakfast
              </div>

              <div>
                <CircleCheck size={18} />
                Lunch
              </div>

              <div>
                <CircleCheck size={18} />
                Evening Tea / Coffee
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= MENU ================= */}

      <section className={styles.menu}>
        <div className="container">

          <div className={styles.heading}>

            <p>OUR MENU</p>

            <h2>Freshly Prepared Every Day</h2>

          </div>

          <div className={styles.menuGrid}>

            {/* DINNER */}

            <div className={styles.menuCard}>

              <div className={styles.menuIcon}>
                <Drumstick />
              </div>

              <h3>Dinner</h3>

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

            {/* BREAKFAST */}

            <div className={styles.menuCard}>

              <div className={styles.menuIcon}>
                <Coffee />
              </div>

              <h3>Breakfast</h3>

              <ul>

                <li>Tea / Coffee</li>
                <li>Misal Pav</li>
                <li>Poha</li>
                <li>Burji Pav</li>
                <li>Omelette</li>

              </ul>

            </div>

            {/* LUNCH */}

            <div className={styles.menuCard}>

              <div className={styles.menuIcon}>
                <Soup />
              </div>

              <h3>Lunch</h3>

              <ul>

                <li>Veg Subzi</li>
                <li>Chicken Sukka</li>
                <li>Dal Rice</li>
                <li>Bhakri</li>
                <li>Papad</li>
                <li>Fresh Salad</li>

              </ul>

            </div>

            {/* EVENING */}

            <div className={styles.menuCard}>

              <div className={styles.menuIcon}>
                <Coffee />
              </div>

              <h3>Evening Refreshments</h3>

              <ul>

                <li>Tea</li>
                <li>Coffee</li>

              </ul>

            </div>

          </div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className={styles.features}>

        <div className="container">

          <div className={styles.heading}>

            <p>WHY DINE WITH US</p>

            <h2>More Than Just Great Food</h2>

          </div>

          <div className={styles.featureGrid}>

            <div className={styles.featureCard}>

              <Leaf />

              <h3>Fresh Ingredients</h3>

              <p>
                Prepared daily using quality ingredients and traditional recipes.
              </p>

            </div>

            <div className={styles.featureCard}>

              <HeartHandshake />

              <h3>Home-style Cooking</h3>

              <p>
                Delicious meals that make you feel at home while on vacation.
              </p>

            </div>

            <div className={styles.featureCard}>

              <Coffee />

              <h3>Complete Meal Plan</h3>

              <p>
                Breakfast, lunch, dinner and evening refreshments included.
              </p>

            </div>

            <div className={styles.featureCard}>

              <Clock3 />

              <h3>Made Fresh</h3>

              <p>
                Every meal is freshly prepared during your stay for the best taste.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className={styles.cta}>

        <div className="container">

          <h2>
            Reserve Your Dining Experience
          </h2>

          <p>
            Enjoy delicious meals throughout your stay. Contact us before
            your arrival to reserve the Premium Food Adventure package.
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