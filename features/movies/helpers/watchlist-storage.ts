import { movieDBBaseImageUrl } from "../constants/urls";
import type { MovieDetails } from "../interfaces/movie-details";
import type { SeriesDetails } from "../interfaces/series-details";
import type { SearchResultItem } from "../interfaces/search-result";
import type {
  WatchlistItem,
  WatchStatus,
  WatchlistMediaType,
} from "../interfaces/watchlist-item";

/** TMDB file path for poster/backdrop, e.g. `/abc.jpg` (stored on device). */
export function tmdbFilePathFromImageUrl(url?: string): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const marker = "/t/p/";
  const idx = url.indexOf(marker);
  if (idx === -1) return undefined;
  const after = url.slice(idx + marker.length);
  const slash = after.indexOf("/");
  if (slash === -1) return undefined;
  return after.slice(slash);
}

export function posterUrlFromTmdbPath(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${movieDBBaseImageUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PersistedWatchlistItem = {
  id: number;
  title?: string;
  posterImageId?: string;
  /** Non-TMDB poster URL (legacy or external). */
  legacyPosterUrl?: string;
  backdropImageId?: string;
  legacyBackdropUrl?: string;
  mediaType?: WatchlistMediaType;
  watchStatus: WatchStatus;
  progress: number;
  currentEpisode?: number;
  totalEpisodes?: number;
  isSeries?: boolean;
  userRating?: number;
  addedAt: string;
  genre?: string;
  runtime?: string;
  voteAverage?: number;
  voteAverageStr?: string;
  releaseDate?: string;
};

export function toPersistedWatchlistItem(item: WatchlistItem): PersistedWatchlistItem {
  const posterImageId =
    item.posterImageId ?? tmdbFilePathFromImageUrl(item.posterPath);
  const legacyPosterUrl = posterImageId ? undefined : item.posterPath;
  const backdropImageId =
    item.backdropImageId ?? tmdbFilePathFromImageUrl(item.backdropPath);
  const legacyBackdropUrl = backdropImageId ? undefined : item.backdropPath;

  return {
    id: item.id!,
    title: item.title,
    posterImageId,
    legacyPosterUrl,
    backdropImageId,
    legacyBackdropUrl,
    mediaType: item.mediaType,
    watchStatus: item.watchStatus,
    progress: item.progress,
    currentEpisode: item.currentEpisode,
    totalEpisodes: item.totalEpisodes,
    isSeries: item.isSeries,
    userRating: item.userRating,
    addedAt: item.addedAt,
    genre: item.genre,
    runtime: item.runtime,
    voteAverage: item.voteAverage,
    voteAverageStr: item.voteAverageStr,
    releaseDate: item.releaseDate,
  };
}

export function fromPersistedWatchlistItem(p: PersistedWatchlistItem): WatchlistItem {
  const posterPath =
    posterUrlFromTmdbPath(p.posterImageId) ?? p.legacyPosterUrl;
  const backdropPath =
    (p.backdropImageId ? posterUrlFromTmdbPath(p.backdropImageId) : undefined) ??
    p.legacyBackdropUrl;

  return {
    id: p.id,
    title: p.title,
    posterImageId: p.posterImageId,
    backdropImageId: p.backdropImageId,
    posterPath,
    backdropPath,
    mediaType: p.mediaType,
    watchStatus: p.watchStatus,
    progress: p.progress,
    currentEpisode: p.currentEpisode,
    totalEpisodes: p.totalEpisodes,
    isSeries: p.isSeries,
    userRating: p.userRating,
    addedAt: p.addedAt,
    genre: p.genre,
    runtime: p.runtime,
    voteAverage: p.voteAverage,
    voteAverageStr: p.voteAverageStr,
    releaseDate: p.releaseDate,
  };
}

export function watchlistEntryKey(item: {
  id?: number;
  mediaType?: WatchlistMediaType;
}): string {
  const mt: WatchlistMediaType = item.mediaType ?? "movie";
  return `${mt}-${item.id}`;
}

export function watchlistKeyFromSearchResult(
  item: SearchResultItem
): string | null {
  if (item.mediaType === "person") return null;
  return `${item.mediaType}-${item.id}`;
}

export function watchlistItemFromSearchResult(
  item: SearchResultItem,
  status: WatchStatus = "saved"
): WatchlistItem | null {
  if (item.mediaType === "person") return null;

  const posterImageId = tmdbFilePathFromImageUrl(item.posterPath);
  const isTv = item.mediaType === "tv";

  return {
    id: item.id,
    title: item.title,
    mediaType: item.mediaType,
    posterImageId,
    posterPath: item.posterPath ?? posterUrlFromTmdbPath(posterImageId),
    watchStatus: status,
    progress: status === "watching" ? 1 : 0,
    isSeries: isTv,
    addedAt: new Date().toISOString().slice(0, 10),
  };
}

export function watchlistItemFromMovieDetails(
  movie: MovieDetails,
  status: WatchStatus = "saved"
): WatchlistItem | null {
  if (movie.id == null) return null;
  const posterImageId = tmdbFilePathFromImageUrl(movie.posterPath);
  const backdropImageId = tmdbFilePathFromImageUrl(movie.backdropPath);

  return {
    ...movie,
    id: movie.id,
    title: movie.title,
    mediaType: "movie",
    posterImageId,
    backdropImageId,
    posterPath: movie.posterPath ?? posterUrlFromTmdbPath(posterImageId),
    backdropPath: movie.backdropPath,
    watchStatus: status,
    progress: status === "watching" ? 1 : 0,
    isSeries: false,
    addedAt: new Date().toISOString().slice(0, 10),
  };
}

export function watchlistItemFromSeriesDetails(
  series: SeriesDetails,
  status: WatchStatus = "saved"
): WatchlistItem | null {
  if (series.id == null) return null;
  const posterImageId = tmdbFilePathFromImageUrl(series.posterPath);
  const backdropImageId = tmdbFilePathFromImageUrl(series.backdropPath);

  return {
    id: series.id,
    title: series.name,
    overview: series.overview,
    backdropPath: series.backdropPath,
    posterPath: series.posterPath ?? posterUrlFromTmdbPath(posterImageId),
    posterImageId,
    backdropImageId,
    genre: series.genre,
    voteAverage: series.voteAverage,
    voteAverageStr: series.voteAverageStr,
    releaseDate: series.firstAirDate,
    mediaType: "tv",
    watchStatus: status,
    progress: status === "watching" ? 1 : 0,
    isSeries: true,
    totalEpisodes: series.numberOfEpisodes,
    addedAt: new Date().toISOString().slice(0, 10),
  };
}
