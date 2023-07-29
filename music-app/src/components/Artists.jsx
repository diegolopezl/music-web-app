import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { FaUserAlt } from "react-icons/fa";
import {
  capitalizeFirstLetter,
  truncateString,
  formatNumberWithCommas,
  msToMinuteFormat,
} from "../App";

const API_BASE_URL = "https://api.spotify.com/v1";
export default function Artists({
  accessToken,
  userName,
  userImage,
  typeId,
  setTrackUri,
}) {
  const [artistData, setArtistData] = useState({});
  const [artistTracks, setArtistTracks] = useState([]);
  const auth = `Bearer ${accessToken}`;

  useEffect(() => {
    const startTime = performance.now();
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/artists/${typeId}`, {
          headers: {
            Authorization: auth,
          },
        });
        setArtistData(response.data);
        console.log(artistData);
      } catch (error) {
        console.error("Error fetching data" + error);
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/artists/${typeId}/top-tracks?market=US`,
          {
            headers: {
              Authorization: auth,
            },
          }
        );
        setArtistTracks(response.data.tracks);
        console.log(artistTracks);
      } catch (error) {
        console.error("Error fetching data " + error);
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
  return (
    <section className="center">
      <Header userName={userName} userImage={userImage} />
      <div className="artist-route-content">
        {artistData.images?.length > 0 ? (
          <div className="playlist-page-top">
            <div>
              <div className="playlist-cover-wrap">
                <img
                  className="playlist-cover"
                  src={artistData.images[0].url}
                />
              </div>
              <div className="playlist-title-section">
                <h2 className="route-type">
                  {capitalizeFirstLetter(artistData.type)}
                </h2>
                <h1 className="type-title">{artistData.name}</h1>
                {/* <p className="type-description">{playlistData.description}</p> */}
                <h4 className="type-info">
                  {formatNumberWithCommas(artistData.followers.total)} followers
                </h4>
              </div>
            </div>
          </div>
        ) : (
          <PlaceHolderArtist />
        )}
        <div className="playlist-tracks">
          {artistTracks.map((track, index) => {
            return (
              <TrackListItems
                key={track.id}
                name={track.name}
                album={track.album?.name}
                image={track.album.images[0]?.url}
                index={index + 1}
                chooseTrack={chooseTrack}
                track={track}
                duration={msToMinuteFormat(track.duration_ms)}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </section>
  );
}

function PlaceHolderArtist() {
  return (
    <>
      <div className="playlist-page-top">
        <div>
          <div className="playlist-cover-wrap">
            <FaUserAlt className="img-placeholder-icon" />
          </div>
          <div className="playlist-title-section">
            <h2 className="route-type">Artist</h2>
            <h1 className="type-title">Title</h1>
            <h4 className="type-info">monthly listeners</h4>
          </div>
        </div>
      </div>
      <div className="playlists-tracks"></div>
    </>
  );
}

function TrackListItems({
  track,
  name,
  album,
  image,
  duration,
  index,
  chooseTrack,
}) {
  function handlePlay() {
    chooseTrack(track?.uri);
  }
  return (
    <div className="playlist-li" onClick={handlePlay}>
      <div className="playlist-li-index">
        <p>{index}</p>
      </div>
      <div className="playlist-li-img">
        <img src={image} />
      </div>
      <div className="playlist-li-text">
        <h4>{truncateString(name, 40)}</h4>
      </div>
      <div className="playlist-li-album">
        <h4>{album}</h4>
      </div>
      <p className="playlist-li-duration">{duration}</p>
    </div>
  );
}
