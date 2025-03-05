import { MovieDetails } from "./movie-details";

export type PersonMovieCredits = {
  cast: Array<MovieDetails>;
  crew: Array<MovieDetails>;
};
