// File: src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AlbumCard from './components/AlbumCard';
import AlbumModal from './components/AlbumModal';
import './App.css';

/**
 * Main application component that fetches and displays a list of albums from the Deezer API.
 * It includes a search bar with a debounce feature and a modal for viewing album details.
 * @component
 */
function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('queen');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const searchInputRef = useRef(null);

  // States for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  /**
   * Effect hook to debounce the search term.
   * Delays updating `debouncedSearchTerm` until `searchTerm` has not changed for 500ms.
   * This prevents excessive API calls while the user is typing.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  /**
   * Effect hook to fetch albums from the Deezer API based on the debounced search term.
   * It handles loading states and potential errors.
   */
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        // Using the Vercel proxy to resolve CORS issues on deployment
        const response = await axios.get(
          `/deezer-api/search/album?q=${encodeURIComponent(
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

  /**
   * Effect hook to set focus on the search input field after data has finished loading.
   */
  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  /**
   * Handles the change event of the search input field.
   * Updates the `searchTerm` state.
   * @param {Object} event - The change event object.
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Opens the album modal and sets the selected album.
   * @param {Object} album - The album object to display in the modal.
   */
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  /**
   * Closes the album modal and clears the selected album state.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  if (loading && debouncedSearchTerm) {
    return <div className="loading">Loading albums...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="main-title">Music Player</h1>
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for albums..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </header>
      <div className="albums-grid">
        {albums.length > 0 ? (
          albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onAlbumClick={handleAlbumClick}
            />
          ))
        ) : (
          <div className="no-results">No albums found.</div>
        )}
      </div>

      {isModalOpen && selectedAlbum && (
        <AlbumModal album={selectedAlbum} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;