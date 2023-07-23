import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import "../styles/Player.css";

export default function Controls({ accessToken }) {
  const [play, setPlay] = useState(false);
  const [trackUri, setTrackUri] = useState([]);

  useEffect(() => {
    const fetchUri = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/uri");
        const data = await response.json();
        setTrackUri(data.uri);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUri();
  }, [play]);

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
