import React, { useState, useEffect, useCallback } from 'react';
import MainSection from '../../components/MainSection/MainSection';
import BlockMovies from '../../components/BlockMovies/BlockMovies';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import { getMovies, getFavoriteMovies } from '../../api/apiClient';
import { Movie } from '../../types/types'; 

const HomePage: React.FC<any> = ({ 
  onAddToFavorites,
  onOpenAuthModal,
  onOpenMoviePage,
  onRemove,
  onOpenTrailer,
  currentUser,
  favoriteMovieIds,
  onFavoriteToggle,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [currentMainMovie, setCurrentMainMovie] = useState<Movie | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false); 
  const [currentTrailer, setCurrentTrailer] = useState<{ movieId: number; url: string; title: string } | null>(null);

  const handleFavoriteToggle = async (movieId: string, isCurrentFavorite: boolean) => {
    const movieIdStr = String(movieId);

    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    try {
      if (!isCurrentFavorite) {
        await onAddToFavorites(movieIdStr);
      } else {
        await onRemove(movieIdStr);
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса избранного:', error);
    }
  };

  const handleOpenTrailer = useCallback((movie: Movie) => {
    if (movie.trailerUrl) {
      setCurrentTrailer({ movieId: movie.id, url: movie.trailerUrl, title: movie.title });
      setIsTrailerModalOpen(true); 
    }
  }, []);

  const handleCloseTrailer = () => {
    setIsTrailerModalOpen(false); 
    setCurrentTrailer(null);
  };

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const moviesData = await getMovies(1, 10);
      if (moviesData && moviesData.length > 0) {
        setTopMovies(moviesData);
        const randomIndex = Math.floor(Math.random() * moviesData.length);
        setCurrentMainMovie(moviesData[randomIndex]);
      } else {
        setError('Нет доступных фильмов.');
        setTopMovies([]);
        setCurrentMainMovie(null);
      }
    } catch (err: any) {
      console.error('Ошибка при загрузке фильмов:', err);
      setError(err?.response?.data?.message || err.message || 'Ошибка при загрузке фильмов.');
      setTopMovies([]);
      setCurrentMainMovie(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const isMainMovieFavorite = currentMainMovie
    ? favoriteMovieIds.includes(currentMainMovie.id.toString())
    : false;

  const trailerYoutubeId = currentTrailer?.url;

  return (
    <div className="home-page">
      {currentMainMovie ? (
        <MainSection
          movie={currentMainMovie}
          onOpenTrailer={onOpenTrailer}
          onAddToFavorites={(id: string) => handleFavoriteToggle(id, isMainMovieFavorite)}
          onRemove={onRemove}
          onOpenMoviePage={onOpenMoviePage}
          isFavorite={isMainMovieFavorite}
          onUpdateMovie={loadMovies}
          currentUser={currentUser}         
          onOpenAuthModal={onOpenAuthModal}
        />
      ) : null}

      <BlockMovies
        movies={topMovies}
        onOpenTrailer={onOpenTrailer}
        onOpenMoviePage={onOpenMoviePage}
        onRemove={onRemove}
        isFavoritesList={false}
        favoriteMovieIds={favoriteMovieIds}
        onFavoriteToggle={handleFavoriteToggle}
      />

      <TrailerModal
        isOpen={isTrailerModalOpen}
        onRequestClose={handleCloseTrailer}
        trailerYoutubeId={trailerYoutubeId}
      />
    </div>
  );
};

export default HomePage;