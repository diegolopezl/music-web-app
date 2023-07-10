//Dependencias y librerias
const express = require("express");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.post("/auth/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  spotifyApi.setRefreshToken(refreshToken);
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body["access_token"],
        expiresIn: data.body["expires_in"],
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

//Autenticacion del token del login
app.post("/auth/login", (req, res) => {
  const code = req.body.code;
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body["access_token"],
        refreshToken: data.body["refresh"],
        expiresIn: data.body["expires_in"],
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.get("/auth/clientID", (req, res) => {
  res.json({ clientId: process.env.CLIENT_ID });
});

app.post("/api/track", (req,res) =>
{
  const data = req.body;
  console.log(data);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
