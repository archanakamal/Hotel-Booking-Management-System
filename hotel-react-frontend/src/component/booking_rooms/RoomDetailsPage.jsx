
import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const RoomDetailsPage = () => {

  const navigate = useNavigate();
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // date states
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

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

  // ---------------- SEND EMAIL ----------------
  const sendBookingEmail = async () => {

    try {

      await emailjs.send(
        "service_xz5ok7a",
        "template_zwbg4hm",
        {
            name: ApiService.getUser().name,
            email: ApiService.getUser().email,
            room: room.type,
            checkin: checkInDate,
            checkout: checkOutDate,
            amount: room.pricePerNight,
        }

        "dCNQhYgucnWr7NzAG"
      );

      console.log("EMAIL SENT SUCCESSFULLY");

    } catch (error) {

      console.log("EMAIL ERROR:", error);

    }
  };

  // ---------------- BOOK ROOM ----------------
  const handleBooking = async () => {

    if (!ApiService.isAuthenticated()) {

      alert("Please login to book a room");
      navigate("/login");
      return;

    }

    // validation
    if (!checkInDate || !checkOutDate) {

      alert("Please select check-in and check-out dates");
      return;

    }

    setLoading(true);

    try {

      const bookingData = {
        roomId: room.id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
      };

      const resp = await ApiService.createBooking(bookingData);

      console.log("Booking response:", resp);

      if (resp.status === 200 || resp.status === 201) {

        // SEND EMAIL
        await sendBookingEmail();

        alert("Booking successful!");

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

      {/* DATE INPUTS */}
      <div style={{ marginTop: "20px" }}>

        <label>Check-in Date: </label>

        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />

        <br /><br />

        <label>Check-out Date: </label>

        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />

      </div>

      <br />

      <button onClick={handleBooking} disabled={loading}>

        {loading ? "Booking..." : "Book Now"}

      </button>

    </div>
  );
};

export default RoomDetailsPage;
