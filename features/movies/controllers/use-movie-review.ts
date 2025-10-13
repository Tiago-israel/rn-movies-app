import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";

export function useMovieReview(movieId: number) {
  const moviesService = useRef(new MoviesService()).current;

  const { data: movieReviews } = useQuery({
    initialData: [],
    queryKey: ["movieReviews", movieId],
    queryFn: async () => {
      const result = await moviesService.getMovieReviews(movieId);
      return result;
    },
  });

  return { movieReviews };
}
