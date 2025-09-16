import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BlockMovies.scss';
import { Movie, BlockMoviesProps } from "../../types/types";

const BlockMovies: React.FC<BlockMoviesProps> = ({ movies, onOpenMoviePage, onOpenTrailer, onRemove, isFavoritesList }) => {
  const navigate = useNavigate();

  const numberSvgPaths = [
    'icons/one.svg', 'icons/two.svg', 'icons/three.svg', 'icons/four.svg', 'icons/five.svg',
    'icons/six.svg', 'icons/seven.svg', 'icons/eight.svg', 'icons/nine.svg', 'icons/ten.svg',
  ];

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>, movieId: string) => {
    e.stopPropagation();
    onRemove?.(String(movieId));
  };

  return (
    <div className="container">
      {!isFavoritesList && (
        <h2 className="block-movies__title">Топ 10 фильмов</h2>
      )}

      <div className="block-movies__wrapper">
        <div className="block-movies__list">
          {(isFavoritesList ? movies : movies.slice(0, 10)).map((movie, index) => (
            <div
              key={movie.id}
              className="block-movies__item"
              style={{ cursor: 'pointer' }}
              onClick={() => handleMovieClick(movie.id)}
            >
              <img
                className="block-movies__image"
                src={movie.posterUrl}
                width="224"
                height="336"
                alt={`Постер фильма ${movie.title}`}
              />
              {!isFavoritesList && (
                <img
                  className="block-movies__number-image"
                  src={numberSvgPaths[index < numberSvgPaths.length ? index : 0]}
                  width="14"
                  height="32"
                  aria-hidden="true"
                  alt={`${index + 1}`}
                />
              )}

              {isFavoritesList && (
                 <button className="remove-button" onClick={(e) => handleRemoveClick(e, String(movie.id))}>
                  <img src="/icons/icon-back-modal.svg" alt="Удалить" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockMovies;