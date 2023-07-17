import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

export default function Home({ accessToken, userName }) {
  const [trackResults, setTrackResults] = useState([]);
  const [globalTracks, setGlobalTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        // Fetch user's top tracks
        const tracksResponse = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              time_range: "medium_term",
              limit: 5,
            },
          }
        );

        // Get the track items from the response
        const trackItems = tracksResponse.data.items;

        // Set the user's top tracks
        setTrackResults(trackItems);

        // Fetch global top tracks
        const globalTracksResponse = await axios.get(
          "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              limit: 5, // Fetch only the first 5 tracks from the top 50 global playlist
            },
          }
        );

        // Get the global top track items from the response
        const globalTrackItems = globalTracksResponse.data.items;

        // Set the global top tracks
        setGlobalTracks(globalTrackItems);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    fetchTopTracks();
  }, [accessToken]);

  return (
    <section className="center">
      <Header userName={userName} />
      <div className="center-content">
        <h2>Your Top Tracks:</h2>
        <div className="track-cards">
          {trackResults.map((track) => (
            <div key={track.id} className="track-card">
              <img src={track.album.images[0].url} alt={track.name} />
              <p className="track-title">{track.name}</p>
              <p className="track-artist">{track.artists[0].name}</p>
            </div>
          ))}
        </div>

        <h2>Top 5 Global Tracks:</h2>
        <div className="track-cards">
          {globalTracks.map((item) => {
            const track = item.track;
            return (
              <div key={track.id} className="track-card">
                <img src={track.album.images[0].url} alt={track.name} />
                <p className="track-title">{track.name}</p>
                <p className="track-artist">{track.artists[0].name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
