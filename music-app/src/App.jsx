import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import Login from "./components/Login";
import Home from "./components/Home";
import Controls from "./components/Controls";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import useAuth from "./components/useAuth";
import Player from "./components/Player";
import "./styles/App.css";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [userDisplayName, setUserDisplayName] = useState("");
  const [clientId, setClientId] = useState(null); // State variable for storing the client ID
  const { accessToken } = useAuth(code); // State variable for storing the accessToken
  const location = useLocation();
  const showNavandControls = location.pathname !== "/login";

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

  useEffect(() => {
    if (!accessToken || !clientId) return;
    const spotifyApi = new SpotifyWebApi({
      clientId: clientId,
    });
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe().then((response) => {
      setUserDisplayName(response.body.display_name);
    });
  }, [accessToken, clientId]);

  return (
    <main className="main-page">
      {showNavandControls && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login clientId={clientId} />} />
        <Route
          path="/"
          element={
            <Home accessToken={accessToken} userName={userDisplayName} />
          }
        />
        <Route
          path="/search"
          element={
            <Search accessToken={accessToken} userName={userDisplayName} />
          }
        />
      </Routes>
      {showNavandControls && <Controls accessToken={accessToken} />}
    </main>
  );
}
