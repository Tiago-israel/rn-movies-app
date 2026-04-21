import type { MovieDetails } from "./movie-details";

export type WatchStatus = "watching" | "saved" | "watched";

export type WatchlistItem = MovieDetails & {
  watchStatus: WatchStatus;
  progress: number; // 0–100
  currentEpisode?: number;
  totalEpisodes?: number;
  isSeries?: boolean;
  userRating?: number; // 1–10
  addedAt: string; // ISO date string
};
