import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import { useNavigate } from "react-router-dom";

const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const navigate = useNavigate();

  // Fetch rooms and room types on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const resp = await ApiService.getAllRooms();
        setRooms(resp.rooms);
        setFilteredRooms(resp.rooms);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const resp = await ApiService.getRoomTypes();
        setRoomTypes(resp.roomTypes);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, []);

  // Handle room type filter
  const handleRoomTypeChange = (e) => {
    filterRoomFunction(e.target.value);
  };

  const filterRoomFunction = (type) => {
    if (!type) {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.type === type);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  };

  // Pagination calculation
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="all-rooms" style={{ padding: "20px" }}>
      <h2>All Rooms</h2>

      {/* Filter + Add Room */}
      <div
        className="all-room-filter-div"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Left: Filter */}
        <div className="filter-select-div">
          <label style={{ marginRight: "10px" }}>Filter by Room Type:</label>
          <select onChange={handleRoomTypeChange}>
            <option value="">All</option>
            {Array.isArray(roomTypes) &&
              roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        </div>

        {/* Right: Add Room button */}
        <div className="add-room-div">
          <button
            className="add-room-button"
            style={{
              padding: "8px 16px",
              backgroundColor: "#1f2937",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/admin/add-room")}
          >
            Add Room
          </button>
        </div>
      </div>

      {/* Room Results */}
      <RoomResult roomSearchResults={currentRooms} />

      {/* Pagination */}
      <Pagination
        roomPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default ManageRoomPage;
