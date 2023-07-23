import { useEffect, useState } from "react";
import textLogo from "../assets/logo-text.svg";
import { PiHouseFill } from "react-icons/pi";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import liked from "../assets/likedsongs.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { truncateString } from "./Results";

const API_BASE_URL = "https://api.spotify.com/v1";
// NavBar component responsible for rendering the sidebar navigation.
export default function NavBar({ accessToken }) {
  const auth = `Bearer ${accessToken}`;
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [savedArtists, setSavedArtists] = useState([]);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  // Function to update the screen height state
  const updateScreenHeight = () => {
    setScreenHeight(window.innerHeight - 430);
  };

  useEffect(() => {
    updateScreenHeight();
    window.addEventListener("resize", updateScreenHeight);
    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          userPlaylistsResponse,
          userAlbumsResponse,
          savedArtistsResponse,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/me/playlists`, {
            headers: {
              Authorization: auth,
            },
          }),
          axios.get(`${API_BASE_URL}/me/albums`, {
            headers: {
              Authorization: auth,
            },
          }),
          axios.get(`${API_BASE_URL}/me/following?type=artist`, {
            headers: {
              Authorization: auth,
            },
          }),
        ]);
        setSavedPlaylists(userPlaylistsResponse.data.items);
        setSavedAlbums(userAlbumsResponse.data.items);
        setSavedArtists(savedArtistsResponse.data.artists.items);
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
          <Link className="nav-button create-new" to="/">
            <FiPlusSquare className="nav-icon" />
            <h4 className="nav-link">Create New</h4>
          </Link>
          <div className="pl-container">
            <div className="playlist-list" style={{ height: screenHeight }}>
              <Link className="nav-button nav-button-pl" to="/favorites">
                <img className="nav-pl-img" src={liked} alt="pl-img" />
                <div>
                  <h4 className="nav-link">Favorites</h4>
                  <p className="nav-text">Playlist • You</p>
                </div>
              </Link>
              {savedArtists != [] &&
                savedArtists.map((artist) => (
                  <NavButtons
                    key={artist.uri}
                    image={artist.images[0].url}
                    title={truncateString(artist.name, 15)}
                    text="Artist"
                    type={artist.type}
                  />
                ))}
              {savedPlaylists != [] &&
                savedPlaylists.map((playlist) => (
                  <NavButtons
                    key={playlist.uri}
                    image={playlist.images[0].url}
                    title={truncateString(playlist.name, 15)}
                    text={`Playlist • ${playlist.owner.display_name}`}
                    type={playlist.type}
                  />
                ))}
              {savedAlbums != [] &&
                savedAlbums.map((album) => (
                  <NavButtons
                    key={album.album.uri}
                    image={album.album.images[0].url}
                    title={truncateString(album.album.name, 14)}
                    text={`Album • ${album.album.artists[0].name}`}
                    type={album.album.type}
                  />
                ))}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function NavButtons({ image, title, text, type }) {
  return (
    <div>
      <Link className="nav-button nav-button-pl" to={`/${type}`}>
        <img
          className={`nav-pl-img ${type == "artist" && "nav-artist-img"}`}
          src={image}
          alt="playlist-img"
        />
        <div>
          <h4 className="nav-playlist">{title}</h4>
          <p className="nav-text">{text}</p>
        </div>
      </Link>
    </div>
  );
}
