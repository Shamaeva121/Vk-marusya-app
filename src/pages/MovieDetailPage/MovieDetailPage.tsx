import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../../types/types';
import './MovieDetailPage.scss';
import { MovieDetailPageProps } from "../../types/types";
import { getMovieById, queryClient } from '../../api/apiClient';

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
    isLoggedIn,
    onOpenAuthModal,
    onAddToFavorites,
    onRemoveFromFavorites,
    favoriteMovieIds,
    onOpenTrailer
}) => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    const movieIdStr = id ? id : null;

    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    const loadMovie = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!movieIdStr) {
                setError("ID фильма не указан.");
                return;
            }

            const movieData = await getMovieById(movieIdStr);

            if (movieData) {
                setMovie(movieData);
            } else {
                setError("Фильм не найден.");
                setMovie(null);
            }
        } catch (err: any) { 
            console.error("Ошибка при загрузке данных фильма:", err);
            setError(err?.response?.data?.message || err.message || 'Не удалось загрузить информацию о фильме.');
            setMovie(null);
        } finally {
            setLoading(false);
        }
    }, [movieIdStr]);

    useEffect(() => {
        loadMovie();
    }, [loadMovie]);

    useEffect(() => {
        if (movieIdStr && favoriteMovieIds) {
            setIsFavorite(favoriteMovieIds.includes(movieIdStr));
        }
    }, [movieIdStr, favoriteMovieIds]);

    const toggleFavorite = useCallback(() => {
        if (!isLoggedIn) {
            onOpenAuthModal();
            return;
        }

        if (!movieIdStr) {
            console.warn("Movie ID is null or undefined, cannot toggle favorite.");
            return;
        }

        if (isFavorite) { 
            console.log("Removing from favorites:", movieIdStr);
            onRemoveFromFavorites(movieIdStr);
            queryClient.invalidateQueries({ queryKey: ['favoriteMovieIds'] }); 
        } else {
            console.log("Adding to favorites:", movieIdStr);
            onAddToFavorites(movieIdStr);
            queryClient.invalidateQueries({ queryKey: ['favoriteMovieIds'] });
        }
    }, [isFavorite, movieIdStr, isLoggedIn, onAddToFavorites, onRemoveFromFavorites, onOpenAuthModal]);


     const handleTrailerButtonClick = useCallback(() => {
        if (movie && movie.trailerUrl) { 
            onOpenTrailer(movie.trailerUrl);
            setIsTrailerOpen(true);
        }
    }, [movie, onOpenTrailer]);

    const formatRuntime = useCallback((runtime: number): string => {
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours} ч ${minutes} мин`;
    }, []);

    if (loading) {
        return <div className="movie-detail-page__loading">Загрузка информации о фильме...</div>;
    }

    if (error) {
        return <div className="movie-detail-page__error">Ошибка: {error}</div>;
    }

    if (!movie) {
        return <div className="movie-detail-page__not-found">Фильм не найден.</div>;
    }

    return (
        <div className="movie-detail-page">
            <div className="container">
                <div className="movie-detail-page__header">
                    <div className="movie-detail-page__info">
                        <div className="movie-detail-page__top-info">
                            <div className="movie-detail-page__rating">
                                <img src="/icons/Vector.svg" alt="Рейтинг"/>
                                <span>{movie.tmdbRating}</span>
                            </div>
                            <div className="movie-detail-page__year-genre-duration">
                                <span>{movie.relaseYear}</span>
                                <span>{movie.genres?.join(', ')}</span>
                                <span>{formatRuntime(movie.runtime)}</span>
                            </div>
                        </div>
                        <h1 className="movie-detail-page__title">{movie.title}</h1>
                        <p className="movie-detail-page__description">{movie.plot}</p>
                        <div className="movie-detail-page__buttons">
                            <button className="movie-detail-page__trailer-button"
                                    onClick={handleTrailerButtonClick}>Трейлер
                            </button>
                            <button className="movie-detail-page__button-favourites-icon"
                                    onClick={toggleFavorite}>
                                <img src={isFavorite ? '/icons/icon-favorite-active.svg' : '/icons/icon-favourites.svg'}
                                     alt="В избранное"/>
                            </button>
                        </div>
                    </div>
                    <div className="movie-detail-page__image-section">
                        {movie.posterUrl && (
                            <img src={movie.posterUrl} alt={movie.title} className="movie-detail-page__image"/>
                        )}
                    </div>
                </div>
                <div className="movie-detail-page__about-section">
                    <h2 className="movie-detail-page__about-title">О фильме</h2>

                    <div className="movie-detail-page__about-row">
                        <span className="movie-detail-page__about-label">Язык оригинала</span>
                        <span className="movie-detail-page__about-dots">
                            <img src="/icons/Vector-1.svg" alt="..."/>
                        </span>
                        <span className="movie-detail-page__about-value">{movie.languages}</span>
                    </div>

                    <div className="movie-detail-page__about-row">
                        <span className="movie-detail-page__about-label">Бюджет</span>
                        <span className="movie-detail-page__about-dots">
                            <img src="/icons/Vector-2.svg" alt="..."/>
                        </span>
                        <span className="movie-detail-page__about-value">{movie.budget}</span>
                    </div>

                    <div className="movie-detail-page__about-row">
                        <span className="movie-detail-page__about-label">Выручка</span>
                        <span className="movie-detail-page__about-dots">
                            <img src="/icons/Vector-3.svg" alt="..."/>
                        </span>
                        <span className="movie-detail-page__about-value">{movie.revenue}</span>
                    </div>

                    <div className="movie-detail-page__about-row">
                        <span className="movie-detail-page__about-label">Режиссер</span>
                        <span className="movie-detail-page__about-dots">
                            <img src="/icons/Vector-4.svg" alt="..."/>
                        </span>
                        <span className="movie-detail-page__about-value">{movie.director}</span>
                    </div>

                    <div className="movie-detail-page__about-row">
                        <span className="movie-detail-page__about-label">Продакшен</span>
                        <span className="movie-detail-page__about-dots">
                            <img src="/icons/Vector-5.svg" alt="..."/>
                        </span>
                        <span className="movie-detail-page__about-value">{movie.director}</span> 
                    </div>

                    <div className="movie-detail-page__about-row">
                        <span className="movie-detail-page__about-label">Награды</span>
                        <span className="movie-detail-page__about-dots">
                            <img src="/icons/Vector-6.svg" alt="..."/>
                        </span>
                        <span className="movie-detail-page__about-value">{movie.awardsSummary}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;