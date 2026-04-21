export type SearchMultiMovieResult = {
  media_type: "movie";
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids?: number[];
};

export type SearchMultiTvResult = {
  media_type: "tv";
  id: number;
  name: string;
  poster_path: string | null;
  genre_ids?: number[];
};

export type SearchMultiPersonResult = {
  media_type: "person";
  id: number;
  name: string;
  profile_path: string | null;
};

export type SearchMultiResultResponse =
  | SearchMultiMovieResult
  | SearchMultiTvResult
  | SearchMultiPersonResult;

export type SearchMultiListResponse = {
  page: number;
  results: SearchMultiResultResponse[];
  total_pages: number;
  total_results: number;
};
