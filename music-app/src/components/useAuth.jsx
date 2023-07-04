import { useState, useEffect } from "react";
import axios from "axios";

//Access Token Item
const ACCESS_TOKEN = "spotifyAccessToken";
// Custom hook for handling authentication with Spotify.
export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(ACCESS_TOKEN) || null
  );
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Exchanges the authorization code for access and refresh tokens
  useEffect(() => {
    if (!code) return;

    axios
      .post("http://localhost:5000/auth/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
        window.history.pushState({}, null, "/");
      })
      .catch((err) => {
        window.location = "/";
      });
  }, [code]);

  // Refreshes the access token before it expires
  useEffect(() => {
    if (!refreshToken || !expiresIn || isRefreshing) return;

    const refreshAccessToken = async () => {
      try {
        setIsRefreshing(true);
        const res = await axios.post("http://localhost:5000/auth/refresh", {
          refreshToken,
        });
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);
        setIsRefreshing(false);
        localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
      } catch (err) {
        window.location = "/";
      }
    };

    const tokenExpirationTime = expiresIn - 60;
    const interval = setInterval(
      refreshAccessToken,
      tokenExpirationTime * 1000
    );

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn, isRefreshing]);

  // Clear the access token from localStorage on logout
  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem(ACCESS_TOKEN);
  };

  return { accessToken, logout };
}
