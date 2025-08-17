import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AlbumCard from './components/AlbumCard';
import AlbumModal from './components/AlbumModal';
import './App.css';

function App() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('queen');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const searchInputRef = useRef(null);

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Efecto para implementar el debounce en el término de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms de retraso

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Efecto para cargar álbumes basado en el término de búsqueda con debounce
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        // Usar la URL completa de la API de Deezer para evitar errores de URL inválida
        const response = await axios.get(
        `/deezer-api/search/album?q=${encodeURIComponent(
          debouncedSearchTerm
        )}`
      );
        // Limita los álbumes a un máximo de 20
        setAlbums(response.data.data.slice(0, 20));
      } catch (err) {
        console.error("Error fetching data from Deezer API:", err);
        setError("No se pudieron cargar los álbumes. Intenta de nuevo más tarde.");
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

  // Efecto para enfocar el input después de que la carga haya terminado
  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Función para abrir el modal
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  if (loading && debouncedSearchTerm) {
    return <div className="loading">Cargando álbumes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="main-title">Reproductor Musical</h1>
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar álbumes..."
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
          <div className="no-results">No se encontraron álbumes.</div>
        )}
      </div>

      {isModalOpen && selectedAlbum && (
        <AlbumModal album={selectedAlbum} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;