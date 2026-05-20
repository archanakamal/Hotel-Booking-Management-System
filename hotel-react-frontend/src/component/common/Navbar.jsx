import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const isAuthenticated = ApiService.isAuthenticated();
    const isCustomer = ApiService.isCustomer();
    const isAdmin = ApiService.isAdmin();

    const navigate = useNavigate();

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (confirm) {
            ApiService.logout();
            navigate("/home");
        }
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            {/* Brand */}
            <div className="navbar-brand">
                <NavLink to="/home" onClick={closeMenu}>
                    Archana Grand Hotel
                </NavLink>
            </div>

            {/* Hamburger */}
            <div
                className="menu-icon"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </div>

            {/* Links */}
            <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
                <li><NavLink to="/home" onClick={closeMenu}>Home</NavLink></li>
                <li><NavLink to="/rooms" onClick={closeMenu}>Rooms</NavLink></li>
                <li><NavLink to="/find-booking" onClick={closeMenu}>Find Booking</NavLink></li>

                {isCustomer && (
                    <li><NavLink to="/profile" onClick={closeMenu}>Profile</NavLink></li>
                )}

                {isAdmin && (
                    <li><NavLink to="/admin" onClick={closeMenu}>Admin</NavLink></li>
                )}

                {!isAuthenticated && (
                    <>
                        <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
                        <li><NavLink to="/register" onClick={closeMenu}>Register</NavLink></li>
                    </>
                )}

                {isAuthenticated && (
                    <li onClick={handleLogout} className="logout">
                        Logout
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;