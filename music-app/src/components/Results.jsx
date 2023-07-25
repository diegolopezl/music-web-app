import React from "react";

//Component for displaying search results.
export default function Results({ track, chooseTrack, artist }) {
  function handlePlay() {
    chooseTrack(track?.uri);
    // postUri(track?.uri);
  }
  return (
    <div style={{ cursor: "pointer" }} onClick={handlePlay}>
      {track && (
        <div
          className="search-result"
          style={{ cursor: "pointer" }}
          onClick={() => handlePlay(track)}
        >
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
    </div>
  );
}

// const postUri = async (trackUri) => {
//   try {
//     const response = await fetch("http://localhost:5000/api/track", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ uri: trackUri }),
//     });

//     if (response.ok) {
//       // Request was successful
//       console.log("Data sent successfully!");
//     } else {
//       // Request failed
//       console.log("Failed to send data!");
//     }
//   } catch (error) {
//     console.error("Error sending data:", error);
//   }
// };
