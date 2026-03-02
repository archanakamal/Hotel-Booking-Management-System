import React from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";


const RoomResult = ({ roomSearchResults }) => {
 const navigate = useNavigate();
 const isAdmin = ApiService.isAdmin();


 if (!roomSearchResults || roomSearchResults.length === 0) {
   return <p style={{ textAlign: "center" }}>No rooms found.</p>;
 }


 return (
   <section className="room-results">
     <div className="room-list">
       {roomSearchResults.map((room) => (
         <div className="room-list-item" key={room.id}>
           <img
             className="room-list-item-image"
             src={room.imageUrl || "/default-room.jpg"}
             alt={`Room ${room.roomNumber}`}
           />


           <div className="room-details">
             <h3>{room.type}</h3>
             <p>Price: ${room.pricePerNight}/Night</p>
             <p>{room.description || "No description available"}</p>
           </div>


           <div className="book-now-div">
             {isAdmin ? (
               <button
                 className="edit-room-button"
                 onClick={() => navigate(`/admin/edit-room/${room.id}`)}
               >
                 Edit Room
               </button>
             ) : (
               <button
                 className="book-now-button"
                 onClick={() => navigate(`/room-details/${room.id}`)}
               >
                 View/Book Now
               </button>
             )}
           </div>
         </div>
       ))}
     </div>
   </section>
 );
};


export default RoomResult;
