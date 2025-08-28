// File: src/components/AlbumModal.jsx
import React, { useState } from 'react';
import './AlbumModal.css';

// SVG Icons to replace the react-icons/fa dependency
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);
const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg>
);
const PrevIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
);
const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

/**
 * A modal component that displays detailed information about a selected album,
 * including its cover and basic playback controls.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.album - The album data object to display.
 * @param {string} props.album.cover_big - The URL for the album's large cover image.
 * @param {string} props.album.title - The title of the album.
 * @param {Object} props.album.artist - The artist object.
 * @param {string} props.album.artist.name - The name of the artist.
 * @param {function(): void} props.onClose - The function to call to close the modal.
 */
function AlbumModal({ album, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!album) return null;

  /**
   * Handles image load errors, replacing the image with a larger placeholder.
   * @param {Object} e - The event object from the `onError` handler.
   */
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/500x500/cccccc/333333?text=No+Image';
  };

  /**
   * Toggles the playback state.
   */
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  /**
   * Stops playback.
   */
  const handleStop = () => {
    setIsPlaying(false);
  };

  /**
   * Placeholder function for navigating to the previous track.
   */
  const handlePrev = () => {
    console.log("Previous track");
  };

  /**
   * Placeholder function for navigating to the next track.
   */
  const handleNext = () => {
    console.log("Next track");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <CloseIcon />
        </button>
        <img
          src={album.cover_big}
          alt={album.title}
          className="modal-album-cover"
          onError={handleImageError}
        />
        <h2 className="modal-album-title">{album.title}</h2>
        <p className="modal-album-artist">{album.artist.name}</p>

        <div className="modal-controls">
          <button className="modal-control-button" onClick={handlePrev}>
            <PrevIcon />
          </button>
          <button className="modal-control-button play-pause" onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="modal-control-button" onClick={handleStop}>
            <StopIcon />
          </button>
          <button className="modal-control-button" onClick={handleNext}>
            <NextIcon />
          </button>
        </div>
      </div>
    </div>
  );
}