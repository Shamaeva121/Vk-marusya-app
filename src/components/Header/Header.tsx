import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchResultItem from '../../pages/SearchResultItem/SearchResultItem';
import './Header.scss';
import { User, Movie, HeaderProps } from "../../types/types";
import { getMovies } from '../../api/apiClient';

function Header({ currentUser, onOpenAuthModal }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [allMovies, setAllMovies] = useState<Movie[]>([]); 
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]); 
  const location = useLocation();

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      const data = await getMovies(); 
      setAllMovies(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке фильмов:', error);
    }
  };

  const fetchSearchResults = async (query: string) => {
    try {
      const data = await getMovies(1, 5, undefined, query);
      if (query.length === 1) {
        const filtered = data.filter((movie: any) =>
          movie.title.toLowerCase().startsWith(query.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      setSearchResults([]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleSearch = () => {
    setIsSearchActive(prev => {
      const newState = !prev;
      if (newState === false) {
        handleClearSearch();
      }
      return newState;
    });
  };

  useEffect(() => {
    const prefix = searchQuery.toLowerCase();

    if (prefix.length === 0) {
      setFilteredMovies([]);
      return;
    }

    let currentPrefix = prefix;
    let filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().startsWith(currentPrefix)
    );

    while (filtered.length === 0 && currentPrefix.length > 1) {
      currentPrefix = currentPrefix.slice(0, -1);
      filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().startsWith(currentPrefix)
      );
    }

    setFilteredMovies(filtered);
  }, [searchQuery, allMovies]);

  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        fetchSearchResults(searchQuery);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="container">
      <header className="header">
        <div className="header__logo">
          <Link className="header__logo-link" to="/" aria-label="Ссылка на главную страницу">
            <img className="header__logo-img" src="icons/logo-icon.svg" width="143" height="32" alt="Ссылка на главную страницу" />
          </Link>
        </div>
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link
                className={`header__nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                Главная
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                className={`header__nav-link ${location.pathname === '/genres' ? 'active' : ''}`}
                to="/genres"
              >
                Жанры
              </Link>
            </li>
            <li className="header__nav-item header__nav-item--search">
              <div className="header__search">
                <img className="header__nav-search-icon" src="icons/icon-search.svg" width="24" height="24" alt="Поиск" />
                <input
                  type="text"
                  placeholder="Поиск"
                  className="header__search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (searchResults.length > 0 || filteredMovies.length > 0) && (
                  <div className="header__search-results">
                    {searchResults.map(movie => (
                      <SearchResultItem key={movie.id} movie={movie} />
                    ))}
                    {filteredMovies.length > 0 &&
                      filteredMovies.map(movie => (
                        <SearchResultItem key={movie.id} movie={movie} />
                      ))}
                  </div>
                )}
              </div>
            </li>
          </ul>
        </nav>
        {currentUser ? (
          <div className="header__user-info">
            <Link to="/account">
              <span className="header__user-name">{currentUser.name || "Аккаунт"}</span>
            </Link>
          </div>
        ) : (
          <button className="header__button" onClick={onOpenAuthModal}>Войти</button>
        )}
        <div className="header__nav-icons">
          <Link
            className={`header__nav-icon-link ${location.pathname === '/genres' ? 'active' : ''}`}
            to="/genres"
          >
            <img src="/icons/icon-genre-mobile.svg" alt="Жанры" />
          </Link>
          <button className="header__nav-icon-link header__nav-icon-link--search" onClick={toggleSearch}>
            <img src="icons/icon-search-mobile.svg" alt="Поиск" />
          </button>
          {currentUser ? (
            <Link
              className={`header__nav-icon-link ${location.pathname === '/account' ? 'active' : ''}`}
              to="/account"
            >
              <img src="icons/icon-people-account.svg" alt="Профиль" />
            </Link>
          ) : (
            <Link
              className={`header__nav-icon-link ${location.pathname === '/login' ? 'active' : ''}`}
              to="/login"
              onClick={onOpenAuthModal}
            >
              <img src="" alt="Войти" />
            </Link>
          )}
        </div>
      </header>
      {isSearchActive && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-bar">
            <img className="mobile-search-bar__icon" src="icons/icon-search.svg" alt="Поиск" />
            <input
              type="text"
              placeholder="Поиск"
              className="mobile-search-bar__input"
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
            <button className="mobile-search-bar__clear" onClick={toggleSearch}>
              <img src="icons/icon-back-search-mobile.svg" alt="Закрыть" />
            </button>
          </div>
          {searchQuery && (searchResults.length > 0 || filteredMovies.length > 0) && (
            <div className="mobile-search-results">
              {searchResults.map(movie => (
                <SearchResultItem key={movie.id} movie={movie} />
              ))}
              {filteredMovies.length > 0 &&
                filteredMovies.map(movie => (
                  <SearchResultItem key={movie.id} movie={movie} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
