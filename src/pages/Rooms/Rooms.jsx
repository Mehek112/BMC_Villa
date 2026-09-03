import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import {
  Bath,
  BedDouble,
  Check,
  Maximize2,
  Users,
  Waves,
  X,
} from "lucide-react";

import { rooms } from "../../data/rooms";
import styles from "./Rooms.module.scss";


function Rooms() {

  const [selectedRoom, setSelectedRoom] = useState(null);


  const highlights = [
    {
      icon: <BedDouble size={26} />,
      value: "6",
      label: "Bedrooms",
    },
    {
      icon: <Bath size={26} />,
      value: "6",
      label: "Bathrooms",
    },
    {
      icon: <Users size={26} />,
      value: "12",
      label: "Guests",
    },
    // {
    //   icon: <Waves size={26} />,
    //   value: "Private",
    //   label: "Swimming Pool",
    // },
  ];



  useEffect(() => {

    document.body.style.overflow =
      selectedRoom ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };

  }, [selectedRoom]);



  function closeModal(){
    setSelectedRoom(null);
  }



  return (

    <>
      <Navbar />


      <main className={styles.roomsPage}>


        {/* HERO */}

        <section className={styles.hero}>

          <div className={styles.heroOverlay}></div>


          <div className={styles.heroContent}>

            <span className={styles.eyebrow}>
              Lake View Villa
            </span>


            <h1>
              Rooms & Spaces
            </h1>


            <p>
              Discover elegant, spacious and comfortable rooms
              designed for a relaxing villa experience.
            </p>


          </div>

        </section>





        {/* OVERVIEW */}

        <section className={styles.overviewSection}>


          <div className={styles.container}>


            <div className={styles.sectionHeading}>

              <span>
                Comfort Meets Luxury
              </span>


              <h2>
                Your Private Villa Retreat
              </h2>


              <p>
                Lake View Villa features beautifully designed bedrooms,
                relaxing living spaces and premium amenities created
                for comfort, privacy and memorable stays.
              </p>


            </div>




            <div className={styles.highlightsGrid}>

              {
                highlights.map((item)=>(

                  <article
                    className={styles.highlightCard}
                    key={item.label}
                  >

                    <div className={styles.iconWrapper}>
                      {item.icon}
                    </div>


                    <div>

                      <h3>
                        {item.value}
                      </h3>


                      <p>
                        {item.label}
                      </p>

                    </div>


                  </article>

                ))
              }


            </div>


          </div>


        </section>






        {/* ROOMS */}


        <section className={styles.roomsSection}>


          <div className={styles.container}>


            <div className={styles.sectionHeading}>


              <span>
                Explore Rooms
              </span>


              <h2>
                Our Bedrooms
              </h2>


              <p>
                Each bedroom offers comfort, privacy and
                a peaceful atmosphere throughout your stay.
              </p>


            </div>





            <div className={styles.roomsGrid}>


              {
                rooms.map((room)=>(


                  <article
                    className={styles.roomCard}
                    key={room.id}
                  >



                    <div className={styles.roomImageWrapper}>


                      <img
                        src={room.image}
                        alt={room.name}
                        className={styles.roomImage}
                      />


                    </div>






                    <div className={styles.roomContent}>


                      <h3>
                        {room.name}
                      </h3>



                      <p className={styles.roomDescription}>
                        {room.description}
                      </p>





                      <div className={styles.roomFeatures}>


                        <div>

                          <BedDouble size={18}/>

                          <span>
                            {room.bedType}
                          </span>

                        </div>



                        <div>

                          <Users size={18}/>

                          <span>
                            {room.capacity} Guests
                          </span>

                        </div>




                        <div>

                          <Maximize2 size={18}/>

                          <span>
                            {room.size}
                          </span>

                        </div>


                      </div>





                      <button
                        className={styles.detailsButton}
                        onClick={() => setSelectedRoom(room)}
                      >
                        View Details
                      </button>



                    </div>


                  </article>


                ))
              }


            </div>


          </div>


        </section>







        {/* MODAL */}


        {
          selectedRoom && (


            <div
              className={styles.modalBackdrop}
              onClick={closeModal}
            >


              <div
                className={styles.modal}
                onClick={(e)=>e.stopPropagation()}
              >



                <button
                  className={styles.closeButton}
                  onClick={closeModal}
                >

                  <X size={22}/>

                </button>





                <div className={styles.modalImageWrapper}>


                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                  />


                </div>







                <div className={styles.modalContent}>


                  <span className={styles.modalEyebrow}>
                    Room Details
                  </span>



                  <h2>
                    {selectedRoom.name}
                  </h2>




                  <p className={styles.modalDescription}>
                    {selectedRoom.description}
                  </p>







                  <div className={styles.modalSummary}>


                    <div>

                      <BedDouble size={20}/>

                      <span>
                        {selectedRoom.bedType}
                      </span>

                    </div>





                    <div>

                      <Users size={20}/>

                      <span>
                        {selectedRoom.capacity} Guests
                      </span>

                    </div>





                    <div>

                      <Maximize2 size={20}/>

                      <span>
                        {selectedRoom.size}
                      </span>

                    </div>


                  </div>






                  <h3>
                    Features
                  </h3>





                  <ul className={styles.featureList}>


                    {
                      selectedRoom.features.map((feature)=>(


                        <li key={feature}>


                          <Check size={18}/>


                          <span>
                            {feature}
                          </span>


                        </li>


                      ))
                    }


                  </ul>



                </div>




              </div>


            </div>


          )
        }



      </main>



      <Footer />


    </>

  );

}


export default Rooms;