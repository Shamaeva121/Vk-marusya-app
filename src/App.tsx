// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import GenresPage from './pages/GenresPage/GenresPage';
import GenreMoviesPage from './pages/GenreMoviesPage/GenreMoviesPage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import AccountPage from './components/Account/AccountPage';
import AuthModal from './auth/AuthModal/AuthModal';
import Footer from './components/Footer/Footer';
import { fetchProfile, logoutUser, getFavoriteMovies, addToFavorites, removeFromFavorites } from './api/apiClient';
import TrailerModal from './components/TrailerModal/TrailerModal';
import './App.css';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState<string[]>([]);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedMovieTrailer, setSelectedMovieTrailer] = useState<string | undefined>(undefined);

  const handleOpenAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const handleCloseAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const fetchUserAndFavorites = useCallback(async () => {
    try {
      const user = await fetchProfile();
      setCurrentUser(user);
      if (user) {
        try {
          const data = await getFavoriteMovies();
          setFavoriteMovieIds(Array.isArray(data?.favorites) ? data.favorites.map(String) : []);
        } catch {
          setFavoriteMovieIds([]);
        }
      } else {
        setFavoriteMovieIds([]);
      }
    } catch {
      setCurrentUser(null);
      setFavoriteMovieIds([]);
    }
  }, []);

  useEffect(() => {
    fetchUserAndFavorites();
  }, [fetchUserAndFavorites]);

  const handleAuthSuccess = async (user: any) => {
    setCurrentUser(user);
    handleCloseAuthModal();
    fetchUserAndFavorites();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setFavoriteMovieIds([]);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const handleAddToFavorites = async (id: string) => {
    const idStr = String(id);
    if (!currentUser) {
      handleOpenAuthModal();
      return;
    }

    try {
      const isAlreadyFavorite = favoriteMovieIds.includes(idStr);
      if (!isAlreadyFavorite) {
        await addToFavorites(idStr);
        setFavoriteMovieIds(prev => [...prev, idStr]);
      }
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
    }
  };

  const handleRemoveFromFavorites = async (id: string) => {
    const idStr = String(id);
    if (!currentUser) {
      console.warn("Пользователь не авторизован, нельзя удалить из избранного.");
      return;
    }

    try {
      const result = await removeFromFavorites(idStr);
      if (result && result.result) {
        setFavoriteMovieIds(prev => prev.filter(favId => favId !== idStr));
      } else {
        console.error('Не удалось удалить из избранных:', result?.message || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка при удалении из избранных:', error);
    }
  };

  const extractYoutubeId = (src?: string): string | undefined => {
    if (!src) return undefined;
    const match = src.match(/[?&]v=([^&]+)/);
    return match ? match[1] : undefined;
  };

  const handleOpenTrailer = (trailerUrl?: string) => {
    const trailerId = extractYoutubeId(trailerUrl);
    setSelectedMovieTrailer(trailerId);
    setIsTrailerModalOpen(true);
  };

  const handleCloseTrailer = () => {
    setIsTrailerModalOpen(false);
    setSelectedMovieTrailer(undefined);
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onAddToFavorites={handleAddToFavorites}
              onOpenAuthModal={handleOpenAuthModal}
              onOpenMoviePage={() => {}} // Заглушка
              onRemove={handleRemoveFromFavorites}
              onOpenTrailer={handleOpenTrailer}
              currentUser={currentUser}
              favoriteMovieIds={favoriteMovieIds}
              onFavoriteToggle={(id: string, isFavorite: boolean) => {
                if (isFavorite) {
                  handleRemoveFromFavorites(id);
                } else {
                  handleAddToFavorites(id);
                }
              }}
            />
          }
        />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/genre/:genreName" element={<GenreMoviesPage />} />
        <Route
          path="/movie/:id"
          element={
            <MovieDetailPage
              isLoggedIn={!!currentUser}
              onOpenAuthModal={handleOpenAuthModal}
              onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
              favoriteMovieIds={favoriteMovieIds}
              onOpenTrailer={handleOpenTrailer}
            />
          }
        />
        <Route
          path="/account"
          element={
            currentUser ? (
              <AccountPage
                user={currentUser}
                movies={[]}
                onRemove={handleRemoveFromFavorites}
                onLogout={handleLogout}
                onOpenTrailer={handleOpenTrailer}
                onOpenMoviePage={() => {}}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />

      <TrailerModal
        isOpen={isTrailerModalOpen}
        onRequestClose={handleCloseTrailer}
        trailerYoutubeId={selectedMovieTrailer}
      />
    </>
  );
};

export default App;



