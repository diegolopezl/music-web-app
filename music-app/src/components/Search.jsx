import { useState, useEffect } from "react";
import Results from "./Results";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {
  TrackCards,
  PlaylistCards,
  AlbumCards,
  ArtistCards,
} from "./CardComponents";
import CardContainer from "./CardContainer";

// Spotify's Web API base url, saved into a variable
const API_BASE_URL = "https://api.spotify.com/v1";

//Component for searching using the Spotify API.
export default function Search({
  accessToken,
  userName,
  userImage,
  setTrackUri,
  setTypeId,
  setType,
  // setFetchTrackUri,
}) {
  //Initializing state variables
  const [search, setSearch] = useState("");
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [albumResults, setAlbumResults] = useState([]);
  const [playlistResults, setPlaylistResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const auth = `Bearer ${accessToken}`;

  //Fetches data from the Spotify API based on the search query.
  //Updates the trackResults and artistResults state array variables accordingly.
  useEffect(() => {
    const startTime = performance.now();
    if (!search) {
      setTrackResults([]); // Reset trackResults when search is empty
      setSearchResults([]); // Reset artistResults when search is empty
      return;
    }
    if (!accessToken) return;
    let cancel = false;

    //Fetching data with asynchronous functions
    const fetchData = async () => {
      try {
        // Creating promises for each API call
        const results = await axios.get(`${API_BASE_URL}/search`, {
          params: {
            q: search,
            type: "track,artist,album,playlist",
            limit: 10,
          },
          headers: {
            Authorization: auth,
          },
        });
        if (!cancel) {
          setTrackResults(results.data.tracks.items);
          setArtistResults(results.data.artists.items);
          setAlbumResults(results.data.albums.items);
          setPlaylistResults(results.data.playlists.items);
        }
      } catch (error) {
        console.log("Error fetching search results:", error);
      }
    };

    fetchData();
    const endTime = performance.now();

    const elapsedTime = endTime - startTime;

    console.log(`Tiempo de ejecucion: ${elapsedTime} milisegundos`);

    return () => (cancel = true); // Cancel the fetch request if the component unmounts or the search query changes
  }, [search, accessToken]);

  function chooseTrack(track) {
    setTrackUri(track);
    setSearch("");
    // setFetchTrackUri(true);
  }
  return (
    <section className="center">
      <Header
        search={search}
        setSearch={setSearch}
        userName={userName}
        userImage={userImage}
      />

      <div className="center-content">
        {!search ? (
          <div className="default-search">
            <h2>Search any song you want.</h2>
          </div>
        ) : (
          <div className="search-results">
            <h2>Tracks</h2>
            <CardContainer cardWidth={200}>
              {trackResults.map((track) => (
                <TrackCards
                  key={track.id}
                  track={track}
                  chooseTrack={chooseTrack}
                />
              ))}
            </CardContainer>

            {artistResults.length > 0 && (
              <div>
                <h2>Artists</h2>
                <CardContainer cardWidth={200}>
                  {artistResults.map((artist) => (
                    <ArtistCards
                      key={artist.id}
                      artist={artist}
                      setType={setType}
                      setTypeId={setTypeId}
                    />
                  ))}
                </CardContainer>
              </div>
            )}

            <h2>Albums</h2>
            <CardContainer cardWidth={200}>
              {albumResults.map((album) => (
                <AlbumCards
                  key={album.id}
                  image={album.images[0].url}
                  title={album.name}
                  year={album.release_date.slice(0, 4)}
                  artist={album.artists[0].name}
                  id={album.id}
                  type={album.type}
                  setType={setType}
                  setTypeId={setTypeId}
                />
              ))}
            </CardContainer>
            <h2>Playlists</h2>
            <CardContainer cardWidth={200}>
              {playlistResults.map((playlist) => (
                <PlaylistCards
                  key={playlist.id}
                  image={playlist.images[0]?.url}
                  title={playlist.name}
                  description={playlist.description}
                  id={playlist.id}
                  type={playlist.type}
                  setType={setType}
                  setTypeId={setTypeId}
                />
              ))}
            </CardContainer>
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
}
