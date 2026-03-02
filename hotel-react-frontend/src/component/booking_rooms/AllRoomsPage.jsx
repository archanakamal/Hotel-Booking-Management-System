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


 useEffect(() => {
   const fetchRooms = async () => {
     try {
       const resp = await ApiService.getAllRooms();
       setRooms(resp.rooms);
       setFilteredRooms(resp.rooms);
     } catch (error) {
       console.log(error);
     }
   };


   const fetchRoomTypes = async () => {
     try {
       const resp = await ApiService.getRoomTypes();
       setRoomTypes(resp.roomTypes);
     } catch (error) {
       console.log(error);
     }
   };


   fetchRooms();
   fetchRoomTypes();
 }, []);


 const handleSearchResult = (results) => {
   setRooms(results);
   setFilteredRooms(results);
   setSelectedRoomType(""); // reset filter
 };


 const handleRoomTypeChange = (e) => {
   const type = e.target.value;
   setSelectedRoomType(type);
   if (type === "") {
     setFilteredRooms(rooms);
   } else {
     setFilteredRooms(rooms.filter((room) => room.type === type));
   }
   setCurrentPage(1);
 };


 const indexOfLastRoom = currentPage * roomsPerPage;
 const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
 const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);


 const paginate = (pageNumber) => setCurrentPage(pageNumber);


 return (
   <div className="all-rooms">
     <h2>All Rooms</h2>


     <div className="all-room-filter-div">
       <label>Filter By Room Type</label>
       <select value={selectedRoomType} onChange={handleRoomTypeChange}>
         <option value="">All Rooms</option>
         {roomTypes.map((type) => (
           <option value={type} key={type}>
             {type}
           </option>
         ))}
       </select>
     </div>


     <RoomSearch
       handSearchResult={handleSearchResult}
       roomTypes={roomTypes}
     />

     <RoomResult roomSearchResults={currentRooms} />


     <Pagination
       roomPerPage={roomsPerPage}
       totalRooms={filteredRooms.length}
       currentPage={currentPage}
       paginate={paginate}
     />
   </div>
 );
};


export default AllRoomsPage;
