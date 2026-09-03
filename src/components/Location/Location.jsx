import React from "react";
import styles from "./Location.module.scss";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export default function Location() {
  return (
    <section className={`section-soft ${styles.location}`}>

      <div className="container">

        <div className="section-heading">
         

          <h2>Escape to a Peaceful Lakeside Retreat</h2>

          <span>
            Surrounded by nature and beautiful lake views, our villa
            offers the perfect getaway while remaining easily accessible.
          </span>
        </div>

        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
        >

          <div className={styles.map}>

            <iframe
              src="https://www.google.com/maps?q=18.841873,73.478177&z=15&output=embed"
              loading="lazy"
              allowFullScreen
              title="Lake View Villa Location"
            ></iframe>

          </div>

          <div className={styles.content}>

            <div className={styles.info}>

              <MapPin size={22} />

              <div>

                <h3>SAMRAJYA VILLA</h3>

                <p>
                  7F8P+G46, Dangurle, Maharashtra 421401
                </p>

              </div>

            </div>

            <p className={styles.description}>
              Enjoy a relaxing stay surrounded by lush greenery,
              scenic landscapes, and peaceful lake views. The villa
              is easily accessible by road and is an ideal destination
              for family vacations and weekend getaways.
            </p>

            <div className={styles.buttons}>

              <a
                href="https://maps.app.goo.gl/DWigpKBuse3dkH8M9?g_st=aw"
                target="_blank"
                rel="noreferrer"
                className={styles.primary}
              >
                <Navigation size={18} />
                Get Directions
              </a>

              <button className={styles.secondary}>
                Book Now
              </button>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}