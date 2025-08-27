// File: src/components/AlbumCard.jsx
import React from 'react';
import './AlbumCard.css';

/**
 * A card component that displays a single album with its cover and title.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.album - The album data object.
 * @param {string} props.album.cover_medium - The URL for the album's medium-sized cover image.
 * @param {string} props.album.title - The title of the album.
 * @param {Object} props.album.artist - The artist object.
 * @param {string} props.album.artist.name - The name of the artist.
 * @param {function(Object): void} props.onAlbumClick - The function to call when the card is clicked.
 */
function AlbumCard({ album, onAlbumClick }) {
  const imageUrl = album.cover_medium || 'https://placehold.co/250x250/cccccc/333333?text=No+Image';

  /**
   * Handles image load errors, replacing the image with a placeholder.
   * @param {Object} e - The event object from the `onError` handler.
   */
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