import React from "react";
import styles from "./GalleryPreview.module.scss";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  gallery1,
  gallery2,
  gallery3,
  gallery4,
} from "../../assets";

export default function GalleryPreview() {

  const images = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
  ];

  return (
    <section className={`section-white ${styles.gallery}`}>

      <div className="container">

        <div className="section-heading">

          <p>GALLERY</p>

          <h2>A Glimpse of Your Stay</h2>

          <span>
            Every corner of Lake View Villa is designed to help you
            relax, unwind, and create unforgettable memories.
          </span>

        </div>

        <motion.div
          className={styles.grid}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >

          <div className={`${styles.image} ${styles.large}`}>

            <img
              src={images[0]}
              alt="Lake View Villa Exterior"
              loading="lazy"
            />

          </div>

          <div className={styles.right}>

            <div className={styles.image}>

              <img
                src={images[1]}
                alt="Private Swimming Pool"
                loading="lazy"
              />

            </div>

            <div className={styles.image}>

              <img
                src={images[2]}
                alt="Villa Interior"
                loading="lazy"
              />

            </div>

            <Link
              to="/gallery"
              className={`${styles.image} ${styles.last}`}
            >

              <img
                src={images[3]}
                alt="Luxury Bedroom"
                loading="lazy"
              />

              <div className={styles.overlay}>

                <h3>View Gallery</h3>

                <p>See All Photos</p>

                <ArrowRight size={20} />

              </div>

            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}