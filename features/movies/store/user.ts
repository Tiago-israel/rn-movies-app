import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLocation } from "../localization";
import { type MovieDetails, type User, type WatchlistItem, type WatchStatus } from "../interfaces";

type Theme = "light" | "dark";
type Language = "pt-BR" | "en";
type FavoriteItem = {
  name: string;
  description?: string;
  favoriteMovies?: MovieDetails[];
};

const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: 1001,
    title: "Shōgun",
    posterPath: "https://picsum.photos/seed/shogun-p/150/220",
    backdropPath: "https://picsum.photos/seed/shogun-b/800/480",
    genre: "Drama",
    releaseDate: "2024",
    watchStatus: "watching",
    progress: 62,
    currentEpisode: 5,
    totalEpisodes: 10,
    isSeries: true,
    addedAt: "2026-01-20",
  },
  {
    id: 1002,
    title: "Severance",
    posterPath: "https://picsum.photos/seed/severance-p/150/220",
    backdropPath: "https://picsum.photos/seed/severance-b/800/480",
    genre: "Drama",
    releaseDate: "2025",
    watchStatus: "watching",
    progress: 30,
    currentEpisode: 3,
    totalEpisodes: 10,
    isSeries: true,
    addedAt: "2026-01-18",
  },
  {
    id: 1003,
    title: "Dune: Part Two",
    posterPath: "https://picsum.photos/seed/dune2-p/150/220",
    backdropPath: "https://picsum.photos/seed/dune2-b/800/480",
    genre: "Sci-Fi",
    runtime: "2h 46m",
    voteAverageStr: "8.5",
    voteAverage: 8.5,
    releaseDate: "2024",
    watchStatus: "saved",
    progress: 0,
    isSeries: false,
    addedAt: "2026-01-10",
  },
  {
    id: 1004,
    title: "Oppenheimer",
    posterPath: "https://picsum.photos/seed/oppie-p/150/220",
    genre: "Drama",
    runtime: "3h 1m",
    voteAverageStr: "8.3",
    voteAverage: 8.3,
    releaseDate: "2023",
    watchStatus: "saved",
    progress: 0,
    isSeries: false,
    addedAt: "2026-01-05",
  },
  {
    id: 1005,
    title: "Poor Things",
    posterPath: "https://picsum.photos/seed/poorthings-p/150/220",
    genre: "Comedy",
    runtime: "2h 21m",
    voteAverageStr: "7.9",
    voteAverage: 7.9,
    releaseDate: "2023",
    watchStatus: "saved",
    progress: 0,
    isSeries: false,
    addedAt: "2025-12-20",
  },
  {
    id: 1006,
    title: "Interstellar",
    posterPath: "https://picsum.photos/seed/interstellar-p/150/220",
    genre: "Sci-Fi",
    runtime: "2h 49m",
    voteAverageStr: "8.6",
    voteAverage: 8.6,
    releaseDate: "2014",
    watchStatus: "watched",
    progress: 100,
    isSeries: false,
    userRating: 9,
    addedAt: "2025-12-01",
  },
  {
    id: 1007,
    title: "The Dark Knight",
    posterPath: "https://picsum.photos/seed/darkknight-p/150/220",
    genre: "Action",
    runtime: "2h 32m",
    voteAverageStr: "9.0",
    voteAverage: 9.0,
    releaseDate: "2008",
    watchStatus: "watched",
    progress: 100,
    isSeries: false,
    userRating: 10,
    addedAt: "2025-11-15",
  },
];

type UserStore = {
  favoriteMovies: MovieDetails[];
  theme: Theme;
  language: Language;
  favoriteItems: FavoriteItem[];
  watchlistItems: WatchlistItem[];
  addFavoriteMovie: (movie: MovieDetails) => void;
  removeFavoriteMovie: (movieId?: number) => void;
  getFavorite: (movieId?: number) => MovieDetails | undefined;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setFavoriteItem: (item: FavoriteItem) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number) => void;
  updateWatchStatus: (id: number, status: WatchStatus, progress?: number) => void;
};

const StoreManager = {
  setItem: AsyncStorage.setItem,
  getItem: AsyncStorage.getItem,
  removeItem: AsyncStorage.removeItem,
};

export const useUserStore = create(
  persist<UserStore>(
    (set, store) => ({
      favoriteMovies: [],
      favoriteItems: [],
      watchlistItems: INITIAL_WATCHLIST,
      theme: "dark",
      language: "en",
      addFavoriteMovie: (movie: MovieDetails) => {
        set((state) => {
          if (state.favoriteMovies.find((item) => item.id === movie.id)) {
            return state;
          }

          return {
            favoriteMovies: [...state.favoriteMovies, movie],
          };
        });
      },
      removeFavoriteMovie: (movieId?: number) => {
        set((state) => ({
          favoriteMovies: state.favoriteMovies.filter(
            (item) => item.id !== movieId
          ),
        }));
      },
      getFavorite(movieId) {
        return store().favoriteMovies.find((x) => x.id === movieId);
      },
      setTheme(theme: Theme) {
        set((state) => {
          return {
            ...state,
            theme,
          };
        });
      },
      setLanguage(language: Language) {
        set((state) => {
          return {
            ...state,
            language,
          };
        });
        setLocation(language);
      },
      setFavoriteItem: (item: FavoriteItem) => {
        set((state) => {
          return {
            ...state,
            favoriteItems: [...state.favoriteItems, item],
          };
        });
      },
      addToWatchlist: (item: WatchlistItem) => {
        set((state) => {
          if (state.watchlistItems.find((i) => i.id === item.id)) {
            return state;
          }
          return { watchlistItems: [...state.watchlistItems, item] };
        });
      },
      removeFromWatchlist: (id: number) => {
        set((state) => ({
          watchlistItems: state.watchlistItems.filter((i) => i.id !== id),
        }));
      },
      updateWatchStatus: (id: number, status: WatchStatus, progress?: number) => {
        set((state) => ({
          watchlistItems: state.watchlistItems.map((i) =>
            i.id === id
              ? {
                  ...i,
                  watchStatus: status,
                  ...(progress !== undefined ? { progress } : {}),
                }
              : i
          ),
        }));
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => StoreManager),
    }
  )
);
