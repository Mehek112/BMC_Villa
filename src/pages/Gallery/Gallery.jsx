
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Gallery.module.scss";

import {
  hero1,
  hero2,
  hero3,
  about,

  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
  gallery11,
  gallery12,
  gallery13,

  bedroom1,
  bedroom2,
  bedroom3,
} from "../../assets";


export default function Gallery() {

  /*
    LEFT COLUMN:
    portrait / taller / square-ish photos
  */

  const leftColumn = [
    bedroom2,
    gallery5,
    gallery7,
    gallery13,
    gallery3,
    // gallery10,

    
    hero3,
  ];


  /*
    RIGHT COLUMN:
    landscape / square / wider photos
  */

  const rightColumn = [
    hero1,
    about,
    gallery1,
    gallery2,
    gallery4,
    gallery6,
    gallery8,
    gallery9,
    gallery12,
    bedroom3,
    hero2,
    bedroom1,
    gallery11,
  ];


  return (

    <>

      <Navbar />


      {/* ================= HERO ================= */}

      <section className={styles.hero}>

        <div className="container">

          {/* <p className={styles.eyebrow}>
            GALLERY
          </p> */}

          <h1>
            Explore Samrajya Villa
          </h1>

          <p className={styles.subtitle}>
            Discover the rooms, views and spaces that make
            every stay at Samrajya Villa memorable.
          </p>

        </div>

      </section>



      {/* ================= GALLERY ================= */}

      <section className={styles.gallery}>

        <div className={styles.galleryContainer}>


          {/* LEFT COLUMN */}

          <div className={styles.column}>

            {leftColumn.map((image, index) => (

              <figure
                className={styles.card}
                key={'left-${index}'}
              >

                <img
                  src={image}
                  alt={'Lake View Villa ${index + 1}'}
                  loading="lazy"
                />

              </figure>

            ))}

          </div>



          {/* RIGHT COLUMN */}

          <div className={styles.column}>

            {rightColumn.map((image, index) => (

              <figure
                className={styles.card}
                key={'right-${index}'}
              >

                <img
                  src={image}
                  alt={'Lake View Villa ${index + 10}'}
                  loading="lazy"
                />

              </figure>

            ))}

          </div>


        </div>

      </section>


      <Footer />

    </>

  );

}