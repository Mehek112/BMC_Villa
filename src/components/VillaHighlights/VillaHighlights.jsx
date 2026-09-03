
import React from "react";
import styles from "./VillaHighlights.module.scss";
import { motion } from "framer-motion";
import {
  Waves,
  BedDouble,
  Home,
  MapPinned,
} from "lucide-react";

const highlights = [
  {
    icon: <Home size={24} />,
    title: "Entire Villa",
  },
  {
    icon: <Waves size={24} />,
    title: "Private Pool",
  },
  {
    icon: <BedDouble size={24} />,
    title: "3 BHK",
  },
  {
    icon: <MapPinned size={24} />,
    title: "Lake View",
  },
];

export default function VillaHighlights() {
  return (
    <section className={styles.highlights}>
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.wrapper}>
          {highlights.map((item, index) => (
            <div className={styles.item} key={index}>
              <div className={styles.icon}>{item.icon}</div>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}