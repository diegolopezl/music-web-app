import { useEffect, useState } from "react";
import textLogo from "../assets/logo-text.svg";
import { PiHouseFill } from "react-icons/pi";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { truncateString } from "./Results";

const API_BASE_URL = "https://api.spotify.com/v1";
// NavBar component responsible for rendering the sidebar navigation.
export default function NavBar({ accessToken }) {
  const auth = `Bearer ${accessToken}`;
  const [userId, setUserId] = useState("");
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdResponse = await axios.get(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: auth,
          },
        });
        setUserId(userIdResponse.data.id);
        const userPlaylistsResponse = await axios.get(
          `${API_BASE_URL}/me/playlists`,
          {
            headers: {
              Authorization: auth,
            },
          }
        );
        setSavedPlaylists(userPlaylistsResponse.data.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);
  return (
    <aside className="nav-bar">
      <Link className="go-home" to="/">
        <img className="nav-logo" src={textLogo} alt="Logo" />
      </Link>
      <nav>
        <div className="nav-section">
          <h4 className="nav-title">MENU</h4>
          <Link className="nav-button" to="/">
            <PiHouseFill className="nav-icon" />
            <h4 className="nav-link">Home</h4>
          </Link>
          <Link className="nav-button" to="/search">
            <FiSearch className="nav-icon" />
            <h4 className="nav-link">Search</h4>
          </Link>
        </div>
        <div className="nav-section">
          <h4 className="nav-title">LIBRARY</h4>
          <Link className="nav-button" to="/search">
            <FiPlusSquare className="nav-icon create-new" />
            <h4 className="nav-link">Create New</h4>
          </Link>
          <Link className="nav-button" to="/favorites">
            <AiFillHeart className="nav-icon" />
            <h4 className="nav-link">Favorites</h4>
          </Link>
          {/* {savedPlaylists.map((playlist) => (
            <Link className="nav-button" to="/playlist">
              <img
                className="nav-pl-img nav-icon"
                src={playlist.images[0].url}
                alt="pl-img"
              />
              <h4 className="nav-playlist">
                {truncateString(playlist.name, 14)}
              </h4>
            </Link>
          ))} */}
        </div>
      </nav>
    </aside>
  );
}
