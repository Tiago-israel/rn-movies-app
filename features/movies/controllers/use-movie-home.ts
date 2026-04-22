import { useQuery } from "@tanstack/react-query";
import {
  STALE_CATALOG_DEFAULT_MS,
  STALE_CATALOG_MEDIUM_MS,
  STALE_CATALOG_SLOW_MS,
  STALE_NOW_PLAYING_MS,
} from "../constants/query-stale";
import { MoviesService } from "../services";

export function useMovieHome() {
  const moviesService = new MoviesService();

  const { data: nowPlayingMovies, isFetching: isNowPlayingFetching } = useQuery({
    queryKey: ["nowPlayingMovies"],
    staleTime: STALE_NOW_PLAYING_MS,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getNowPlayingMovies(1, {
        signal,
      });
      return results;
    },
  });

  const isLoading =
    isNowPlayingFetching && (!nowPlayingMovies || nowPlayingMovies.length === 0);

  const { data: popularMovies } = useQuery({
    queryKey: ["popularMovies"],
    staleTime: STALE_CATALOG_DEFAULT_MS,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getPopularMovies(1, {
        signal,
      });
      return results;
    },
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ["topRatedMovies"],
    staleTime: STALE_CATALOG_SLOW_MS,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getTopRatedMovies(1, {
        signal,
      });
      return results;
    },
  });

  const { data: upcomingMovies } = useQuery({
    queryKey: ["upcomingMovies"],
    staleTime: STALE_CATALOG_MEDIUM_MS,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getUpcomingMovies(1, {
        signal,
      });
      return results;
    },
  });

  return {
    nowPlayingMovies,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    isLoading,
  };
}
