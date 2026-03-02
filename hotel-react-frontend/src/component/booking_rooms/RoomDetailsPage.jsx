import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH ROOM ----------------
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const resp = await ApiService.getRoomById(roomId);
        setRoom(resp.room || resp);
      } catch (err) {
        setErrorMessage("Room not found");
      }
    };
    fetchRoom();
  }, [roomId]);

  // ---------------- BOOK ROOM ----------------
  const handleBooking = async () => {
    if (!ApiService.isAuthenticated()) {
      alert("Please login to book a room");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        roomId: room.id,
        checkInDate: "2026-03-21",
        checkOutDate: "2026-03-22",
      };

      const resp = await ApiService.createBooking(bookingData);
      console.log("Booking response:", resp);

      /**
       * Backend usually returns:
       * {
       *   status: 201,
       *   message: "Booking created",
       *   bookingReference: "J5Z3HDF6UD",
       *   amount: 1000
       * }
       */

      if (resp.status === 200 || resp.status === 201) {
        alert("Booking successful!");

        // 🔥 Redirect to payment page using reference & amount
        if (resp.bookingReference && resp.amount) {
          navigate(`/payment/${resp.bookingReference}/${resp.amount}`);
        }
      } else {
        alert(resp.message || "Booking failed");
      }

    } catch (err) {
      console.error("Booking error:", err.response || err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  if (errorMessage)
    return <p style={{ textAlign: "center" }}>{errorMessage}</p>;

  if (!room)
    return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Room Details</h2>

      <img
        src={room.imageUrl || "/default-room.jpg"}
        alt="room"
        width="400"
      />

      <p><b>Room No:</b> {room.roomNumber}</p>
      <p><b>Type:</b> {room.type}</p>
      <p><b>Capacity:</b> {room.capacity}</p>
      <p><b>Price:</b> ₹{room.pricePerNight}</p>
      <p><b>Description:</b> {room.description || "No description"}</p>

      <button onClick={handleBooking} disabled={loading}>
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default RoomDetailsPage;
