import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";
import { useUserStore } from "../store";

export function useMovieDetails(movieId: number) {
  const moviesService = useRef(new MoviesService()).current;
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const addFavoriteMovie = useUserStore((state) => state.addFavoriteMovie);
  const getFavorite = useUserStore((state) => state.getFavorite);
  const removeFavoriteMovie = useUserStore(
    (state) => state.removeFavoriteMovie
  );

  const { data: movie } = useQuery({
    initialData: {},
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const result = await moviesService.getMovieDetails(movieId);
      return result;
    },
  });

  const { data: images } = useQuery({
    initialData: [],
    queryKey: ["images", movieId],
    queryFn: async () => {
      const result = await moviesService.getImages(movieId);
      return result;
    },
  });

  const { data: recommendations } = useQuery({
    initialData: [],
    queryKey: ["recommendations", movieId],
    queryFn: async () => {
      const result = await moviesService.getRecommendations(movieId);
      return result;
    },
  });

  const { data: cast } = useQuery({
    initialData: [],
    queryKey: ["cast", movieId],
    queryFn: async () => {
      const result = await moviesService.getMovieCredits(movieId);
      return result;
    },
  });

  const setFavorite = useCallback(
    (id: number) => {
      const favorite = getFavorite(id);
      setIsFavorite(favorite !== undefined);
    },
    [getFavorite]
  );

  const onFavoriteMovie = useCallback(() => {
    if (!movie) return;
    if (!isFavorite) {
      addFavoriteMovie(movie);
    } else {
      removeFavoriteMovie(movie.id);
    }
    setIsFavorite((value) => !value);
  }, [movie, addFavoriteMovie, removeFavoriteMovie]);

  useEffect(() => {
    setFavorite(movieId);
  }, [movieId]);

  return { movie, isFavorite, recommendations, images, cast, onFavoriteMovie };
}
