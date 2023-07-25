import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const API_BASE_URL = "https://api.spotify.com/v1";

export default function Playlist({
  accessToken,
  userName,
  userImage,
  typeId,
  setTrackUri,
}) {
  const [playlistData, setPlaylistData] = useState({});
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [count, setCount] = useState(0);
  const auth = `Bearer ${accessToken}`;

  console.log(typeId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/playlists/${typeId}`,
          {
            headers: {
              Authorization: auth,
            },
          }
        );
        setPlaylistData(response.data);
        console.log(playlistData.tracks);
        setPlaylistTracks(response.data?.tracks?.items || []);
        console.log(playlistData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [accessToken, typeId]);

  function capitalizeFirstLetter(str) {
    const [firstLetter, ...rest] = str;
    return firstLetter.toUpperCase() + rest.join("");
  }

  function chooseTrack(track) {
    setTrackUri(track);
    // setQueue((prevQueue) => [...prevQueue, track]);
  }

  // function handleAddToQueue() {
  //   addToQueue(track?.uri);
  // }

  return (
    <section className="center">
      <Header userName={userName} userImage={userImage} />
      <div className="pl-route-content">
        {playlistData.images?.length > 0 ? (
          <div className="playlist-page-top">
            <div className="playlist-cover-wrap">
              <img
                className="playlist-cover"
                src={playlistData.images[0].url}
              />
            </div>
            <div className="playlist-title-section">
              <h2 className="route-type">
                {capitalizeFirstLetter(playlistData.type)}
              </h2>
              <h1 className="type-title">{playlistData.name}</h1>
              <p className="type-description">{playlistData.description}</p>
              <h4 className="type-info">
                {playlistData.owner?.display_name} •{" "}
                {playlistData.followers.total} likes •{" "}
                {playlistData.tracks.items.length} songs
              </h4>
            </div>
          </div>
        ) : (
          <p></p>
        )}
        <div className="playlist-tracks">
          {playlistTracks.map((playlist, index) => {
            return (
              <PlaylistTracks
                key={playlist.track.uri}
                name={playlist.track.name}
                image={playlist.track.album.images[0]?.url}
                artist={playlist.track.artists[0].name}
                index={index + 1}
                chooseTrack={chooseTrack}
                track={playlist.track}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </section>
  );
}

function PlaylistTracks({ track, name, artist, image, index, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track?.uri);
  }
  return (
    <div className="playlist-li" onClick={handlePlay}>
      <div className="playlist-li-index">{index}</div>
      <div className="playlist-li-img">
        <img src={image} />
      </div>
      <div className="playlist-li-text">
        <h4>{name}</h4>
        <p>{artist}</p>
      </div>
    </div>
  );
}
