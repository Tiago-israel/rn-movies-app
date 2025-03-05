import { MovieDetailsResponse } from "./movie-details.response";

export type PersonMovieCreditsResponse = {
  cast: Array<MovieDetailsResponse>;
  crew: Array<MovieDetailsResponse>;
};
