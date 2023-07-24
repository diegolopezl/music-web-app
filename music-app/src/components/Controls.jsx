import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import "../styles/Player.css";

export default function Controls({
  accessToken,
  trackUri,
  setTrackUri,
  queue,
}) {
  const [play, setPlay] = useState(false);
  const initialVolume = 0.35;

  useEffect(() => {
    setPlay(true);
    trackUri != "" && localStorage.setItem("trackUri", trackUri);
  }, [trackUri]);

  // useEffect(() => {
  //   console.log(queue);
  // }, [queue]);

  useEffect(() => {
    const storedTrackUri = localStorage.getItem("trackUri");
    setTrackUri(storedTrackUri);
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
