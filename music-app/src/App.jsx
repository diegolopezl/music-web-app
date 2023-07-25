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
import Playlists from "./components/Playlists";
import Artists from "./components/Artists";
import Albums from "./components/Albums";
import useAuth from "./components/useAuth";
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
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [clientId, setClientId] = useState(null); // State variable for storing the client ID
  const [trackUri, setTrackUri] = useState([]);
  const [typeId, setTypeId] = useState("");
  const [type, setType] = useState("");
  const [queue, setQueue] = useState([]);
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

    // Get user's profile information
    spotifyApi.getMe().then((response) => {
      const { display_name, images } = response.body;
      setUserName(display_name);

      // Check if the user has any images, and if yes, set the first image as the user's profile image
      if (images && images.length > 0) {
        setUserImage(images[0].url);
      }
    });
  }, [accessToken, clientId]);

  // const trackUri = localStorage.getItem("trackUri");

  return (
    <main className="main-page">
      {showNavandControls && (
        <NavBar
          accessToken={accessToken}
          setTypeId={setTypeId}
          setType={setType}
        />
      )}
      <Routes>
        <Route path="/login" element={<Login clientId={clientId} />} />
        <Route
          path="/"
          element={
            <Home
              accessToken={accessToken}
              userName={userName}
              userImage={userImage}
              setTrackUri={setTrackUri}
              setTypeId={setTypeId}
              setType={setType}
            />
          }
        />
        <Route
          path="/search"
          element={
            <Search
              accessToken={accessToken}
              userName={userName}
              userImage={userImage}
              setTrackUri={setTrackUri}
              setTypeId={setTypeId}
              setType={setType}
            />
          }
        />
        <Route
          path={`/${type}/${typeId}`}
          element={
            type === "artist" ? (
              <Artists
                accessToken={accessToken}
                userName={userName}
                userImage={userImage}
                typeId={typeId}
                setTrackUri={setTrackUri}
              />
            ) : type === "playlist" ? (
              <Playlists
                accessToken={accessToken}
                userName={userName}
                userImage={userImage}
                typeId={typeId}
                setTrackUri={setTrackUri}
              />
            ) : type === "album" ? (
              <Albums
                accessToken={accessToken}
                userName={userName}
                userImage={userImage}
                typeId={typeId}
                setTrackUri={setTrackUri}
              />
            ) : (
              <h1>ERROR</h1>
            )
          }
        />
      </Routes>
      {showNavandControls && (
        <Controls
          accessToken={accessToken}
          trackUri={trackUri}
          setTrackUri={setTrackUri}
          queue={queue}
        />
      )}
    </main>
  );
}

export function capitalizeFirstLetter(str) {
  const [firstLetter, ...rest] = str;
  return firstLetter.toUpperCase() + rest.join("");
}

export function truncateString(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

export function formatNumberWithCommas(numberString) {
  const numericValue = parseInt(numberString);
  if (isNaN(numericValue)) {
    return numberString;
  }
  return numericValue.toLocaleString("en-US");
}

export function msToMinuteFormat(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString();
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
