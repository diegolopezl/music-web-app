import React from "react";
import arrow from "../assets/arrow-hero.svg";
import blobs from "../assets/blobs.svg";
const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=bdc864947d434109a5f887fb98551d7c&response_type=code&redirect_uri=http://localhost:5173/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return (
    <section className="login-section">
      <div className="login-box">
        <>
          <h1>Hello, Welcome!</h1>
          <p>Enjoy our music and customize your experience!</p>
          <img src={arrow} />
        </>
        <a className="log-in-spotify" href={AUTH_URL}>
          Login with Spotify
        </a>
      </div>
      <img className="color-blobs" src={blobs} />
    </section>
  );
}
