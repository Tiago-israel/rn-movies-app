import { type MovieDetailsResponse } from "./movie-details.response";

export type MovieListResponse = {
  page: number;
  results: MovieDetailsResponse[];
  total_pages: number;
  total_results: number;
};
