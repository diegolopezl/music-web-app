import React from "react";
import arrow from "../assets/arrow-hero.svg";
import blobs from "../assets/blobs2.svg";

//Login component responsible for rendering the login section.
export default function Login({ clientId }) {
  // The Spotify authorization URL
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:5173/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

  // Handles the login button click event and redirects the user to the Spotify authorization URL.
  const handleLoginClick = () => {
    window.location.replace(AUTH_URL);
  };

  return (
    <section className="login-section">
      <div className="login-box">
        <div>
          <h1>Hello, Welcome!</h1>
          <p>Enjoy our music and customize your experience!</p>
          <img src={arrow} alt="Arrow" />
        </div>
        <a className="log-in-spotify" onClick={handleLoginClick}>
          Login with Spotify
        </a>
      </div>
      <img className="color-blobs" src={blobs} alt="Blobs" />
    </section>
  );
}
