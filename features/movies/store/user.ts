import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLocation } from "../localization";
import { type MovieDetails, type User } from "../interfaces";

type Theme = "light" | "dark";
type Language = "pt-BR" | "en";
type FavoriteItem = {
  name: string;
  description?: string;
  favoriteMovies?: MovieDetails[];
};

type UserStore = {
  favoriteMovies: MovieDetails[];
  theme: Theme;
  language: Language;
  favoriteItems: FavoriteItem[];
  addFavoriteMovie: (movie: MovieDetails) => void;
  removeFavoriteMovie: (movieId?: number) => void;
  getFavorite: (movieId?: number) => MovieDetails | undefined;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setFavoriteItem: (item: FavoriteItem) => void;
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
      }
    }),
    {
      name: "user",
      storage: createJSONStorage(() => StoreManager),
    }
  )
);
