import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryClient, addToFavorites, removeFromFavorites, getFavoriteMovies } from "../../api/apiClient";
import { MainSectionProps } from "../../types/types";
import { LoginForm } from '../../auth/LoginForm/LoginForm';
import { useMutation, useQuery, } from '@tanstack/react-query';
import './MainSection.scss';

const MainSection: React.FC<MainSectionProps> = ({
  movie,
  onOpenTrailer,
  onAddToFavorites,
  onOpenMoviePage,
  isFavorite: propIsFavorite,
  onUpdateMovie,
  onRemove,
  currentUser,
  onOpenAuthModal
}) => {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(propIsFavorite);

  const id = String(movie.id);

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoriteMovies,
  });

  useEffect(() => {
    if (favorites) {
      const favoriteIds = favorites.map((f: { id: string }) => String(f.id));
      setIsFavorite(favoriteIds.includes(id));
    }
  }, [favorites, id]);

  const addToFavoritesMutation = useMutation({
    mutationFn: (movieId: string) => addToFavorites(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      setIsFavorite(true);
      if (onAddToFavorites) {
        onAddToFavorites(id);
      }
    },
    onError: (error) => {
      console.error('Ошибка при добавлении в избранное:', error);
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: (movieId: string) => removeFromFavorites(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      setIsFavorite(false);
    },
    onError: (error) => {
      console.error('Ошибка при удалении из избранных:', error);
    },
  });

  const handleAddToFavoritesClick = () => {
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (isFavorite) {
      removeFromFavoritesMutation.mutate(id);
    } else {
      addToFavoritesMutation.mutate(id);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleCloseModal = () => {
    setShowLogin(false);
  };

  const handleAboutClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const formatRuntime = (runtime: number): string => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours} ч ${minutes} мин`;
  };

  return (
    <>
      {showLogin && (
        <div className="login-modal-backdrop">
          <div className="login-modal">
            <LoginForm
              onSubmit={() => {
                handleLoginSuccess();
              }}
              onToggleAuthType={() => { }}
              isLoading={false}
            />
            <button onClick={handleCloseModal}>Закрыть</button>
          </div>
        </div>
      )}
      <div className="container">
        <div className="main-section">
          <div className="main-section__left">
            <div className="main__wrapper">
              <div className="main__rating">
                {movie.tmdbRating && (
                  <div className="main__rating-icon">
                    <img src="/icons/Vector.svg" alt="Рейтинг" />
                    <span className="main__rating-number">{movie.tmdbRating}</span>
                  </div>
                )}
                {movie.relaseYear && (
                  <span className="main__rating-count">{movie.relaseYear}</span>
                )}
                {movie.genres && (
                  <span className="main__rating-name">{movie.genres.join(', ')}</span>
                )}
                {movie.runtime && (
                  <span className="main__rating-time">{formatRuntime(movie.runtime)}</span>
                )}
              </div>
              <h1 className="main__title">{movie.title}</h1>
              {movie.plot && (
                <p className="main__description">{movie.plot}</p>
              )}
              <div className="main__buttons">
                {movie.trailerUrl && (
                  <button className="main__button" onClick={() => onOpenTrailer(movie.trailerUrl)}>
                    Трейлер
                  </button>
                )}
                <div className="main__wrapper-button">
                  <button className="main-section__about-button" onClick={handleAboutClick}>О фильме</button>
                  <button className="main__button-icon" onClick={handleAddToFavoritesClick}>
                    {isFavorite ? (
                      <img src="/icons/icon-favorite-active.svg" alt="В избранном" />
                    ) : (
                      <img src="/icons/icon-favourites.svg" alt="Добавить в избранное" />
                    )}
                  </button>
                  {onUpdateMovie && (
                    <button className="main__button-icon" onClick={() => onUpdateMovie(movie.id)}>
                      <img src="/icons/icon-update.svg" alt="Обновить" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="main-section__right">
            {movie.posterUrl && (
              <img
                className="main__image"
                src={movie.posterUrl}
                alt={movie.title} />)}
          </div>
        </div>
      </div>
    </>
  )
};
export default MainSection;
