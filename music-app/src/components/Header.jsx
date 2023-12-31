import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { FiSearch } from "react-icons/fi";

export default function Header({ search, setSearch, userName, userImage }) {
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const location = useLocation();
  return (
    <header className="header">
      <div>
        {location.pathname === "/search" && (
          <SearchInput search={search} onChange={handleSearchChange} />
        )}
      </div>
      <div className="user-menu">
        <img className="user-img" src={userImage} alt="User" />
        <p>{userName}</p>
      </div>
    </header>
  );
}

export function SearchInput({ search, onChange }) {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        className="search-input"
        type="search"
        value={search}
        placeholder="What are you in the mood for?"
        onChange={onChange}
        maxLength="40"
      />
    </div>
  );
}
