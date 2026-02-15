import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";

export function useMovieCast(movieId: number) {
  const moviesService = useRef(new MoviesService()).current;

  const { data: cast, isFetching: isCastFetching } = useQuery({
    initialData: [],
    queryKey: ["movieCredits", movieId],
    queryFn: async () => {
      const result = await moviesService.getMovieCredits(movieId);
      return result;
    },
  });

  const isLoading = isCastFetching && cast.length === 0;
  return { cast, isLoading };
}
