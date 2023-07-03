import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Results from "./Results";
import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";

export default function SearchPage({ accessToken }) {
  const [search, setSearch] = useState("");
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);

  useEffect(() => {
    if (!search) return; // Don't perform the search if the query is empty

    let cancel = false;

    const fetchData = async () => {
      try {
        const [tracks, artists] = await Promise.all([
          axios.get(`${API_BASE_URL}/search`, {
            params: {
              q: search,
              type: "track",
              limit: 10,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          axios.get(`${API_BASE_URL}/search`, {
            params: {
              q: search,
              type: "artist",
              limit: 5,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        if (!cancel) {
          setTrackResults(tracks.data.tracks.items);
          setArtistResults(artists.data.artists.items);
        }
      } catch (error) {
        console.log("Error fetching search results:", error);
      }
    };

    fetchData();

    return () => {
      cancel = true; // Cancel the fetch request if the component unmounts or the search query changes
    };
  }, [search, accessToken]);

  useEffect(() => {
    console.log(trackResults);
    console.log(artistResults);
  }, [trackResults, artistResults]);

  return (
    <section className="center-section">
      <div className="search-bar">
        <FiSearch className="nav-icon" />
        <input
          className="search-input"
          type="search"
          placeholder="Search something"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      {trackResults.length > 0 && (
        <div className="search-results">
          <h3>Songs</h3>
          {trackResults.map((track) => (
            <Results key={track.uri} track={track} />
          ))}
        </div>
      )}

      {artistResults.length > 0 && (
        <div className="search-results">
          <h3>Artists</h3>
          {artistResults.map((artist) => (
            <Results key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </section>
  );
}
