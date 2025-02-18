import { useEffect, useRef, useState } from "react";
import { type MovieReview } from "../interfaces";
import { MoviesService } from "../services";

export function useMovieReview(movieId: number) {
  const moviesService = useRef(new MoviesService());
  const [movieReviews, setMovieReviews] = useState<MovieReview[]>([]);

  async function getMovieReviews(movieId: number) {
    const result = await moviesService.current.getMovieReviews(movieId);
    setMovieReviews(result);
  }

  useEffect(() => {
    getMovieReviews(movieId);

    return () => {
      setMovieReviews([]);
    };
  }, [movieId]);

  return { movieReviews };
}
