
import React from "react";
import styles from "./Footer.module.scss";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">

        <div className={styles.grid}>

          {/* Villa Info */}

          <div>

            <h2>SAMRAJYA VILLA</h2>

            <p>
              Escape to luxury with breathtaking lake views,
              a private pool, and a peaceful getaway designed
              for unforgettable stays.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3>Quick Links</h3>

            <ul>

              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/gallery">Gallery</Link>
              </li>

              <li>
                <Link to="/contact">Contact</Link>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3>Contact</h3>

            <ul>

              <li>
                <Phone size={18} />
                +91 XXXXXXXXXX
              </li>

              <li>
                <Mail size={18} />
                your@email.com
              </li>

              <li>
                <MapPin size={18} />
               7F8P+G46, Dangurle, Maharashtra 421401
              </li>

            </ul>

          </div>

          {/* Social */}

          <div>

            <h3>Follow Us</h3>

            <div className={styles.social}>

              <a
                href="#"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>

            </div>

          </div>

        </div>

        <div className={styles.bottom}>
          © 2026 Lake View Villa. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}