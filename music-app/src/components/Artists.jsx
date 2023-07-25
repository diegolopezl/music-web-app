import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { FaUserAlt } from "react-icons/fa";
import { capitalizeFirstLetter, formatNumberWithCommas } from "../App";

const API_BASE_URL = "https://api.spotify.com/v1";
export default function Artists({
  accessToken,
  userName,
  userImage,
  typeId,
  setTrackUri,
}) {
  return (
    <section className="center">
      <Header userName={userName} userImage={userImage} />
      <div className="artist-route-content">
        <PlaceHolderArtist />
      </div>
      <Footer />
    </section>
  );
}

function PlaceHolderArtist() {
  return (
    <>
      <div className="playlist-page-top">
        <div className="playlist-cover-wrap">
          <FaUserAlt className="img-placeholder-icon" />
        </div>
        <div className="playlist-title-section">
          <h2 className="route-type">Artist</h2>
          <h1 className="type-title">Title</h1>
          <h4 className="type-info">monthly listeners</h4>
        </div>
      </div>
      <div className="artist-tracks"></div>
    </>
  );
}
