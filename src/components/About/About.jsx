import React from "react";
import styles from "./About.module.scss";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { about } from "../../assets";

export default function About() {

  const features = [
    "Private Swimming Pool",
    "Scenic Lake View",
    "6 Spacious Bedrooms",
    "Perfect for Families & Groups"
  ];

  return (
    <section className={`section-warm ${styles.about}`}>

      <div className="container">

        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >

          <div className={styles.image}>

            <img
              src={about}
              alt="Lake View Villa"
              loading="lazy"
            />

          </div>

          <div className={styles.content}>

            <p className={styles.tag}>
              ABOUT THE VILLA
            </p>

            <h2>
              Experience Peace, Comfort & Luxury
            </h2>

            <p className={styles.description}>
              Nestled amidst serene surroundings, Lake View Villa
              offers a luxurious escape with a private pool,
              spacious interiors, and breathtaking lake views.
              Whether you're planning a family vacation or a
              weekend getaway, the villa is designed to make every
              stay memorable.
            </p>

            <div className={styles.features}>

              {features.map((feature, index) => (

                <div
                  className={styles.feature}
                  key={index}
                >

                  <CheckCircle2 size={20} />

                  <span>{feature}</span>

                </div>

              ))}

            </div>

            <button>
              Explore Gallery
            </button>

          </div>

        </motion.div>

      </div>

    </section>
  );
}