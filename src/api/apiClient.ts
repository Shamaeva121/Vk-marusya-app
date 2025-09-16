import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

export const apiClient = axios.create({
  baseURL: 'https://cinemaguide.skillbox.cc/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const queryClient = new QueryClient();

export const fetchProfile = () => apiClient.get('/profile').then(res => res.data);

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', { email, password });
  if (response.status === 200) {
    const user = await fetchProfile();
    return { result: true, user };
  } else {
    return { result: false, message: 'Неверный email или пароль' };
  }
};

export const registerUser = async ({ name, surname, email, password }: { name: string; surname: string; email: string; password: string }) => {
  try {
    const response = await apiClient.post('/user', { name, surname, email, password });
    if (response.status === 200 || response.status === 201) {
      const loginResponse = await apiClient.post('/auth/login', { email, password });
      if (loginResponse.status === 200) {
        const user = await fetchProfile();
        return { result: true, user };
      } else {
        return { result: false, message: 'Ошибка при входе после регистрации' };
      }
    } else {
      return { result: false, message: 'Ошибка при регистрации' };
    }
  } catch (error: any) {
    return { result: false, message: error.message || 'Ошибка при регистрации' };
  }
};

export const getMovies = (
  page: number = 1,
  limit: number = 10,
  genre?: string,
  title?: string
) => {
  return apiClient
    .get('/movie', {
      params: { page, limit, genre, title },
    })
    .then(res => res.data);
};

export const getTop10Movies = () => {
  return apiClient.get('/movie/top10').then(res => res.data);
};

export const getMovieGenres = () => {
  return apiClient.get('/movie/genres').then(res => res.data);
};

export const getMovieById = (id: string) => {
  return apiClient.get(`/movie/${id}`).then(res => res.data);
};

export const getRandomMovie = () => {
  return apiClient.get('/movie/random').then(res => res.data);
};

export const getFavoriteMovies = () => {
  return apiClient.get('/favorites').then(res => res.data);
};


export const addToFavorites = (movieId: string) => {
  return apiClient.post('/favorites', { id: movieId }, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.data);
};


export const removeFromFavorites = (movieId: string) => {
return apiClient.delete(`/favorites/${movieId}`).then(res => res.data);
};

export const logoutUser = async () => {
  await apiClient.get('/auth/logout');
};

export default apiClient;

