import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import CardContainer from "./CardContainer";
import {
  TrackCards,
  PlaylistCards,
  AlbumCards,
  ArtistCards,
} from "./CardComponents";

const API_BASE_URL = "https://api.spotify.com/v1";

export default function Home({
  accessToken,
  userName,
  userImage,
  setTrackUri,
  setTypeId,
  setType,
}) {
  const [trackResults, setTrackResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [recommendedArtists, setRecommendedArtists] = useState([]);
  const [globalTracks, setGlobalTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [genrePlaylist, setGenrePlaylist] = useState([]);

  const dataLimit = 25;
  const auth = `Bearer ${accessToken}`;

  useEffect(() => {
    const startTime = performance.now();
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
          async (artistId) => {
            const artistInfo = await axios.get(
              `${API_BASE_URL}/artists/${artistId}`,
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

        const topGenre = topArtists.data.items
          .slice(0, 1)
          .map((artist) => artist.genres[0])
          .join(",");

        const genrePlaylist = await axios.get(`${API_BASE_URL}/search`, {
          params: {
            q: topGenre,
            type: "album",
            limit: 15,
          },
          headers: {
            Authorization: auth,
          },
        });

        const genrePlaylistsResponse = genrePlaylist.data.albums.items;

        // Set the user's top tracks, recommended tracks/artists, global top tracks, recently played tracks, and featured playlists
        setTrackResults(topTracks.data.items);
        setArtistResults(topArtists.data.items);
        setRecommendedTracks(recommendedTracksResponse.data.tracks);
        setRecommendedArtists(recommendedArtistsDataResponse);
        setRecentlyPlayed(recent.data.items);
        setFeaturedPlaylists(featured.data.playlists.items);
        setGlobalTracks(topGlobal.data.items);
        setGenrePlaylist(genrePlaylistsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const endTime = performance.now();

    const elapsedTime = endTime - startTime;

    console.log(`Tiempo de ejecucion: ${elapsedTime} milisegundos`);
  }, [accessToken]);

  const [time, setTime] = useState("");

  function chooseTrack(track) {
    setTrackUri(track);
    // setQueue((prevQueue) => [...prevQueue, track]);
  }

  useEffect(() => {
    let date = new Date();
    let hour = date.getHours();
    setTime(
      hour < 12 ? "morning" : hour >= 12 && hour <= 17 ? "afternoon" : "evening"
    );
  }, []);

  return (
    <section className="center">
      <Header userName={userName} userImage={userImage} />
      <div className="center-content">
        <h1 className="home-greeting">
          Good {time}, {userName.slice(0, userName.indexOf(" "))}
        </h1>
        <CardContainer cardWidth={200}>
          {trackResults.map((track) => (
            <TrackCards
              key={track.id}
              track={track}
              chooseTrack={chooseTrack}
              // addToQueue={addToQueue}
            />
          ))}
        </CardContainer>

        <h2>Songs you might like</h2>
        <CardContainer cardWidth={200}>
          {recommendedTracks.map((track) => (
            <TrackCards
              key={track.id}
              track={track}
              chooseTrack={chooseTrack}
              // addToQueue={addToQueue}
            />
          ))}
        </CardContainer>

        <h2>Your top artists</h2>
        <CardContainer cardWidth={200}>
          {artistResults.map((item) => (
            <ArtistCards
              key={item.id}
              artist={item}
              setType={setType}
              setTypeId={setTypeId}
            />
          ))}
        </CardContainer>

        <h2>Top 50 - Global</h2>
        <CardContainer cardWidth={200}>
          {globalTracks.map((item) => {
            const track = item.track;
            return (
              <TrackCards
                key={track.id}
                track={track}
                chooseTrack={chooseTrack}
                // addToQueue={addToQueue}
              />
            );
          })}
        </CardContainer>

        <h2>Recently played</h2>
        <CardContainer cardWidth={200}>
          {recentlyPlayed.map((item) => {
            const track = item.track;
            return (
              <TrackCards
                key={track.id}
                track={track}
                chooseTrack={chooseTrack}
                // addToQueue={addToQueue}
              />
            );
          })}
        </CardContainer>

        <h2>Some albums for you</h2>
        <CardContainer cardWidth={200}>
          {genrePlaylist.map((album) => (
            <AlbumCards
              key={album.id}
              image={album.images[0]?.url}
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

        <h2>Recommended Artists</h2>
        <CardContainer cardWidth={200}>
          {recommendedArtists.map((artist) => (
            <ArtistCards
              key={artist.id}
              artist={artist}
              setType={setType}
              setTypeId={setTypeId}
            />
          ))}
        </CardContainer>

        <h2>Featured playlists</h2>
        <CardContainer cardWidth={200}>
          {featuredPlaylists.map((playlist) => (
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
      <Footer />
    </section>
  );
}
