import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FaUserAlt } from "react-icons/fa";

export default function Artists({ accessToken, userName, userImage, typeId }) {
  return (
    <section className="center">
      <Header userName={userName} userImage={userImage} />
      <div className="artist-route-content">
        <div className="playlist-page-top">
          <div className="playlist-cover-wrap">
            <FaUserAlt className="img-placeholder-icon" />
            {/* <img className="playlist-cover" src={playlistData.images[0].url} /> */}
          </div>
          <div className="playlist-title-section">
            <h2 className="route-type">Artist</h2>
            <h1 className="type-title">Title</h1>
            <h4 className="type-info">Owner • 0 follows • 0 songs</h4>
          </div>
        </div>
        <div className="artist-tracks"></div>
      </div>
      <Footer />
    </section>
  );
}
