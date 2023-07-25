import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { IoDiscSharp } from "react-icons/io5";

export default function Albums({ accessToken, userName, userImage, typeId }) {
  return (
    <section className="center">
      <Header userName={userName} userImage={userImage} />
      <div className="album-route-content">
        <div className="playlist-page-top">
          <div className="playlist-cover-wrap">
            <IoDiscSharp className="img-placeholder-icon" />
            {/* <img className="playlist-cover" src={playlistData.images[0].url} /> */}
          </div>
          <div className="playlist-title-section">
            <h2 className="route-type">Album</h2>
            <h1 className="type-title">Title</h1>
            <h4 className="type-info">Artist • Year • 0 songs</h4>
          </div>
        </div>
        <div className="album-tracks"></div>
      </div>
      <Footer />
    </section>
  );
}
