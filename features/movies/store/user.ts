import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLocation } from "../localization";
import {
  type MovieDetails,
  type User,
  type SeriesDetails,
  type WatchlistItem,
  type WatchStatus,
  type WatchlistMediaType,
} from "../interfaces";
import {
  fromPersistedWatchlistItem,
  toPersistedWatchlistItem,
  watchlistEntryKey,
} from "../helpers/watchlist-storage";

type Theme = "light" | "dark";
type Language = "pt-BR" | "en";
type FavoriteItem = {
  name: string;
  description?: string;
  favoriteMovies?: MovieDetails[];
};

function matchesWatchlistItem(
  item: WatchlistItem,
  id: number,
  mediaType: WatchlistMediaType
): boolean {
  return item.id === id && (item.mediaType ?? "movie") === mediaType;
}

type UserStore = {
  favoriteMovies: MovieDetails[];
  favoriteSeries: SeriesDetails[];
  favoriteRanking: string[];
  theme: Theme;
  language: Language;
  favoriteItems: FavoriteItem[];
  watchlistItems: WatchlistItem[];
  addFavoriteMovie: (movie: MovieDetails) => void;
  removeFavoriteMovie: (movieId?: number) => void;
  getFavorite: (movieId?: number) => MovieDetails | undefined;
  addFavoriteSeries: (series: SeriesDetails) => void;
  removeFavoriteSeries: (seriesId?: number) => void;
  getFavoriteSeries: (seriesId?: number) => SeriesDetails | undefined;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setFavoriteItem: (item: FavoriteItem) => void;
  setFavoriteRanking: (ranking: string[]) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number, mediaType?: WatchlistMediaType) => void;
  updateWatchStatus: (
    id: number,
    status: WatchStatus,
    progress?: number,
    mediaType?: WatchlistMediaType
  ) => void;
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
      favoriteSeries: [],
      favoriteRanking: [],
      favoriteItems: [],
      watchlistItems: [],
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
      addFavoriteSeries: (series: SeriesDetails) => {
        set((state) => {
          if (
            !series.id ||
            state.favoriteSeries.find((item) => item.id === series.id)
          ) {
            return state;
          }
          return { favoriteSeries: [...state.favoriteSeries, series] };
        });
      },
      removeFavoriteSeries: (seriesId?: number) => {
        set((state) => ({
          favoriteSeries: state.favoriteSeries.filter(
            (item) => item.id !== seriesId
          ),
        }));
      },
      getFavoriteSeries(seriesId) {
        return store().favoriteSeries.find((x) => x.id === seriesId);
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
      setFavoriteRanking: (ranking: string[]) => {
        set(() => ({
          favoriteRanking: ranking,
        }));
      },
      addToWatchlist: (item: WatchlistItem) => {
        set((state) => {
          const next: WatchlistItem = {
            ...item,
            mediaType: item.mediaType ?? "movie",
          };
          const key = watchlistEntryKey(next);
          if (state.watchlistItems.some((i) => watchlistEntryKey(i) === key)) {
            return state;
          }
          return { watchlistItems: [...state.watchlistItems, next] };
        });
      },
      removeFromWatchlist: (id: number, mediaType: WatchlistMediaType = "movie") => {
        set((state) => ({
          watchlistItems: state.watchlistItems.filter(
            (i) => !matchesWatchlistItem(i, id, mediaType)
          ),
        }));
      },
      updateWatchStatus: (
        id: number,
        status: WatchStatus,
        progress?: number,
        mediaType: WatchlistMediaType = "movie"
      ) => {
        set((state) => ({
          watchlistItems: state.watchlistItems.map((i) =>
            matchesWatchlistItem(i, id, mediaType)
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
      partialize: ((state) => ({
        favoriteMovies: state.favoriteMovies,
        favoriteSeries: state.favoriteSeries,
        favoriteRanking: state.favoriteRanking,
        favoriteItems: state.favoriteItems,
        theme: state.theme,
        language: state.language,
        watchlistItems: state.watchlistItems.map(toPersistedWatchlistItem),
      })) as (state: UserStore) => UserStore,
      merge: (persisted, current) => {
        const p = persisted as
          | (Partial<UserStore> & {
              watchlistItems?: unknown[];
            })
          | undefined;
        if (!p) return current as UserStore;
        const rawWatchlist = p.watchlistItems;
        const watchlistItems = Array.isArray(rawWatchlist)
          ? rawWatchlist.map((row) =>
              fromPersistedWatchlistItem(
                toPersistedWatchlistItem(row as WatchlistItem)
              )
            )
          : (current as UserStore).watchlistItems;
        return {
          ...(current as UserStore),
          ...p,
          watchlistItems,
        };
      },
    }
  )
);
