import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { truncateString } from "./Results";

const API_BASE_URL = "https://api.spotify.com/v1";

export default function Home({ accessToken, userName }) {
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [recommendedArtists, setRecommendedArtists] = useState([]);
  const [globalTracks, setGlobalTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);

  const countryCode = "JP";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topTracks, topGlobal, recent, featured, topArtists] =
          await Promise.all([
            // Fetch user's top tracks
            axios.get(`${API_BASE_URL}/me/top/tracks`, {
              params: {
                time_range: "medium_term",
                limit: 5,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            // Fetch top 5 tracks from the global top 50 playlist
            axios.get(
              `${API_BASE_URL}/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks`,
              {
                params: {
                  limit: 5,
                },
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            ),
            // Fetch recently played tracks
            axios.get(`${API_BASE_URL}/me/player/recently-played`, {
              params: {
                limit: 5,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            // Fetch featured playlists
            axios.get(`${API_BASE_URL}/browse/featured-playlists`, {
              params: {
                limit: 5,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
            // Fetch user's top artists
            axios.get(`${API_BASE_URL}/me/top/artists`, {
              params: {
                time_range: "medium_term",
                limit: 5,
              },
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }),
          ]);
        // Fetch recommended tracks
        const seedTracks = topTracks.data.items
          .map((track) => track.id)
          .join(",");
        const recommendedTracksResponse = await axios.get(
          `${API_BASE_URL}/recommendations`,
          {
            params: {
              seed_tracks: seedTracks,
              limit: 5, // Fetch 5 recommended tracks
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const seedArtists = topArtists.data.items
          .map((artist) => artist.id)
          .join(",");
        const recommendedArtistsResponse = await axios.get(
          `${API_BASE_URL}/recommendations`,
          {
            params: {
              seed_artists: seedArtists,
              limit: 5, // Fetch 5 recommended artists
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Store recommended artists with their IDs in a separate array
        const recommendedArtistsIDs =
          recommendedArtistsResponse.data.tracks.map(
            (track) => track.artists[0].id
          );

        // Fetch additional information for each recommended artist based on their ID
        const recommendedArtistsDataPromises = recommendedArtistsIDs.map(
          async (artistID) => {
            const artistInfo = await axios.get(
              `${API_BASE_URL}/artists/${artistID}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            return artistInfo.data;
          }
        );

        // Wait for all the promises to resolve and set the recommendedArtistsData state
        const recommendedArtistsDataResponse = await Promise.all(
          recommendedArtistsDataPromises
        );

        // Set the user's top tracks, recommended tracks/artists, global top tracks, recently played tracks, and featured playlists
        setTrackResults(topTracks.data.items);
        setRecommendedTracks(recommendedTracksResponse.data.tracks);
        setRecommendedArtists(recommendedArtistsDataResponse);
        setGlobalTracks(topGlobal.data.items);
        setRecentlyPlayed(recent.data.items);
        setFeaturedPlaylists(featured.data.playlists.items);
        setArtistResults(topArtists.data.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  const [time, setTime] = useState("");

  useEffect(() => {
    let date = new Date();
    let hour = date.getHours();
    setTime(
      hour < 12 ? "morning" : hour >= 12 && hour <= 17 ? "afternoon" : "evening"
    );
  }, []);

  return (
    <section className="center">
      <Header userName={userName} />
      <div className="center-content">
        <h1 className="home-greeting">
          Good {time}, {userName.slice(0, userName.indexOf(" "))}
        </h1>
        <div className="track-cards">
          {trackResults.map((track) => (
            <HomeCards key={track.id} track={track} />
          ))}
        </div>

        <h2>Songs you might like</h2>
        <div className="track-cards">
          {recommendedTracks.map((track) => (
            <HomeCards key={track.id} track={track} />
          ))}
        </div>

        <h2>Your top artists</h2>
        <div className="track-cards">
          {artistResults.map((item) => (
            <ArtistCards key={item.id} artist={item} />
          ))}
        </div>

        <h2>Top 50 - Global</h2>
        <div className="track-cards">
          {globalTracks.map((item) => {
            const track = item.track;
            return <HomeCards key={track.id} track={track} />;
          })}
        </div>

        <h2>Recently played</h2>
        <div className="track-cards">
          {recentlyPlayed.map((item) => {
            const track = item.track;
            return <HomeCards key={track.id} track={track} />;
          })}
        </div>

        <h2>Recommended Artists</h2>
        <div className="track-cards">
          {recommendedArtists.map((artist) => (
            <ArtistCards key={artist.id} artist={artist} />
          ))}
        </div>

        <h2>Featured playlists</h2>
        <div className="track-cards">
          {featuredPlaylists.map((playlist) => (
            <PlaylistCards
              key={playlist.id}
              image={playlist.images[0].url}
              title={playlist.name}
              description={playlist.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// HomeCards function component to render individual track cards
function HomeCards({ track }) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const truncatedArtistNames = truncateString(artistNames, 30);

  return (
    <div className="card">
      <img
        className="cover-img"
        src={track.album.images[0].url}
        alt={track.name}
      />
      <p className="card-title">{truncateString(track.name, 16)}</p>
      <p className="card-text">{truncatedArtistNames}</p>
    </div>
  );
}

function PlaylistCards({ image, title, description }) {
  const truncatedDescription = truncateString(description, 40);
  return (
    <div className="card">
      <img className="cover-img" src={image} alt={title} />
      <p className="card-title">{truncateString(title, 14)}</p>
      <p className="card-text">{truncatedDescription}</p>
    </div>
  );
}

function ArtistCards({ artist }) {
  return (
    <div className="card">
      <img
        className="artist-img"
        src={artist.images[0].url}
        alt={artist.name}
      />
      <p className="card-title">{truncateString(artist.name, 16)}</p>
      <p className="card-text">Artist</p>
    </div>
  );
}
