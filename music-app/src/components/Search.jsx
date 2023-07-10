import { useState, useEffect } from "react";
import Results from "./Results";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import Controls from "./Controls";
import useAuth from "./useAuth";

// Spotify's Web API base url, saved into a variable
const API_BASE_URL = "https://api.spotify.com/v1";

//Component for searching using the Spotify API.
export default function Search({ accessToken, userName, userImage }) {
  //Initializing state variables
  const [search, setSearch] = useState("");
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
  }

  //Fetches data from the Spotify API based on the search query.
  //Updates the trackResults and artistResults state array variables accordingly.
  useEffect(() => {
    if (!search) {
      setTrackResults([]); // Reset trackResults when search is empty
      setArtistResults([]); // Reset artistResults when search is empty
      return;
    }
    let cancel = false;

    //Fetching data with asynchronous functions
    const fetchData = async () => {
      try {
        // Creating promises for each API call
        const [tracks, artists] = await Promise.all([
          // Using GET with Axios using the base URL and setting the endpoint to "search",
          // with these parameters for the request
          axios.get(`${API_BASE_URL}/search`, {
            params: {
              q: search,
              type: "track",
              limit: 20,
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

  return (
    <section className="center">
      <Header
        search={search}
        setSearch={setSearch}
        userName={userName}
        userImage={userImage}
      />

      <div className="center-content">
        {/* Rendering each type of result using the map function // to map over the
      array of results from the api */}
        {trackResults.length > 0 && (
          <div className="search-results">
            <h3>Songs</h3>
            {trackResults.map((track) => (
              <Results
                key={track.uri}
                track={track}
                chooseTrack={chooseTrack}
              />
            ))}
          </div>
        )}
        {/* {artistResults.length > 0 && (
          <div className="search-results">
            <h3>Artists</h3>
            {artistResults.map((artist) => (
              <Results key={artist.id} artist={artist} chooseTrack={chooseTrack} />
            ))}
          </div>
        )} */}
      </div>
      <Footer />
    </section>
  );
}
