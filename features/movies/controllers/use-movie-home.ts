import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";

export function useMovieHome() {
  const moviesService = new MoviesService();

  const { data: nowPlayingMovies } = useQuery({
    queryKey: ["nowPlayingMovies"],
    queryFn: async () => {
      const { results } = await moviesService.getNowPlayingMovies();
      return results;
    },
  });

  const { data: popularMovies } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: async () => {
      const { results } = await moviesService.getPopularMovies();
      return results;
    },
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: async () => {
      const { results } = await moviesService.getTopRatedMovies();
      return results;
    },
  });

  const { data: upcomingMovies } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: async () => {
      const { results } = await moviesService.getUpcomingMovies();
      return results;
    },
  });

  return { nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies };
}
