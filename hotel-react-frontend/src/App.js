import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/common/Navbar";
import Footer from "./component/common/Footer";

// Auth & Home Pages
import RegisterPage from "./component/auth/Register";
import LoginPage from "./component/auth/LoginPage";
import HomePage from "./component/home/HomePage";

// Room Booking Pages
import AllRoomsPage from "./component/booking_rooms/AllRoomsPage";
import RoomDetailsPage from "./component/booking_rooms/RoomDetailsPage";
import FindBookingPage from "./component/booking_rooms/FindBookingPage";

// Profile Pages
import ProfilePage from "./component/profile/ProfilePage";
import EditProfilePage from "./component/profile/EditProfile";

// Payment Pages
import PaymentPage from "./component/payment/PaymentPage";
import PaymentSuccess from "./component/payment/PaymentSuccess";
import PaymentFailure from "./component/payment/PaymentFaliue";

// Admin Pages
import AdminPage from "./component/admin/AdminPage";
import ManageRoomPage from "./component/admin/MangeRoomPage";
import AddRoomPage from "./component/admin/AddRoomPage";
import EditRoomPage from "./component/admin/EditRoomPage";
import ManageBookingsPage from "./component/admin/ManageBookingPage";
import EditBookingPage from "./component/admin/EditBookingPage";
import AdminRegisterPage from "./component/admin/AdminRegisterPage";

// Route Guards
import { AdminRoute, CustomerRoute } from "./service/Guard";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/rooms" element={<AllRoomsPage />} />
            <Route path="/find-booking" element={<FindBookingPage />} />

            {/* Room details page is public */}
           <Route
             path="/room-details/:roomId"
             element={<RoomDetailsPage />}
           />


            {/* Protected Customer Routes */}
            <Route path="/profile" element={<CustomerRoute element={<ProfilePage />} />} />
            <Route path="/edit-profile" element={<CustomerRoute element={<EditProfilePage />} />} />
            <Route path="/payment/:bookingReference/:amount" element={<CustomerRoute element={<PaymentPage />} />} />
            <Route path="/payment-success/:bookingReference" element={<CustomerRoute element={<PaymentSuccess />} />} />
            <Route path="/payment-failed/:bookingReference" element={<CustomerRoute element={<PaymentFailure />} />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />
            <Route path="/admin/manage-rooms" element={<AdminRoute element={<ManageRoomPage />} />} />
            <Route path="/admin/add-room" element={<AdminRoute element={<AddRoomPage />} />} />
            <Route path="/admin/edit-room/:roomId" element={<AdminRoute element={<EditRoomPage />} />} />
            <Route path="/admin/manage-bookings" element={<AdminRoute element={<ManageBookingsPage />} />} />
            <Route path="/admin/edit-booking/:bookingCode" element={<AdminRoute element={<EditBookingPage />} />} />
            <Route path="/admin-register" element={<AdminRoute element={<AdminRegisterPage />} />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
