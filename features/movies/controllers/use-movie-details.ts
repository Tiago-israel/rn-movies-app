import { useCallback, useEffect, useRef, useState } from "react";
import { MoviesService } from "../services";
import { useUserStore } from "../store";
import type { Cast, MovieDetails } from "../interfaces";

export function useMovieDetails(movieId: number) {
  const moviesService = useRef(new MoviesService());
  const [movie, setMovie] = useState<MovieDetails>({});
  const [recommendations, setRecommendations] = useState<MovieDetails[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [cast, setCast] = useState<Cast[]>([]);

  const addFavoriteMovie = useUserStore((state) => state.addFavoriteMovie);
  const getFavorite = useUserStore((state) => state.getFavorite);
  const removeFavoriteMovie = useUserStore(
    (state) => state.removeFavoriteMovie
  );

  async function getMovieDetails(id: number) {
    const result = await moviesService.current.getMovieDetails(id);
    setMovie(result);
  }

  async function getRecommendations(id: number) {
    const result = await moviesService.current.getRecommendations(id);
    setRecommendations(result);
  }

  async function getImages(id: number) {
    const result = await moviesService.current.getImages(id);
    setImages(result);
  }

  async function getCast(id: number) {
    const result = await moviesService.current.getMovieCredits(id);
    setCast(result);
  }

  const setFavorite = useCallback(
    (id: number) => {
      const favorite = getFavorite(id);
      setIsFavorite(favorite !== undefined);
    },
    [getFavorite]
  );

  const onFavoriteMovie = useCallback(() => {
    if (!isFavorite) {
      addFavoriteMovie(movie);
    } else {
      removeFavoriteMovie(movie.id);
    }
    setIsFavorite((value) => !value);
  }, [movie, addFavoriteMovie, removeFavoriteMovie]);

  const onLoad = useCallback(
    async (id: number) => {
      getRecommendations(id);
      getImages(id);
      getCast(id);
      await getMovieDetails(id);
      setFavorite(id);
    },
    [getMovieDetails, setFavorite]
  );

  useEffect(() => {
    onLoad(movieId);
    return () => {
      setMovie({});
      setImages([]);
      setRecommendations([]);
    };
  }, [movieId]);

  return { movie, isFavorite, recommendations, images, cast, onFavoriteMovie };
}
