import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import "../styles/Player.css";

export default function Controls({
  accessToken,
  trackUri,
  setTrackUri,
  // fetchTrackUri,
  // setFetchTrackUri,
}) {
  const [play, setPlay] = useState(false);
  const initialVolume = 0.5;
  // const [trackUri, setTrackUri] = useState([]);

  // useEffect(() => {
  //   const getUri = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/api/uri");
  //       const data = await response.json();
  //       setTrackUri(data.uri);
  //       console.log(data.uri);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   if (fetchTrackUri) {
  //     getUri();
  //     setFetchTrackUri(false); // Reset the state to false after fetching the URI
  //   }
  // }, [fetchTrackUri]);

  useEffect(() => {
    setPlay(true);
    trackUri != "" && localStorage.setItem("trackUri", trackUri);
  }, [trackUri]);

  useEffect(() => {
    // When the component mounts, get the trackUri from localStorage
    const storedTrackUri = localStorage.getItem("trackUri");
    setTrackUri(storedTrackUri); // Set the initial value to the value from localStorage or an empty string if not available
  }, [setTrackUri]);

  if (!accessToken) return null;
  return (
    <div className="player-controls">
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state) => !state.isPlaying && setPlay(false)}
        play={play}
        initialVolume={initialVolume}
        uris={trackUri ? [trackUri] : []}
        layout="responsive"
        styles={{
          activeColor: "#fff",
          color: "#fff",
          loaderColor: "#fff",
          sliderColor: "#fff",
          sliderTrackColor: "#4d4d4d",
          trackArtistColor: "#ccc",
          trackNameColor: "#fff",
          height: 80,
        }}
      />
    </div>
  );
}
