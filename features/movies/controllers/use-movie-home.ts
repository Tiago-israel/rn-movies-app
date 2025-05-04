import { useCallback, useEffect, useRef, useState } from "react";
import { MoviesService } from "../services";
import type { GenericItem, MovieDetails } from "../interfaces";

export function useMovieHome() {
  const moviesService = new MoviesService();
  const [nowPlayingMovies, setNowPlayingMovies] = useState<GenericItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<GenericItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<GenericItem[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<GenericItem[]>([]);

  async function getNowPlayingMovies() {
    const response = await moviesService.getNowPlayingMovies();
    setNowPlayingMovies(response.results);
  }

  async function getPopularMovies() {
    const response = await moviesService.getPopularMovies();
    setPopularMovies(response.results);
  }

  async function getTopRatedMovies() {
    const response = await moviesService.getTopRatedMovies();
    setTopRatedMovies(response.results);
  }

  async function getUpcomingMovies() {
    const response = await moviesService.getUpcomingMovies();
    setUpcomingMovies(response.results);
  }

  useEffect(() => {
    getNowPlayingMovies();
    getPopularMovies();
    getTopRatedMovies();
    getUpcomingMovies();
  }, []);

  return { nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies };
}
