import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { IoDiscSharp } from "react-icons/io5";
import {
  capitalizeFirstLetter,
  formatNumberWithCommas,
  msToMinuteFormat,
} from "../App";

const API_BASE_URL = "https://api.spotify.com/v1";
export default function Albums({
  accessToken,
  userName,
  userImage,
  typeId,
  setTrackUri,
}) {
  const [albumData, setAlbumData] = useState({});
  const [albumTracks, setAlbumTracks] = useState([]);
  const auth = `Bearer ${accessToken}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/albums/${typeId}`, {
          headers: {
            Authorization: auth,
          },
        });
        setAlbumData(response.data);
        setAlbumTracks(response.data?.tracks?.items || []);
        console.log(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [accessToken, typeId]);

  function chooseTrack(track) {
    setTrackUri(track);
    // setQueue((prevQueue) => [...prevQueue, track]);
  }
  return (
    <section className="center">
      <Header userName={userName} userImage={userImage} />
      <div className="album-route-content">
        {albumData.images?.length > 0 ? (
          <div className="playlist-page-top">
            <div className="playlist-cover-wrap">
              <img className="playlist-cover" src={albumData.images[0].url} />
            </div>
            <div className="playlist-title-section">
              <h2 className="route-type">
                {capitalizeFirstLetter(albumData.type)}
              </h2>
              <h1 className="type-title">{albumData.name}</h1>
              <h4 className="type-info">
                {albumData.artists[0]?.name && `Various Artists`} •{" "}
                {albumData.release_date.slice(0, 4)} • {albumData.total_tracks}{" "}
                songs
              </h4>
            </div>
          </div>
        ) : (
          <PlaceHolderAlbum />
        )}
        <div className="playlist-tracks">
          {albumTracks.map((track, index) => {
            return (
              <AlbumTracks
                key={track.id}
                name={track.name}
                artists={track.artists}
                index={index + 1}
                chooseTrack={chooseTrack}
                uri={track.uri}
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

function AlbumTracks({ uri, name, artists, index, duration, chooseTrack }) {
  function handlePlay() {
    chooseTrack(uri);
  }
  const artistNames = artists.map((artist) => artist.name).join(", ");
  return (
    <div className="playlist-li" onClick={handlePlay}>
      <div>
        <div className="playlist-li-index">
          <p>{index}</p>
        </div>
        <div></div>
        <div className="playlist-li-text">
          <h4>{name}</h4>
          <p>{artistNames}</p>
        </div>
      </div>
      <p className="playlist-li-duration">{duration}</p>
    </div>
  );
}

// function PlaylistTracks({ track, name, artist, image, index, chooseTrack }) {
//   function handlePlay() {
//     chooseTrack(track?.uri);
//   }
//   return (
//     <div className="playlist-li" onClick={handlePlay}>
//       <div className="playlist-li-index">{index}</div>
//       <div className="playlist-li-img">
//         <img src={image} />
//       </div>
//       <div className="playlist-li-text">
//         <h4>{name}</h4>
//         <p>{artist}</p>
//       </div>
//     </div>
//   );
// }

function PlaceHolderAlbum() {
  return (
    <>
      <div className="playlist-page-top">
        <div className="playlist-cover-wrap">
          <IoDiscSharp className="img-placeholder-icon" />
          {/* <img className="playlist-cover" src={playlistData.images[0].url} /> */}
        </div>
        <div className="playlist-title-section">
          <h2 className="route-type">Album</h2>
          <h1 className="type-title">Title</h1>
          <h4 className="type-info">Artist • Year • 0 songs</h4>
        </div>
      </div>
      <div className="album-tracks"></div>
    </>
  );
}
