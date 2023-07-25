import { truncateString } from "./Results";
import { BsPlayCircleFill } from "react-icons/bs";
import { FaItunesNote, FaUserAlt } from "react-icons/fa";
import { BiSolidPlaylist } from "react-icons/bi";
import { IoDiscSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

export function TrackCards({ track, chooseTrack, addToQueue }) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const truncatedArtistNames = truncateString(artistNames, 30);

  function handlePlay() {
    chooseTrack(track?.uri);
  }

  // function handleAddToQueue() {
  //   addToQueue(track?.uri);
  // }

  return (
    <div className="card" style={{ cursor: "pointer" }}>
      {track.album.images[0] ? (
        <img
          className="cover-img"
          src={track.album.images[0]?.url}
          alt={track.name}
        />
      ) : (
        <div className="img-placeholder">
          <FaItunesNote className="img-placeholder-icon" />
        </div>
      )}
      {/* <div
        className="add-to-queue-button"
        onClick={handleAddToQueue}
        style={{
          backgroundColor: "black",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Add to Queue
      </div> */}
      <CardPlayButton handleClick={handlePlay} />
      <p className="card-title">{truncateString(track.name, 16)}</p>
      <p className="card-text">{truncatedArtistNames}</p>
    </div>
  );
}

export function PlaylistCards({
  image,
  title,
  description,
  id,
  type,
  setTypeId,
  setType,
}) {
  const truncatedDescription = truncateString(description, 35);

  function handleClick() {
    setTypeId(id);
    setType(type);
  }
  return (
    <Link className="card" to={`/${type}/${id}`} onClick={handleClick}>
      {image ? (
        <img className="cover-img" src={image} alt={title} />
      ) : (
        <div className="img-placeholder">
          <BiSolidPlaylist className="img-placeholder-icon" />
        </div>
      )}
      <CardPlayButton />
      <p className="card-title">{truncateString(title, 14)}</p>
      <p className="card-text">{truncatedDescription}</p>
    </Link>
  );
}

export function AlbumCards({
  id,
  type,
  image,
  title,
  year,
  artist,
  setTypeId,
  setType,
}) {
  // function handlePlay(){
  //   chooseTrack(artist);
  // }

  function handleClick() {
    setTypeId(id);
    setType(type);
  }
  return (
    <Link className="card" to={`/${type}/${id}`} onClick={handleClick}>
      {image ? (
        <img className="cover-img" src={image} alt={title} />
      ) : (
        <div className="img-placeholder">
          <IoDiscSharp className="img-placeholder-icon" />
        </div>
      )}
      <CardPlayButton />
      <p className="card-title">{truncateString(title, 14)}</p>
      <p className="card-text">
        {year} • {artist}
      </p>
    </Link>
  );
}

export function ArtistCards({ artist, setTypeId, setType }) {
  // function handlePlay(){
  //   chooseTrack(artist);
  // }

  function handleClick() {
    setTypeId(artist.id);
    setType(artist.type);
  }
  return (
    <Link
      className="card"
      to={`/${artist.type}/${artist.id}`}
      onClick={handleClick}
    >
      {artist.images[0] ? (
        <img
          className="cover-img artist-img"
          src={artist.images[0]?.url}
          alt={artist.name}
        />
      ) : (
        <div className="img-placeholder" style={{ borderRadius: "100%" }}>
          <FaUserAlt className="img-placeholder-icon" />
        </div>
      )}
      <CardPlayButton />
      <p className="card-title">{truncateString(artist.name, 16)}</p>
      <p className="card-text">Artist</p>
    </Link>
  );
}

export function CardPlayButton({ handleClick }) {
  return <BsPlayCircleFill className="play-btn" onClick={handleClick} />;
}
