import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>

        <NavLink to="/" className={styles.logo}>
          <span>LAKE VIEW Villa</span>
          
        </NavLink>

        <nav className={styles.links}>

  <NavLink to="/">
    Home
  </NavLink>

  <NavLink to="/gallery">
    Gallery
  </NavLink>

  <NavLink to="/rooms">
    Rooms
  </NavLink>

  <NavLink to="/restaurant">
    Dining
  </NavLink>

  <NavLink to="/contact">
    Contact
  </NavLink>
<NavLink to="/booking" className={styles.bookButton}>
  Book Now
</NavLink>

</nav>
      </div>
    </header>
  );
}