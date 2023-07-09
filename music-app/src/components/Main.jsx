import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import NavBar from "./NavBar";
import Controls from "./Controls";
import Home from "./Home";
import Search from "./Search";
import Player from "./Player";
import SpotifyWebApi from "spotify-web-api-node";

// Main component responsible for rendering the main page.
export default function Main({ code, clientId }) {
  // const { accessToken, logout } = useAuth(code);
  // // const [userDisplayName, setUserDisplayName] = useState("");

  // useEffect(() => {
  //   if (!accessToken || !clientId) return;
  //   const spotifyApi = new SpotifyWebApi({
  //     clientId: clientId,
  //   });
  //   spotifyApi.setAccessToken(accessToken);
  //   // spotifyApi.getMe().then((response) => { Gets active users name
  //   //   setUserDisplayName(response.body.display_name);
  //   // });
  // }, [accessToken, clientId]);

  // // Map of component names to their respective components
  // const componentMap = {
  //   home: Home,
  //   search: Search,
  // };

  // // State variable to track the current component
  // const [currentComponent, setCurrentComponent] = useState("home");

  // // Function to change the current component
  // const changeComponent = (component) => {
  //   setCurrentComponent(component);
  // };

  // Function to handle logout
  // const handleLogout = () => {
  //   logout();
  //   window.location = "/login"; // Redirect to login
  // };

  // Get the component to be rendered based on the currentComponent state
  const CurrentComponent = componentMap[currentComponent];

  return (
    <main className="main-page">
      {/* <NavBar changeComponent={changeComponent} />

      <div className="center">
        <p>Welcome, {userDisplayName}</p>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
        <CurrentComponent accessToken={accessToken} />
      </div>
      <Controls /> */}
    </main>
  );
}
