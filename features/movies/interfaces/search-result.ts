export type SearchMediaKind = "movie" | "tv" | "person";

export type WatchProviderOption = {
  id: number;
  name: string;
};

export type SearchResultItem = {
  id: number;
  title: string;
  posterPath?: string;
  mediaType: SearchMediaKind;
  /** Present for movie / tv from search/multi (used for genre filters). */
  genreIds?: number[];
};

export type SearchMultiPage = {
  results: SearchResultItem[];
  page: number;
  totalPages: number;
  totalResults: number;
};
