import { useCallback, useEffect, useRef, useState } from "react";
import { MoviesService } from "../services";
import type { MovieDetails } from "../interfaces";

export function useMovieHome() {
  const moviesService = new MoviesService();
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MovieDetails[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieDetails[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MovieDetails[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MovieDetails[]>([]);

  async function getNowPlayingMovies() {
    const result = await moviesService.getNowPlayingMovies();
    setNowPlayingMovies(result);
  }

  async function getPopularMovies() {
    const result = await moviesService.getPopularMovies();
    setPopularMovies(result);
  }

  async function getTopRatedMovies() {
    const result = await moviesService.getTopRatedMovies();
    setTopRatedMovies(result);
  }

  async function getUpcomingMovies() {
    const result = await moviesService.getUpcomingMovies();
    setUpcomingMovies(result);
  }

  useEffect(() => {
    getNowPlayingMovies();
    getPopularMovies();
    getTopRatedMovies();
    getUpcomingMovies();
  }, []);

  return { nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies };
}
