import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMovies } from '../../api/apiClient';
import { Movie } from '../../types/types';
import './GenreMoviesPage.scss';

function GenreMoviesPage() {
  const { genreName } = useParams<{ genreName: string }>();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedMoviesCount, setDisplayedMoviesCount] = useState(10);
  const hasMoreMovies = displayedMoviesCount < movies.length;

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      setLoading(true);
      setError(null);
      try {
        if (genreName) {
          const data = await getMovies(1, 20000, genreName);
          if (Array.isArray(data)) {
            setMovies(data);
          } else {
            setError("Не удалось загрузить фильмы для этого жанра.");
            setMovies([]);
          }
        } else {
          setError("Название жанра не указано.");
          setMovies([]);
        }
      } catch (err: any) {
        console.error(`Error fetching movies for genre ${genreName}:`, err);
        setError(err?.response?.data?.message || err.message || 'Не удалось загрузить фильмы.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [genreName]);

  const handleShowMore = () => {
    setDisplayedMoviesCount(prev => prev + 10);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="genre-movies-page__loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="genre-movies-page__error">Ошибка: {error}</div>;
  }

  const displayedMovies = movies.slice(0, displayedMoviesCount);

  return (
    <div className="genre-movies-page">
      <div className="container">
        <div className="genre-movies-page__header">
          <button className="genre-movies-page__back-button" onClick={handleGoBack}>
            <img src="/icons/icon-back.svg" alt="Back" className="genre-movies-page__back-arrow" />
          </button>
          <h1 className="genre-movies-page__title">{genreName}</h1>
        </div>
        <div className="genre-movies-page__list">
          {displayedMovies.map((movie, index) => (
            <div key={index} className="genre-movies-page__item">
              <Link to={`/movie/${movie.id}`}>
                <img src={movie.posterUrl} alt={`Movie ${index + 1}`} className="genre-movies-page__item__image" />
              </Link>
            </div>
          ))}
        </div>
        {hasMoreMovies && (
          <button className="genre-movies-page__show-more" onClick={handleShowMore}>
            Показать ещё
          </button>
        )}
      </div>
    </div>
  );
}

export default GenreMoviesPage;

