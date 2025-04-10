export type TVSeriesListItem = {
  id: number;
  adult: boolean;
  name: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  genreIds: number[];
  originCountry: string[];
  originalLanguage: string;
  originalName: string;
  popularity: number;
  firstAirDate: string;
  voteCount: number;
  voteAverage: number;
};
