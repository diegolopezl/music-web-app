import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { BiSolidPlaylist } from "react-icons/bi";
import {
  capitalizeFirstLetter,
  formatNumberWithCommas,
  msToMinuteFormat,
} from "../App";

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
  const auth = `Bearer ${accessToken}`;

  useEffect(() => {
    const startTime = performance.now();
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
        setPlaylistTracks(response.data?.tracks?.items || []);
        console.log(playlistData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
    const endTime = performance.now();

    const elapsedTime = endTime - startTime;

    console.log(`Tiempo de ejecucion: ${elapsedTime} milisegundos`);
  }, [accessToken, typeId]);

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
                {playlistData.public == true && "Public"}{" "}
                {capitalizeFirstLetter(playlistData.type)}
              </h2>
              <h1 className="type-title">{playlistData.name}</h1>
              <p className="type-description">{playlistData.description}</p>
              <h4 className="type-info">
                {playlistData.owner?.display_name} •{" "}
                {formatNumberWithCommas(playlistData.followers.total)} likes •{" "}
                {playlistData.total_tracks} songs
              </h4>
            </div>
          </div>
        ) : (
          <PlaceHolderPlaylist />
        )}
        <div className="playlist-tracks">
          {playlistTracks.map((playlist, index) => {
            return (
              <TrackListItems
                key={playlist.track.uri}
                name={playlist.track.name}
                image={playlist.track.album.images[0]?.url}
                artists={playlist.track.artists}
                index={index + 1}
                chooseTrack={chooseTrack}
                track={playlist.track}
                duration={msToMinuteFormat(playlist.track.duration_ms)}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </section>
  );
}

function TrackListItems({
  track,
  name,
  artists,
  image,
  duration,
  index,
  chooseTrack,
}) {
  function handlePlay() {
    chooseTrack(track?.uri);
  }
  const artistNames = artists.map((artist) => artist.name).join(", ");
  return (
    <div className="playlist-li" onClick={handlePlay}>
      <div>
        <div className="playlist-li-index">
          <p>{index}</p>
        </div>
        <div className="playlist-li-img">
          <img src={image} />
        </div>
        <div className="playlist-li-text">
          <h4>{name}</h4>
          <p>{artistNames}</p>
        </div>
      </div>
      <p className="playlist-li-duration">{duration}</p>
    </div>
  );
}

function PlaceHolderPlaylist() {
  return (
    <>
      <div className="playlist-page-top">
        <div className="playlist-cover-wrap">
          <BiSolidPlaylist className="img-placeholder-icon" />
        </div>
        <div className="playlist-title-section">
          <h2 className="route-type">Playlist</h2>
          <h1 className="type-title">Title</h1>
          <h4 className="type-info">Owner • 0 likes • 0 songs</h4>
        </div>
      </div>
      <div className="playlist-tracks"></div>
    </>
  );
}
