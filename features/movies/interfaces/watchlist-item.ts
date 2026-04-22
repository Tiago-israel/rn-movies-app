import type { MovieDetails } from "./movie-details";

export type WatchStatus = "watching" | "saved" | "watched";

/** Distinguishes movie vs TV when IDs can collide on TMDB. */
export type WatchlistMediaType = "movie" | "tv";

export type WatchlistItem = MovieDetails & {
  watchStatus: WatchStatus;
  progress: number; // 0–100
  /** TMDB `poster_path` (e.g. `/x.jpg`) — persisted and used to rebuild poster URL. */
  posterImageId?: string;
  /** TMDB backdrop file path segment — optional, for continue-watching hero. */
  backdropImageId?: string;
  mediaType?: WatchlistMediaType;
  currentEpisode?: number;
  totalEpisodes?: number;
  isSeries?: boolean;
  userRating?: number; // 1–10
  addedAt: string; // ISO date string
};
