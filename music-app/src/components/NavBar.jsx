import React from "react";
import textLogo from "../assets/logo-text.svg";
import { AiFillHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

export default function NavBar({ changeComponent }) {
  const handleButtonClick = (component) => {
    changeComponent(component);
  };

  return (
    <aside className="nav-bar">
      <img className="nav-logo" src={textLogo} alt="Logo" />
      <nav>
        <div className="nav-section">
          <h4 className="nav-title">MENU</h4>
          <button onClick={() => handleButtonClick("Home")}>
            <AiFillHome className="nav-icon" />
            <h4 className="nav-link">Home</h4>
          </button>
          <button onClick={() => handleButtonClick("Search")}>
            <FiSearch className="nav-icon" />
            <h4 className="nav-link">Search</h4>
          </button>
        </div>
        <div className="nav-section">
          <h4 className="nav-title">LIBRARY</h4>
        </div>
      </nav>
    </aside>
  );
}
