import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";

const ManageBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const bookingsPerPage = 10;
  const navigate = useNavigate();

  // ✅ Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await ApiService.getAllBookings();

        // ✅ SAFETY: ensure array
        setBookings(response?.bookings ?? []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

  // ✅ FILTER LOGIC (works while typing)
  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookings;

    return bookings.filter((booking) =>
      booking.bookingReference
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, bookings]);

  // ✅ PAGINATION
  const currentBookings = useMemo(() => {
    const lastIndex = currentPage * bookingsPerPage;
    const firstIndex = lastIndex - bookingsPerPage;
    return filteredBookings.slice(firstIndex, lastIndex);
  }, [currentPage, filteredBookings]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset page on search
  };

  return (
    <div className="bookings-container">
      <h2>All Bookings</h2>

      {/* Search */}
      <div className="search-div">
        <label>Filter by Booking Number:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter booking number"
        />
      </div>

      {/* Results */}
      <div className="booking-results">
        {currentBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          currentBookings.map((booking) => (
            <div key={booking.id} className="booking-result-item">
              <p><strong>Booking Code:</strong> {booking.bookingReference}</p>
              <p><strong>Check In:</strong> {booking.checkInDate}</p>
              <p><strong>Check Out:</strong> {booking.checkOutDate}</p>
              <p><strong>Total Price:</strong> {booking.totalPrice}</p>
              <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
              <p><strong>Booking Status:</strong> {booking.bookingStatus}</p>

              <button
                className="edit-room-button"
                onClick={() =>
                  navigate(`/admin/edit-booking/${booking.bookingReference}`)
                }
              >
                Manage Booking
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        roomPerPage={bookingsPerPage}
        totalRooms={filteredBookings.length}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />
    </div>
  );
};

export default ManageBookingsPage;
