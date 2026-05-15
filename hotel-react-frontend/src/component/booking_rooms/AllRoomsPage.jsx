import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const AllRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(9);

  // ---------------- FETCH ROOMS + TYPES ----------------
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const resp = await ApiService.getAllRooms();

        // ✅ SAFE NORMALIZATION (fixes undefined/map crash)
        const roomsData =
          Array.isArray(resp)
            ? resp
            : resp?.rooms || resp?.data || [];

        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (error) {
        console.log("Rooms fetch error:", error);
        setRooms([]);
        setFilteredRooms([]);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const resp = await ApiService.getRoomTypes();

        const types =
          Array.isArray(resp)
            ? resp
            : resp?.roomTypes || [];

        setRoomTypes(types);
      } catch (error) {
        console.log("Room types fetch error:", error);
        setRoomTypes([]);
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, []);

  // ---------------- SEARCH RESULT ----------------
  const handleSearchResult = (results) => {
    const data = Array.isArray(results) ? results : [];

    setFilteredRooms(data);
    setSelectedRoomType("");
    setCurrentPage(1);
  };

  // ---------------- FILTER BY TYPE ----------------
  const handleRoomTypeChange = (e) => {
    const type = e.target.value;
    setSelectedRoomType(type);

    if (!type) {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(
        rooms.filter((room) => room?.type === type)
      );
    }

    setCurrentPage(1);
  };

  // ---------------- PAGINATION ----------------
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;

  const currentRooms = (filteredRooms || []).slice(
    indexOfFirstRoom,
    indexOfLastRoom
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ---------------- UI ----------------
  return (
    <div className="all-rooms">
      <h2>All Rooms</h2>

      {/* FILTER */}
      <div className="all-room-filter-div">
        <label>Filter By Room Type</label>

        <select value={selectedRoomType} onChange={handleRoomTypeChange}>
          <option value="">All Rooms</option>

          {(roomTypes || []).map((type, index) => (
            <option value={type} key={index}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* SEARCH */}
      <RoomSearch
        handSearchResult={handleSearchResult}
        roomTypes={roomTypes}
      />

      {/* RESULTS */}
      <RoomResult roomSearchResults={currentRooms} />

      {/* PAGINATION */}
      <Pagination
        roomPerPage={roomsPerPage}
        totalRooms={(filteredRooms || []).length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default AllRoomsPage;