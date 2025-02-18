import { useUserStore } from "../store";

export function useFavoriteMovies() {
  const favoriteMovies = useUserStore((state) => state.favoriteMovies);

  return {
    favoriteMovies,
  };
}
