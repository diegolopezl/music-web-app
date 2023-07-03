import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import NavBar from "./NavBar";
import MusicTray from "./MusicTray";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
import SpotifyWebApi from "spotify-web-api-node";

// Main component responsible for rendering the main page.
export default function Main({ code, clientId }) {
  // Initialize state variables
  const [currentComponent, setCurrentComponent] = useState("Home");
  const accessToken = useAuth(code);

  useEffect(() => {
    // Set the access token of the SpotifyWebApi instance
    if (!accessToken || !clientId) return;
    const spotifyApi = new SpotifyWebApi({
      clientId: clientId,
    });
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken, clientId]);

  // Map of component names to their respective components
  const componentMap = {
    Home: HomePage,
    Search: SearchPage,
  };

  // Changes the current component to be rendered.
  const changeComponent = (component) => {
    setCurrentComponent(component);
  };

  // Get the component to be rendered based on the currentComponent state
  const CurrentComponent = componentMap[currentComponent];

  return (
    <main className="main-page">
      <NavBar changeComponent={changeComponent} />
      {/* Passing the changeComponent function to the Sidebar */}
      <div className="center">
        <CurrentComponent accessToken={accessToken} />
      </div>
      <MusicTray />
    </main>
  );
}
