import React from "react";
import textLogo from "../assets/logo-text.svg";
import { PiHouseFill } from "react-icons/pi";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";

// NavBar component responsible for rendering the sidebar navigation.
export default function NavBar() {
  return (
    <aside className="nav-bar">
      <Link className="go-home" to="/">
        <img className="nav-logo" src={textLogo} alt="Logo" />
      </Link>
      <nav>
        <div className="nav-section">
          <h4 className="nav-title">MENU</h4>
          <Link className="nav-button" to="/">
            <PiHouseFill className="nav-icon" />
            <h4 className="nav-link">Home</h4>
          </Link>
          <Link className="nav-button" to="/search">
            <FiSearch className="nav-icon" />
            <h4 className="nav-link">Search</h4>
          </Link>
        </div>
        <div className="nav-section">
          <h4 className="nav-title">LIBRARY</h4>
          <Link className="nav-button" to="/search">
            <FiPlusSquare className="nav-icon" />
            <h4 className="nav-link">Create New</h4>
          </Link>
          <Link className="nav-button" to="/favorites">
            <AiFillHeart className="nav-icon" />
            <h4 className="nav-link">Favorites</h4>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
