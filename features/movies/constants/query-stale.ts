/** React Query staleTime values (ms) — TMDB catalog vs fresher feeds */

export const STALE_CATALOG_SLOW_MS = 30 * 60 * 1000; // top rated, genres
export const STALE_CATALOG_MEDIUM_MS = 10 * 60 * 1000; // upcoming, on the air
export const STALE_CATALOG_DEFAULT_MS = 5 * 60 * 1000; // popular, now playing-ish
export const STALE_TRENDING_MS = 2 * 60 * 1000;
export const STALE_NOW_PLAYING_MS = 3 * 60 * 1000;
