// import { Routes, Route } from "react-router-dom";
// import React from "react";
// import Home from "./pages/Home/Home";
// import Gallery from "./pages/Gallery/Gallery";
// import Contact from "./pages/Contact/Contact";
// import Rooms from "./pages/Rooms/Rooms";
// import Restaurant from "./pages/Restaurant/Restaurant";
// function App() {
//   return (
    
// <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/gallery" element={<Gallery />} />
//  <Route path="/rooms" element={<Rooms />} />
// <Route path="/restaurant" element={<Restaurant />} />
//   <Route path="/contact" element={<Contact />} />
// </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home/Home";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import Rooms from "./pages/Rooms/Rooms";
import Restaurant from "./pages/Restaurant/Restaurant";
import Booking from "./pages/Booking/Booking";
import Payment from "./pages/Payment/Payment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/contact" element={<Contact />} />

      {/* Your pages */}
      <Route path="/booking" element={<Booking />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}

export default App;