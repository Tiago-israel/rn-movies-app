import { useEffect, useRef, useState } from "react";
import { Cast } from "../interfaces";
import { MoviesService } from "../services";

export function useMovieCast(movieId: number) {
  const moviesService = useRef(new MoviesService());
  const [cast, setCast] = useState<Cast[]>([]);

  async function getMovieCast(movieId: number) {
    const cast = await moviesService.current.getMovieCredits(movieId);
    setCast(cast);
  }

  useEffect(() => {
    getMovieCast(movieId);

    return () => {
      setCast([]);
    };
  }, [movieId]);

  return { cast };
}
