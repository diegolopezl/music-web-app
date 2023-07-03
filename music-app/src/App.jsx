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
  const [clientId, setClientId] = useState(null); // State variable for storing the client ID

  useEffect(() => {
    // Fetch the client ID from the backend
    fetch("http://localhost:5000/auth/clientID")
      .then((res) => res.json())
      .then((data) => {
        setClientId(data.clientId);
      })
      .catch((error) => {
        console.error("Error fetching client ID:", error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login clientId={clientId} />} />
        <Route
          path="/"
          element={
            code ? (
              <Main code={code} clientId={clientId} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
