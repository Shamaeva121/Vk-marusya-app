import { Link } from 'react-router-dom';
import './SearchResultItem.scss';
import { Movie, SearchResultItemProps } from "../../types/types";

function SearchResultItem({ movie }: SearchResultItemProps) {
  let ratingClass = '';
  if (movie.tmdbRating >= 8) {
    ratingClass = 'search-result-item__rating--high'; 
  } else if (movie.tmdbRating >= 7) {
    ratingClass = 'search-result-item__rating--medium'; 
  } else {
    ratingClass = 'search-result-item__rating--low'; 
  }

  const genresText = Array.isArray(movie.genres)
    ? movie.genres.join(', ')
    : movie.genres;

     const formatRuntime = (runtime: number): string => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours} ч ${minutes} мин`;
  };

  return (
    <Link to={`/movie/${movie.id}`} className="search-result-item">
      <div className="search-result-item">
        <img
          className="search-result-item__image"
          src={movie.posterUrl}
          alt={movie.title}
        />
        <div className="search-result-item__info">
          <div className="search-result-item__top-info">
            <div className={`search-result-item__rating ${ratingClass}`}>
              <img className="search-result-item__star-icon" src="/icons/Vector.svg" width="16" height="16" alt="Рейтинг" />
              <span>{movie.tmdbRating}</span>
            </div>
            <div className="search-result-item__details">
              <span>{movie.relaseYear}</span>
              <span>{genresText}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          </div>
          <div className="search-result-item__title">{movie.title}</div>
        </div>
      </div>
    </Link>
  );
}

export default SearchResultItem;