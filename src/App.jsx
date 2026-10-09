// // import { Routes, Route } from "react-router-dom";
// // import React from "react";
// // import Home from "./pages/Home/Home";
// // import Gallery from "./pages/Gallery/Gallery";
// // import Contact from "./pages/Contact/Contact";
// // import Rooms from "./pages/Rooms/Rooms";
// // import Restaurant from "./pages/Restaurant/Restaurant";
// // function App() {
// //   return (

// // <Routes>
// //   <Route path="/" element={<Home />} />
// //   <Route path="/gallery" element={<Gallery />} />
// //  <Route path="/rooms" element={<Rooms />} />
// // <Route path="/restaurant" element={<Restaurant />} />
// //   <Route path="/contact" element={<Contact />} />
// // </Routes>
// //   );
// // }

// // export default App;

// import { Routes, Route } from "react-router-dom";
// import React from "react";
// import Home from "./pages/Home/Home";
// import Gallery from "./pages/Gallery/Gallery";
// import Contact from "./pages/Contact/Contact";
// import Rooms from "./pages/Rooms/Rooms";
// import Restaurant from "./pages/Restaurant/Restaurant";
// import Booking from "./pages/Booking/Booking";
// import Payment from "./pages/Payment/Payment";
// import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

// function App() {
//   return (

//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/gallery" element={<Gallery />} />
//       <Route path="/rooms" element={<Rooms />} />
//       <Route path="/restaurant" element={<Restaurant />} />
//       <Route path="/contact" element={<Contact />} />

//       {/* Your pages */}
//       <Route path="/booking" element={<Booking />} />
//       <Route path="/payment" element={<Payment />} />
//     </Routes>
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
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import BookingConfirmation from "./pages/BookingConfirmation/BookingConfirmation";
import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminBookings from "./pages/AdminBookings/AdminBookings";
import Feedback from "./pages/Feedback/Feedback";
import AdminFeedback from "./pages/AdminFeedback/AdminFeedback";
import AdminAvailability from "./pages/AdminAvailability/AdminAvailability";
import AdminCustomers from "./pages/AdminCustomers/AdminCustomers";
import AdminPayments from "./pages/AdminPayments/AdminPayments";
import MyBookings from "./pages/MyBookings/MyBookings";
import AdminResetPassword from "./pages/AdminResetPassword/AdminResetPassword";


function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/reset-password"
          element={<AdminResetPassword />}
        />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminProtectedRoute>
              <AdminBookings />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />
        <Route path="/feedback" element={<Feedback />} />
        <Route
          path="/admin/feedback"
          element={
            <AdminProtectedRoute>
              <AdminFeedback />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/availability"
          element={
            <AdminProtectedRoute>
              <AdminAvailability />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminProtectedRoute>
              <AdminCustomers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminProtectedRoute>
              <AdminPayments />
            </AdminProtectedRoute>
          }
        />
        <Route path="/my-bookings" element={<MyBookings />} />


      </Routes>
    </>
  );
}

export default App;