import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import MusicTray from "./components/MusicTray";
import Search from "./components/Search";
import "./App.css";

const code = new URLSearchParams(window.location.search).get("code");

export default function App() {
  return (
    <Router>
      <AppContent code={code} />
    </Router>
  );
}

function AppContent({ code }) {
  const location = useLocation();
  const showNavAndTray = location.pathname !== "/login";

  return (
    <>
      {showNavAndTray && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={code ? <Home code={code} /> : <Navigate to="/login" />}
        />
        <Route path="/search" element={<Search />} />
      </Routes>
      {showNavAndTray && <MusicTray />}
    </>
  );
}
