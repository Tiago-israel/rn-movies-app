import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";

export function useMovieReview(movieId: number) {
  const moviesService = useRef(new MoviesService()).current;

  const { data: movieReviews, isFetching: isReviewsFetching } = useQuery({
    initialData: [],
    queryKey: ["movieReviews", movieId],
    queryFn: async () => {
      const result = await moviesService.getMovieReviews(movieId);
      return result;
    },
  });

  const isLoading = isReviewsFetching && movieReviews.length === 0;
  return { movieReviews, isLoading };
}
