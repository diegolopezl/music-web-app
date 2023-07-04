import React from "react";
import textLogo from "../assets/logo-text.svg";
import { AiFillHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

//NavBar component responsible for rendering the sidebar navigation.
export default function NavBar({ changeComponent }) {
  //Handles the button click event and calls the changeComponent function with the specified component.
  const handleButtonClick = (component) => {
    changeComponent(component);
  };

  return (
    <aside className="nav-bar">
      <img className="nav-logo" src={textLogo} alt="Logo" />
      <nav>
        <div className="nav-section">
          <h4 className="nav-title">MENU</h4>
          <button onClick={() => handleButtonClick("home")}>
            <AiFillHome className="nav-icon" />
            <h4 className="nav-link">Home</h4>
          </button>
          <button onClick={() => handleButtonClick("search")}>
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
