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
          <Link className="nav-button" to="/">
            <FiPlusSquare className="nav-icon create-new" />
            <h4 className="nav-link">Create New</h4>
          </Link>
          <Link className="nav-button nav-button-pl" to="/favorites">
            <img className="nav-pl-img" src={liked} alt="pl-img" />
            <div>
              <h4 className="nav-link">Favorites</h4>
              <p className="nav-type">Playlist • You</p>
            </div>
          </Link>
          {savedArtists != [] &&
            savedArtists.map((artist) => (
              <Link
                key={artist.uri}
                className="nav-button nav-button-pl"
                to="/playlist"
              >
                <img
                  className="nav-pl-img nav-artist-img"
                  src={artist.images[0].url}
                  alt="pl-img"
                />
                <div>
                  <h4 className="nav-playlist">{artist.name}</h4>
                  <p className="nav-type">Artist</p>
                </div>
              </Link>
            ))}
          {savedPlaylists != [] &&
            savedPlaylists.map((playlist) => (
              <Link
                key={playlist.uri}
                className="nav-button nav-button-pl"
                to="/playlist"
              >
                <img
                  className="nav-pl-img"
                  src={playlist.images[0].url}
                  alt="pl-img"
                />
                <div>
                  <h4 className="nav-playlist">
                    {truncateString(playlist.name, 17)}
                  </h4>
                  <p className="nav-type">
                    Playlist • {playlist.owner.display_name}
                  </p>
                </div>
              </Link>
            ))}
          {savedAlbums != [] &&
            savedAlbums.map((album) => (
              <Link
                key={album.album.uri}
                className="nav-button nav-button-pl"
                to="/album"
              >
                <img
                  className="nav-pl-img"
                  src={album.album.images[0].url}
                  alt="pl-img"
                />
                <div>
                  <h4 className="nav-playlist">
                    {truncateString(album.album.name, 15)}
                  </h4>
                  <p className="nav-type">
                    Album • {album.album.artists[0].name}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </nav>
    </aside>
  );
}
