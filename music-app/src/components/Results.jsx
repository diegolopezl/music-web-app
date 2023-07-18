import React from "react";

//Component for displaying search results.
export default function Results({ track, artist }) {
  return (
    <div>
      {track && (
        <div className="search-result">
          <img
            className="result-img"
            src={track.album.images[0].url}
            alt="Track Album"
          />
          <div>
            <h4>{truncateString(track.name, 30)}</h4>
            <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
          </div>
        </div>
      )}

      {artist && artist.images && artist.images.length > 0 && (
        <div className="search-result">
          <img className="result-img" src={artist.images[0].url} alt="Artist" />
          <div>
            <h4>{artist.name}</h4>
          </div>
        </div>
      )}
    </div>
  );
}

export function truncateString(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}
