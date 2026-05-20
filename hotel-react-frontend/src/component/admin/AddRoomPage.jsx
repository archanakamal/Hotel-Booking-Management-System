import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const AddRoomPage = () => {
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState({
    imageUrl: null,
    type: "",
    roomNumber: "",
    pricePerNight: "",
    capacity: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const resp = await ApiService.getRoomTypes();

      console.log("Room Types Response:", resp);

      // supports both direct array and axios response.data
      const types = Array.isArray(resp) ? resp : resp.data;

      setRoomTypes(types || []);
    } catch (err) {
      console.error("Error loading room types:", err);
      setRoomTypes([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomTypeChange = (e) => {
    setRoomDetails((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const addRoom = async () => {
    if (
      !roomDetails.type ||
      !roomDetails.roomNumber ||
      !roomDetails.pricePerNight ||
      !roomDetails.capacity
    ) {
      setError("Please fill all required fields.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("type", roomDetails.type);
      formData.append("roomNumber", roomDetails.roomNumber);
      formData.append("pricePerNight", roomDetails.pricePerNight);
      formData.append("capacity", roomDetails.capacity);
      formData.append("description", roomDetails.description);

      if (file) {
        formData.append("imageFile", file);
      }

      const result = await ApiService.addRoom(formData);

      if (result.status === 200 || result.status === 201) {
        setSuccess("Room added successfully");

        setTimeout(() => {
          navigate("/admin/manage-rooms");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add room");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="edit-room-container">
      <h2>Add New Room</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="edit-room-form">

        <div className="form-group">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="room-photo-preview"
            />
          )}

          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Room Type</label>

          <select value={roomDetails.type} onChange={handleRoomTypeChange}>
            <option value="">Select a room type</option>

            {roomTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Room Price</label>
          <input
            type="number"
            name="pricePerNight"
            value={roomDetails.pricePerNight}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Room Number</label>
          <input
            type="number"
            name="roomNumber"
            value={roomDetails.roomNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            value={roomDetails.capacity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={roomDetails.description}
            onChange={handleChange}
          />
        </div>

        <button className="update-button" onClick={addRoom}>
          Add Room
        </button>

      </div>
    </div>
  );
};

export default AddRoomPage;