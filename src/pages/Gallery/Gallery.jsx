import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Gallery.module.scss";
import { motion } from "framer-motion";

import {
  hero1,
  hero2,
  hero3,
  about,
  gallery1,
  gallery2,
  gallery3,
  gallery4,
} from "../../assets";

const images = [
  hero1,
  hero2,
  hero3,
  about,
  gallery1,
  gallery2,
  gallery3,
  gallery4,
];

export default function Gallery() {
  return (
    <>
      <Navbar />

      <section className={styles.hero}>
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Gallery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .2 }}
          >
            Explore every corner of Lake View Villa.
          </motion.p>
        </div>
      </section>

      <section className={styles.gallery}>
        <div className="container">

          <div className={styles.grid}>
            {images.map((img, index) => (
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * .08 }}
              >
                <img
                  src={img}
                  alt={`Villa ${index + 1}`}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}