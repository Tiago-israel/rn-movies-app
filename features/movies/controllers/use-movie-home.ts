import { useQuery } from "@tanstack/react-query";
import {
  STALE_CATALOG_DEFAULT_MS,
  STALE_CATALOG_MEDIUM_MS,
  STALE_CATALOG_SLOW_MS,
  STALE_NOW_PLAYING_MS,
} from "../constants/query-stale";
import { MoviesService } from "../services";

const HOME_CACHE_MS = 30 * 60 * 1000;

const homeCache = {
  gcTime: HOME_CACHE_MS,
  refetchOnMount: false as const,
  refetchOnWindowFocus: false as const,
  placeholderData: <T,>(p: T | undefined) => p,
};

export function useMovieHome() {
  const moviesService = new MoviesService();

  const { data: nowPlayingMovies, isFetching: isNowPlayingFetching } = useQuery({
    queryKey: ["nowPlayingMovies"],
    staleTime: STALE_NOW_PLAYING_MS,
    ...homeCache,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getNowPlayingMovies(1, {
        signal,
      });
      return results;
    },
  });

  const isLoading =
    isNowPlayingFetching && (!nowPlayingMovies || nowPlayingMovies.length === 0);

  const {
    data: popularMovies,
    isError: isPopularMoviesError,
    refetch: refetchPopularMovies,
  } = useQuery({
    queryKey: ["popularMovies"],
    staleTime: STALE_CATALOG_DEFAULT_MS,
    ...homeCache,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getPopularMovies(1, {
        signal,
      });
      return results;
    },
  });

  const {
    data: topRatedMovies,
    isError: isTopRatedMoviesError,
    refetch: refetchTopRatedMovies,
  } = useQuery({
    queryKey: ["topRatedMovies"],
    staleTime: STALE_CATALOG_SLOW_MS,
    ...homeCache,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getTopRatedMovies(1, {
        signal,
      });
      return results;
    },
  });

  const {
    data: upcomingMovies,
    isError: isUpcomingMoviesError,
    refetch: refetchUpcomingMovies,
  } = useQuery({
    queryKey: ["upcomingMovies"],
    staleTime: STALE_CATALOG_MEDIUM_MS,
    ...homeCache,
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
    isPopularMoviesError,
    isTopRatedMoviesError,
    isUpcomingMoviesError,
    refetchPopularMovies,
    refetchTopRatedMovies,
    refetchUpcomingMovies,
  };
}
