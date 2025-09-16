import React from 'react';
import { Link } from 'react-router-dom';
import './GenresPage.scss';

interface GenreImage {
    [key: string]: string;
}

const genreImages: GenreImage = {
    "action": "/image/action.jpg",
    "adventure": "/image/adventure.jpg",
    "animation": "/image/animation.jpg",
    "comedy": "/image/comedy.jpg",
    "crime": "/image/crime.jpeg",
    "documentary": "/image/documentary.jpg",
    "drama": "/image/drama.jpg",
    "family": "/image/family.jpeg",
    "fantasy": "/image/fantasy.jpg",
    "history": "/image/history.jpg",
    "horror": "/image/horror.jpg",
    "music": "/image/music.jpg",
    "mystery": "/image/mystery.jpg",
    "romance": "/image/romance.jpg",
    "skifi": "/image/skifi.jpg",
    "stand-up": "/image/stand-up.jpg",
    "thriller": "/image/thriller.jpg",
    "tv-movie": "/image/tv-movie.jpg",
    "war": "/image/war.jpg",
    "western": "/image/western.jpg",
};

const GenresPage: React.FC = () => {
    const genres = Object.keys(genreImages);

    return (
        <div className="genres-page">
            <div className="container">
                <h1 className="genres-page__title">Жанры фильмов</h1>
                <div className="genres-page__list">
                    {genres.map((genre, index) => (
                        <Link key={index} to={`/genre/${genre}`} className="genres-page__item">
                            <img src={genreImages[genre]} alt={genre} className="genres-page__item__image" />
                            <span className="genres-page__item__name">{genre}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GenresPage;