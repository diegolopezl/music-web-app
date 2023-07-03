import React from "react";
import arrow from "../assets/arrow-hero.svg";
import blobs from "../assets/blobs2.svg";
const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=63d757ee79774e2c82429b24c51aade3&response_type=code&redirect_uri=http://localhost:5173/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  const handleLoginClick = () => {
    window.location.replace(AUTH_URL);
  };

  return (
    <section className="login-section">
      <div className="login-box">
        <div>
          <h1>Hello, Welcome!</h1>
          <p>Enjoy our music and customize your experience!</p>
          <img src={arrow} />
        </div>
        <a className="log-in-spotify" onClick={handleLoginClick}>
          Login with Spotify
        </a>
      </div>
      <img className="color-blobs" src={blobs} />
    </section>
  );
}
