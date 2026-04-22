import { MovieDetails } from "./movie-details";
import type { SeriesDetails } from "./series-details";

export type User = {
  favoriteMovies: MovieDetails[];
  favoriteSeries: SeriesDetails[];
};
