import React from "react";

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  surname: string;
  favorites?: number[];
}

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  language: string;
  relaseYear: number;
  releaseDate: string;
  genres: string[];
  plot: string;
  runtime: number;
  budget: string;
  revenue: string;
  homepage: string;
  status: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  trailerYoutubeId: string;
  tmdbRating: number;
  searchL: string;
  keywords: string[];
  countriesOfOrigin: string[];
  languages: string[];
  cast: string[];
  director: string;
  production: string;
  awardsSummary: string;
}

export type Genre = string;

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  onPostAuth?: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  kind?: "primary" | "secondary";
  isLoading?: boolean;
}

export interface FormFieldProps {
  label: string;
  icon?: string;
  error?: string | undefined;
  children: React.ReactNode;
  isInvalid?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (formData: LoginFormData) => void;
  onToggleAuthType: (type: AuthType) => void;
  isLoading?: boolean;
}

export type AuthType = 'login' | 'register';

export interface RegisterFormData {
  email: string;
  name: string;
  surname: string;
  password: string;
}

export interface RegisterFormProps {
  onSubmit: (formData: RegisterFormData) => void;
  onRegisterSuccess?: () => void;
  onRegistrationSuccess?: () => void;
  onToggleAuthType: (type: AuthType) => void;
  onLoginClick?: (type: AuthType) => void;
  isLoading?: boolean;
}

export interface AccountPageProps {
  user: User;
  onLogout: () => void;
  movies: Movie[];
  onOpenTrailer: (movie: any) => void;
  onRemove: (movieId: string) => void;
  onOpenMoviePage: (movieId: number) => void;
}

export interface BlockMovieItem {
  id: number;
  title: string;
  posterUrl?: string;
}

export interface BlockMoviesProps {
  movies: BlockMovieItem[];
  onRemove: (movieId: string) => void;
  onOpenTrailer: (movie: any) => void;
  onOpenMoviePage: (movieId: number) => void;
  isFavoritesList?: boolean;
  favoriteMovieIds: string[];
  onFavoriteToggle: (movieId: string, isCurrentFavorite: boolean) => void;
}

export interface HeaderProps {
  currentUser: User | undefined | null;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
}

export interface MainSectionProps {
  movie: Movie;
  onOpenTrailer: (trailerUrl: string | undefined) => void;
  onAddToFavorites: (movieId: string) => Promise<void>;
  onOpenMoviePage: (movieId: number) => void;
  isFavorite: boolean;
  onUpdateMovie: (movieId: number) => void;
  onRemove?: (id: string) => void;
  currentUser: any | null;
  onOpenAuthModal: () => void;
}

export interface SearchResultItemProps {
  movie: Movie;
}

export interface trailerUrl {
  movieId: number;
  src: string;
  title: string;
}

export interface TrailerModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  trailerYoutubeId: string | undefined;
}

export interface HomePageProps {
  onAddToFavorites: (movieId: string) => void;
  onOpenAuthModal: () => void;
  onOpenMoviePage: (movieId: number) => void;
  onRemove: (movieId: string) => void;
  favoriteMovieIds: string[];
  onOpenTrailer: (trailerUrl?: string) => void;
}

export interface MovieDetailPageProps {
  isLoggedIn: boolean;
  onOpenAuthModal: () => void;
  onAddToFavorites: (movieId: string) => void;
  onRemoveFromFavorites: (movieId: string) => void;
  favoriteMovieIds: string[];
  onOpenTrailer: (trailerUrl?: string) => void;
}

export interface GenreMoviesPageProps {
  onOpenMoviePage: (movieId: number) => void;
}

export interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}


export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface RemoveFavoriteResponse {
  result: boolean; 
  message?: string;
}

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortLabel: string;
}


