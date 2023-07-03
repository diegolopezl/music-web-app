import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import NavBar from "./NavBar";
import MusicTray from "./MusicTray";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "63d757ee79774e2c82429b24c51aade3",
});

const componentMap = {
  Home: HomePage,
  Search: SearchPage,
};

export default function Main({ code }) {
  const [currentComponent, setCurrentComponent] = useState("Home");
  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const changeComponent = (component) => {
    setCurrentComponent(component);
  };

  const CurrentComponent = componentMap[currentComponent];

  return (
    <main className="main-page">
      <NavBar changeComponent={changeComponent} />{" "}
      {/* Pass the changeComponent function to the Sidebar */}
      <div className="center">
        <CurrentComponent accessToken={accessToken} />
      </div>
      <MusicTray />
    </main>
  );
}
