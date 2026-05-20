import axios from "axios";
import CryptoJS from "crypto-js";

const BASE_URL = "https://hotel-booking-management-system-rbo6.onrender.com";

export default class ApiService {
  static ENCRYPTION_KEY = "dennis-secrete-key";

  // ---------------------------
  // Encryption / Decryption
  // ---------------------------
  static encrypt(token) {
    return CryptoJS.AES.encrypt(token, this.ENCRYPTION_KEY).toString();
  }

  static decrypt(token) {
    const bytes = CryptoJS.AES.decrypt(token, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static saveToken(token) {
    localStorage.setItem("token", this.encrypt(token));
  }

  static getToken() {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;
    return this.decrypt(encryptedToken);
  }

  static saveRole(role) {
    localStorage.setItem("role", this.encrypt(role));
  }

  static getRole() {
    const encryptedRole = localStorage.getItem("role");
    if (!encryptedRole) return null;
    return this.decrypt(encryptedRole);
  }

  static clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  }

  // ---------------------------
  // Auth
  // ---------------------------
  static async registerUser(data) {
    return axios.post(`${BASE_URL}/api/auth/register`, data);
  }

  static async loginUser(data) {
    const resp = await axios.post(`${BASE_URL}/api/auth/login`, data);
    return resp.data;
  }

  static logout() {
    this.clearAuth();
  }

  // ---------------------------
  // Users
  // ---------------------------
  static async myProfile() {
    const resp = await axios.get(`${BASE_URL}/users/account`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async myBookings() {
    const resp = await axios.get(`${BASE_URL}/users/bookings`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  // ---------------------------
  // Rooms
  // ---------------------------
  static async getAllRooms() {
    const resp = await axios.get(`${BASE_URL}/api/rooms/all`);
    return resp.data;
  }

  static async getRoomById(roomId) {
    const resp = await axios.get(`${BASE_URL}/rooms/${roomId}`);
    return resp.data;
  }

  static async addRoom(formData) {
    return axios.post(`${BASE_URL}/rooms/add`, formData);
  }

  static async updateRoom(formData) {
    const resp = await axios.put(`${BASE_URL}/rooms/update`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return resp.data;
  }

  static async deleteRoom(roomId) {
    const resp = await axios.delete(`${BASE_URL}/rooms/delete/${roomId}`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

 static async getRoomTypes() {
   const resp = await axios.get(`${BASE_URL}/api/rooms/types`);
   return resp.data;
 }

  static async getAvailableRooms(params) {
    const resp = await axios.get(`${BASE_URL}/rooms/available`, { params });
    return resp.data;
  }

  // ---------------------------
  // Bookings
  // ---------------------------
  static async createBooking(booking) {
    const resp = await axios.post(`${BASE_URL}/bookings/create`, booking, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getBookingByReference(reference) {
    const resp = await axios.get(`${BASE_URL}/bookings/${reference}`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getAllBookings() {
    const resp = await axios.get(`${BASE_URL}/bookings/all`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async updateBooking(data) {
    const resp = await axios.put(`${BASE_URL}/bookings/update`, data, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  // ---------------------------
  // Payment
  // ---------------------------
  static async proceedForPayment({ bookingReference, amount }) {
    const resp = await axios.post(
      `${BASE_URL}/payments/proceed`,
      { bookingReference, amount },
      { headers: this.getHeader() }
    );
    return resp.data;
  }

  static async updateBookingPayment({
    bookingReference,
    amount,
    transactionId,
    success,
    failureReason,
  }) {
    const resp = await axios.put(
      `${BASE_URL}/payments`,
      { bookingReference, amount, transactionId, success, failureReason },
      { headers: this.getHeader() }
    );
    return resp.data;
  }

  // ---------------------------
  // Roles
  // ---------------------------
  static isAdmin() {
    return this.getRole() === "ADMIN";
  }

  static isCustomer() {
    return this.getRole() === "CUSTOMER";
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}