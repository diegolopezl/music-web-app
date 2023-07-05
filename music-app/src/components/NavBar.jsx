import React from "react";
import textLogo from "../assets/logo-text.svg";
import { AiFillHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

// NavBar component responsible for rendering the sidebar navigation.
export default function NavBar() {
  return (
    <aside className="nav-bar">
      <img className="nav-logo" src={textLogo} alt="Logo" />
      <nav>
        <div className="nav-section">
          <h4 className="nav-title">MENU</h4>
          <Link className="nav-button" to="/">
            <AiFillHome className="nav-icon" />
            <h4 className="nav-link">Home</h4>
          </Link>
          <Link className="nav-button" to="/search">
            <FiSearch className="nav-icon" />
            <h4 className="nav-link">Search</h4>
          </Link>
        </div>
        <div className="nav-section">
          <h4 className="nav-title">LIBRARY</h4>
        </div>
      </nav>
    </aside>
  );
}
