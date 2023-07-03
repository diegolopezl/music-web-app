import { useState, useEffect } from "react";
import axios from "axios";

// Custom hook for handling authentication with Spotify.
export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  // Exchanges the authorization code for access and refresh tokens
  useEffect(() => {
    axios
      .post("http://localhost:5000/auth/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        window.location = "/";
      });
  }, [code]);

  // Refreshes the access token before it expires
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    // Schedule token refresh based on expiresIn value
    const interval = setInterval(() => {
      axios
        .post("http://localhost:5000/auth/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000); // Refresh the token 1 minute before it expires

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
