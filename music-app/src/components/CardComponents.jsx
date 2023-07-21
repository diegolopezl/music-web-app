import { truncateString } from "./Results";

export function TrackCards({ track }) {
  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const truncatedArtistNames = truncateString(artistNames, 30);
  return (
    <div className="card">
      <img
        className="cover-img"
        src={track.album.images[0].url}
        alt={track.name}
      />
      <p className="card-title">{truncateString(track.name, 16)}</p>
      <p className="card-text">{truncatedArtistNames}</p>
    </div>
  );
}

export function PlaylistCards({ image, title, description }) {
  const truncatedDescription = truncateString(description, 35);
  return (
    <div className="card">
      <img className="cover-img" src={image} alt={title} />
      <p className="card-title">{truncateString(title, 14)}</p>
      <p className="card-text">{truncatedDescription}</p>
    </div>
  );
}

export function ArtistCards({ artist }) {
  return (
    <div className="card">
      <img
        className="artist-img"
        src={artist.images[0].url}
        alt={artist.name}
      />
      <p className="card-title">{truncateString(artist.name, 16)}</p>
      <p className="card-text">Artist</p>
    </div>
  );
}
