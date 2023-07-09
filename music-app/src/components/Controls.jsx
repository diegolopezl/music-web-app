import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Controls({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  if (!accessToken) return null;
  return (
    <div className="player-controls">
      <SpotifyPlayer
        token={accessToken}
        showSaveIcon
        callback={(state) => !state.isPlaying && setPlay(false)}
        play={play}
        uris={trackUri ? trackUri : []}
        styles={{
          activeColor: "#fff",
          bgColor: "transparent",
          color: "#fff",
          loaderColor: "#fff",
          sliderColor: "#fff",
          sliderHandleColor: "#fff",
          trackArtistColor: "#ccc",
          trackNameColor: "#fff",
          height: "80px",
        }}
      />
    </div>
  );
}
