import { useRef, useState } from "react";
import { MoviesService } from "../services";
import { MovieDetails } from "../interfaces";

export function useSearchMovies() {
  const movieService = useRef(new MoviesService());
  const [movies, setMovies] = useState<MovieDetails[]>([]);

  async function onChangeText(text: string) {
    const results = await movieService.current.findMovies(text);
    setMovies(results);
  }

  function clearList() {
    setMovies([]);
  }

  return { movies, onChangeText, clearList };
}
