import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * AlbumCard Component
 * A card component that displays a single album with its cover and title.
 * @param {Object} props - The component props.
 * @param {Object} props.album - The album data.
 * @param {Function} props.onAlbumClick - The function to call when the card is clicked.
 */
const AlbumCard = ({ album, onAlbumClick }) => {
  return (
    <div
      onClick={() => onAlbumClick(album)}
      className="transform cursor-pointer rounded-lg bg-white p-4 shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
    >
      <img
        src={album.cover_medium}
        alt={album.title}
        className="mb-4 h-auto w-full rounded-lg object-cover shadow-md"
      />
      <div className="text-center">
        <h3 className="truncate text-lg font-bold text-gray-800">
          {album.title}
        </h3>
        <p className="truncate text-sm text-gray-600">{album.artist.name}</p>
      </div>
    </div>
  );
};

/**
 * AlbumModal Component
 * A modal component that displays detailed information about a selected album,
 * including its cover and basic playback controls.
 * @param {Object} props - The component props.
 * @param {Object} props.album - The album data.
 * @param {Function} props.onClose - The function to close the modal.
 */
const AlbumModal = ({ album, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // SVG Icons
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  );
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
  // ... other SVG icons like PrevIcon, NextIcon, StopIcon can be defined here ...

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl md:mx-0">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-colors duration-300 hover:bg-gray-200 hover:text-gray-900"
        >
          <CloseIcon />
        </button>
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
          <img
            src={album.cover_xl}
            alt={album.title}
            className="mb-4 h-48 w-48 rounded-lg object-cover shadow-lg md:mb-0 md:mr-6"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {album.title}
            </h2>
            <p className="text-lg text-gray-600">by {album.artist.name}</p>
            <p className="mt-2 text-sm text-gray-500">
              Release Date: {album.release_date}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Number of Tracks: {album.nb_tracks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main application component that fetches and displays a list of albums from the Deezer API.
 * @component
 */
function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('queen');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const searchInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.deezer.com/search/album?q=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        );
        setAlbums(response.data.data.slice(0, 20));
        setError(null);
      } catch (err) {
        console.error("Error fetching data from Deezer API:", err);
        setError("Could not load albums. Please try again later.");
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };
    if (debouncedSearchTerm) {
      fetchAlbums();
    } else {
      setAlbums([]);
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  if (loading && debouncedSearchTerm) {
    return <div className="flex h-64 items-center justify-center text-xl text-gray-500">Loading albums...</div>;
  }
  if (error) {
    return <div className="flex h-64 items-center justify-center text-xl text-red-500">{error}</div>;
  }
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 font-sans text-gray-900">
      <header className="w-full bg-white p-6 shadow-md md:p-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">Music Player</h1>
          <div className="relative w-full md:w-1/2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for albums..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-full border border-gray-300 bg-gray-50 px-6 py-3 pl-12 text-gray-800 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>
      <main className="w-full flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          {!loading && albums.length > 0 && (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} onAlbumClick={handleAlbumClick} />
              ))}
            </div>
          )}
          {!loading && albums.length === 0 && debouncedSearchTerm && (
            <div className="flex h-64 items-center justify-center text-xl text-gray-500">No albums found.</div>
          )}
        </div>
      </main>
      {isModalOpen && selectedAlbum && <AlbumModal album={selectedAlbum} onClose={closeModal} />}
    </div>
  );
}

export default App;
