import React, { useState, useEffect } from 'react';
import BlockMovies from '../BlockMovies/BlockMovies';
import { User, AccountPageProps, Movie, Tab } from "../../types/types";
import { getFavoriteMovies, addToFavorites, removeFromFavorites } from '../../api/apiClient';
import './AccountPage.scss';

const HeartIcon = () => (
  <img src="/icons/icon-favourites.svg" alt="Избранные фильмы" />
);

const SettingsIcon = () => (
  <img src="/icons/icon-people-account.svg" alt="Настройки" />
);

const MailIcon = () => (
  <img src="/icons/icon-mail-account.svg" alt="Почта" className="user-info__icon-mail" />
);

const AccountPage: React.FC<AccountPageProps> = ({ user, onLogout, onRemove, onOpenTrailer, onOpenMoviePage }) => {
  const [activeTab, setActiveTab] = useState<string>("favorites");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); 

  const tabs: Tab[] = [
    { id: "favorites", label: "Избранное", icon: <HeartIcon />, shortLabel: "Избранные фильмы" },
    { id: "settings", label: "Настройки", icon: <SettingsIcon />, shortLabel: "Настройка аккаунта" },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const loadFavorites = async () => {
    console.log('Вызов функции loadFavorites');
    try {
      const data = await getFavoriteMovies();
      console.log('Данные из API:', data);
      if (data && Array.isArray(data)) {
        console.log('Массив favorites:', data);
        setMovies(data);
        setFavoriteIds(data.map(movie => String(movie.id))); 
      } else {
        console.warn('Структура данных некорректна или favorites отсутствует:', data);
        setMovies([]);
        setFavoriteIds([]);
      }
    } catch (err) {
      console.error('Ошибка загрузки избранных:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'favorites') {
      loadFavorites();
    }
  }, [activeTab]);

  const handleRemoveFavorite = async (movieId: string) => {
    await removeFromFavorites(movieId);
    await loadFavorites();
  };

  const handleFavoriteToggle = async (movieId: string) => {
    const isFav = favoriteIds.includes(movieId);
    if (isFav) {
      await removeFromFavorites(movieId);
    } else {
      await addToFavorites(movieId);
    }
    const data = await getFavoriteMovies();
    if (Array.isArray(data)) {
      setFavoriteIds(data.map(movie => String(movie.id)));
    } else {
      setFavoriteIds([]);
    }
  };

  const renderTabContent = () => {
    console.log('Рендеринг контента, movies:', movies);
    switch (activeTab) {
      case "favorites":
        return (
          <div className="account-page__favorites">
            {movies && movies.length > 0 ? (
              <BlockMovies
                movies={movies}
                onRemove={handleRemoveFavorite}
                onOpenTrailer={onOpenTrailer}
                onOpenMoviePage={onOpenMoviePage}
                isFavoritesList={true}
                favoriteMovieIds={favoriteIds}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ) : (
              null
            )}
          </div>
        );
      case "settings":
        return (
          <div className="account-page__settings">
            {user && (
              <div className="user-info">
                <div className="user-info__wrapper">
                  <div className="user-info__initials">
                    {user.name && user.surname ? user.name.charAt(0) + user.surname.charAt(0) : ""}
                  </div>
                  <div className="user-info__name-container">
                    <div className="user-info__name-title">
                      <span>Имя Фамилия</span>
                    </div>
                    <div className="user-info__name">{user.name} {user.surname}</div>
                  </div>
                </div>
                <div className="user-info__email-container">
                  <MailIcon />
                  <div className="user-info__email-title">
                    <span>Электронная почта</span>
                    <div className="user-info__email">{user.email}</div>
                  </div>
                </div>
              </div>
            )}
            <button className="header__logout-button" onClick={onLogout}>Выйти из аккаунта</button>
          </div>
        );
      default:
        return null;
    }
  };

  
    return (
    <div className="account-page">
      <div className="account-page__header">
        <h1 className="account-page__title">Мой аккаунт</h1>
      </div>
      <div className="account-page__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`account-page__tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="account-page__tab-icon">{tab.icon}</span>
            <span className="account-page__tab-label">{tab.shortLabel}</span>
          </button>
        ))}
      </div>
      <div className="account-page__content">{renderTabContent()}</div>
    </div>
  );
};

export default AccountPage;