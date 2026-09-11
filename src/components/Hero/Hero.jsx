import React from "react";
import styles from "./Hero.module.scss";
import { motion } from "framer-motion";
import { BedDouble, Waves, Home, MapPinned } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import { hero1, hero2, hero3 } from "../../assets";

import "swiper/css";
import "swiper/css/effect-fade";
//import "swiper/css/navigation";

export default function Hero() {

    const images = [
        hero1,
        hero2,
        hero3
    ];

    return (

        <section className={styles.hero}>

            <Swiper 
                modules={[Autoplay, EffectFade]} 
                effect="fade" 
                autoplay={{ 
                    delay: 2500, 
                    disableOnInteraction: false, 
                }} 
                loop={true} 
                className={styles.swiper}
            >
                {images.map((img, index) => (

                    <SwiperSlide key={index}>

                        <img
                            src={img}
                            alt={`Lake View Villa ${index + 1}`}
                            loading="eager"
                        />

                    </SwiperSlide>

                ))}

            </Swiper>

            <div className={styles.overlay}></div>

            <div className={`container ${styles.content}`}>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Luxury Lakeside Escape
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Lake View Villa
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Luxury 3 BHK Villa with Private Pool
                </motion.h2>

                <motion.div
                    className={styles.features}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >

                    <span>
                        <BedDouble size={18} />
                        3 BHK
                    </span>

                    <span>
                        <Waves size={18} />
                        Private Pool
                    </span>

                    <span>
                        <MapPinned size={18} />
                        Lake View
                    </span>

                    <span>
                        <Home size={18} />
                        Entire Villa
                    </span>

                </motion.div>

                <motion.div
                    className={styles.buttons}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >

                    <button className={styles.primary}>
                        Book Your Stay
                    </button>

                    <button className={styles.secondary}>
                        View Gallery
                    </button>

                </motion.div>

            </div>

        </section>

    );
}