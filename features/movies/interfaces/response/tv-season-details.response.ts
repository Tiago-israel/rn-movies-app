export type TVSeasonEpisodeResponse = {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string | null;
  vote_average: number;
  air_date: string;
};

export type TVSeasonDetailsResponse = {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episodes: TVSeasonEpisodeResponse[];
};
