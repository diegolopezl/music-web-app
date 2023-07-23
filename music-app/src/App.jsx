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
import "./styles/App.css";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export default function App() {
  // const [fetchTrackUri, setFetchTrackUri] = useState(true);
  const [trackUri, setTrackUri] = useState([]);
  return (
    <Router>
      <AppContent
        trackUri={trackUri}
        setTrackUri={setTrackUri}
        // fetchTrackUri={fetchTrackUri}
        // setFetchTrackUri={setFetchTrackUri}
      />
    </Router>
  );
}

function AppContent({
  trackUri,
  setTrackUri,
  // fetchTrackUri,
  // setFetchTrackUri,
}) {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
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
      {showNavandControls && <NavBar accessToken={accessToken} />}
      <Routes>
        <Route path="/login" element={<Login clientId={clientId} />} />
        <Route
          path="/"
          element={
            <Home
              accessToken={accessToken}
              userName={userName}
              userImage={userImage}
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
              // setFetchTrackUri={setFetchTrackUri}
            />
          }
        />
      </Routes>
      {showNavandControls && (
        <Controls
          accessToken={accessToken}
          trackUri={trackUri}
          setTrackUri={setTrackUri}
          // fetchTrackUri={fetchTrackUri}
          // setFetchTrackUri={setFetchTrackUri}
        />
      )}
    </main>
  );
}
