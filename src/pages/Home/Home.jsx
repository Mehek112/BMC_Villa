import React from "react";


import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import VillaHighlights from "../../components/VillaHighlights/VillaHighlights";
import About from "../../components/About/About";
import GalleryPreview from "../../components/GalleryPreview/GalleryPreview";
import Location from "../../components/Location/Location";
import Footer from "../../components/Footer/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <VillaHighlights />
      <About />
      <GalleryPreview />
      <Location />
      <Footer />
    </>
  );
}
// export default function Home() {
//   return (
//     <h1 style={{ padding: "100px", fontSize: "50px" }}>
//       WEBSITE IS WORKING 🎉
//     </h1>
//   );
// }