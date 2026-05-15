import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService";
import { DayPicker } from "react-day-picker";

const RoomSearch = ({ handSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState(null);

  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");

  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // ✅ FIXED API CALL (MAIN ISSUE SOLVED HERE)
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const resp = await ApiService.getRoomTypes();

        // 🔥 handles all backend formats safely
        const data = resp?.data || resp?.roomTypes || resp;

        setRoomTypes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error fetching RoomTypes", error);
        setRoomTypes([]);
      }
    };

    fetchRoomTypes();
  }, []);

  // Close date pickers when clicking outside
  const handleClickOutside = (event) => {
    if (startDateRef.current && !startDateRef.current.contains(event.target)) {
      setStartDatePickerVisible(false);
    }
    if (endDateRef.current && !endDateRef.current.contains(event.target)) {
      setEndDatePickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => setError(""), timeout);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate) {
      showError("Please select check-in and check-out dates");
      return;
    }

    try {
      const formattedStartDate = startDate.toLocaleDateString("en-CA");
      const formattedEndDate = endDate.toLocaleDateString("en-CA");

      const params = {
        checkInDate: formattedStartDate,
        checkOutDate: formattedEndDate,
        ...(roomType ? { roomType } : {})
      };

      const resp = await ApiService.getAvailableRooms(params);

      if (resp.status === 200) {
        if (!Array.isArray(resp.rooms) || resp.rooms.length === 0) {
          showError("No rooms available for the selected date/type");
          return;
        }
        handSearchResult(resp.rooms);
        setError("");
      }
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    }
  };

  return (
    <section>
      <div className="search-container">

        {/* Check-in */}
        <div className="search-field" style={{ position: "relative" }}>
          <label>Check-in Date</label>
          <input
            type="text"
            value={startDate ? startDate.toLocaleDateString() : ""}
            placeholder="Select Check-In Date"
            onFocus={() => setStartDatePickerVisible(true)}
            readOnly
          />
          {isStartDatePickerVisible && (
            <div className="datepicker-container" ref={startDateRef}>
              <DayPicker
                selected={startDate}
                onDayClick={(date) => {
                  setStartDate(date);
                  setStartDatePickerVisible(false);
                }}
                month={startDate}
              />
            </div>
          )}
        </div>

        {/* Check-out */}
        <div className="search-field" style={{ position: "relative" }}>
          <label>Check-Out Date</label>
          <input
            type="text"
            value={endDate ? endDate.toLocaleDateString() : ""}
            placeholder="Select Check-Out Date"
            onFocus={() => setEndDatePickerVisible(true)}
            readOnly
          />
          {isEndDatePickerVisible && (
            <div className="datepicker-container" ref={endDateRef}>
              <DayPicker
                selected={endDate}
                onDayClick={(date) => {
                  setEndDate(date);
                  setEndDatePickerVisible(false);
                }}
                month={startDate}
              />
            </div>
          )}
        </div>

        {/* Room type dropdown (FIXED) */}
        <div className="search-field">
          <label>Room Type</label>
          <select
            value={roomType || ""}
            onChange={(e) => setRoomType(e.target.value || null)}
          >
            <option value="">All Rooms</option>

            {Array.isArray(roomTypes) && roomTypes.length > 0 ? (
              roomTypes.map((type) => (
                <option value={type} key={String(type)}>
                  {type}
                </option>
              ))
            ) : (
              <option disabled>Loading room types...</option>
            )}
          </select>
        </div>

        <button className="home-search-button" onClick={handleInternalSearch}>
          Search Rooms
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default RoomSearch;