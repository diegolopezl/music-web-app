import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import "../styles/Player.css";

export default function Controls({ accessToken }) {
  const [play, setPlay] = useState(false);

  const trackUri = localStorage.getItem("trackUri");
  console.log(trackUri);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);
  if (!accessToken) return null;
  return (
    <div className="player-controls">
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state) => {
          if (!state.isPlaying) setPlay(false);
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
        styles={{
          activeColor: "#fff",
          bgColor: "#000000",
          color: "#fff",
          loaderColor: "#fff",
          sliderColor: "#fff",
          sliderHandleColor: "#fff",
          trackArtistColor: "#ccc",
          trackNameColor: "#fff",
          height: 80,
        }}
      />
    </div>
  );
}
