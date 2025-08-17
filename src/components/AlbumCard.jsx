import React from 'react';
import './AlbumCard.css';

function AlbumCard({ album, onAlbumClick }) {
  const imageUrl = album.cover_medium || 'https://placehold.co/250x250/cccccc/333333?text=No+Image';

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/250x250/cccccc/333333?text=No+Image';
  };

  return (
    <div className="album-card" onClick={() => onAlbumClick(album)}>
      <img
        src={imageUrl}
        alt={album.title}
        className="album-cover"
        onError={handleImageError}
      />
      <h3 className="album-title">{album.title}</h3>
      <p className="album-artist">{album.artist.name}</p>
    </div>
  );
}

export default AlbumCard;