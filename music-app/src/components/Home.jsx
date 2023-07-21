import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { TrackCards, PlaylistCards, ArtistCards } from "./CardComponents";

const API_BASE_URL = "https://api.spotify.com/v1";

export default function Home({ accessToken, userName }) {
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [recommendedArtists, setRecommendedArtists] = useState([]);
  const [globalTracks, setGlobalTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);

  const dataLimit = 25;
  const auth = `Bearer ${accessToken}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topTracks, topGlobal, recent, featured, topArtists] =
          await Promise.all([
            // Fetch user's top tracks
            axios.get(`${API_BASE_URL}/me/top/tracks`, {
              params: {
                time_range: "medium_term",
                limit: dataLimit,
              },
              headers: {
                Authorization: auth,
              },
            }),
            // Fetch top 5 tracks from the global top 50 playlist
            axios.get(
              `${API_BASE_URL}/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks`,
              {
                params: {
                  limit: dataLimit,
                },
                headers: {
                  Authorization: auth,
                },
              }
            ),
            // Fetch recently played tracks
            axios.get(`${API_BASE_URL}/me/player/recently-played`, {
              params: {
                limit: dataLimit,
              },
              headers: {
                Authorization: auth,
              },
            }),
            // Fetch featured playlists
            axios.get(`${API_BASE_URL}/browse/featured-playlists`, {
              params: {
                limit: dataLimit,
              },
              headers: {
                Authorization: auth,
              },
            }),
            // Fetch user's top artists
            axios.get(`${API_BASE_URL}/me/top/artists`, {
              params: {
                time_range: "long_term",
                limit: dataLimit,
              },
              headers: {
                Authorization: auth,
              },
            }),
          ]);

        const seedTracks = topTracks.data.items
          .map((track) => track.id)
          .slice(0, 5)
          .join(",");

        const seedArtists = topArtists.data.items
          .map((artist) => artist.id)
          .slice(0, 5)
          .join(",");

        const [recommendedTracksResponse, recommendedArtistsResponse] =
          await Promise.all([
            // Fetch recommended tracks
            axios.get(`${API_BASE_URL}/recommendations`, {
              params: {
                seed_tracks: seedTracks,
                limit: dataLimit,
              },
              headers: {
                Authorization: auth,
              },
            }),
            // Fetch recommended artists
            axios.get(`${API_BASE_URL}/recommendations`, {
              params: {
                seed_artists: seedArtists,
                limit: dataLimit,
              },
              headers: {
                Authorization: auth,
              },
            }),
          ]);

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
                  Authorization: auth,
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
        <CardContainer cardWidth={200}>
          {trackResults.map((track) => (
            <TrackCards key={track.id} track={track} />
          ))}
        </CardContainer>

        <h2>Songs you might like</h2>
        <CardContainer cardWidth={200}>
          {recommendedTracks.map((track) => (
            <TrackCards key={track.id} track={track} />
          ))}
        </CardContainer>

        <h2>Your top artists</h2>
        <CardContainer cardWidth={200}>
          {artistResults.map((item) => (
            <ArtistCards key={item.id} artist={item} />
          ))}
        </CardContainer>

        <h2>Top 50 - Global</h2>
        <CardContainer cardWidth={200}>
          {globalTracks.map((item) => {
            const track = item.track;
            return <TrackCards key={track.id} track={track} />;
          })}
        </CardContainer>

        <h2>Recently played</h2>
        <CardContainer cardWidth={200}>
          {recentlyPlayed.map((item) => {
            const track = item.track;
            return <TrackCards key={track.id} track={track} />;
          })}
        </CardContainer>

        <h2>Recommended Artists</h2>
        <CardContainer cardWidth={200}>
          {recommendedArtists.map((artist) => (
            <ArtistCards key={artist.id} artist={artist} />
          ))}
        </CardContainer>

        <h2>Featured playlists</h2>
        <CardContainer cardWidth={200}>
          {featuredPlaylists.map((playlist) => (
            <PlaylistCards
              key={playlist.id}
              image={playlist.images[0].url}
              title={playlist.name}
              description={playlist.description}
            />
          ))}
        </CardContainer>
      </div>
      <Footer />
    </section>
  );
}

function CardContainer({ children, cardWidth }) {
  // Ref to get the width of the container element
  const containerRef = useRef(null);

  // Calculate the number of cards to be shown based on container width
  const [cardAmount, setCardAmount] = useState(5);
  const minGap = 30; // Minimum gap between cards

  useEffect(() => {
    // Update the number of cards to be shown based on the container width.
    const updateCardAmount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const maxAmount = Math.floor(
          (containerWidth + minGap) / (cardWidth + minGap)
        );
        console.log(maxAmount);
        // Limit the cardAmount to a maximum of 15
        setCardAmount(Math.min(maxAmount, 15));
      }
    };

    // Update the number of cards to be shown on initial render and window resize
    updateCardAmount();
    window.addEventListener("resize", updateCardAmount);
    return () => window.removeEventListener("resize", updateCardAmount);
  }, []);

  return (
    <div className="track-cards" ref={containerRef}>
      {React.Children.map(children, (child, index) => {
        // Show only the first cardAmount children
        if (index < cardAmount) {
          return child;
        }
        return null;
      })}
    </div>
  );
}
