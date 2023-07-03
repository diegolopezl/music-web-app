import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Main from "./components/Main";
import "./App.css";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={code ? <Main code={code} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
