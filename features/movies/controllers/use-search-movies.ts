import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks";
import { MoviesService } from "../services";
import type { SearchResultItem } from "../interfaces";
import { useSearchRecentStore, useUserStore } from "../store";

export type SearchStatus = "idle" | "loading" | "success" | "error";

export type MediaFilterKind = "all" | "movie" | "tv" | "person";

export function useSearchMovies() {
  const language = useUserStore((s) => s.language);
  const movieService = useRef(new MoviesService());
  const searchAbortRef = useRef<AbortController | null>(null);
  const trendingAbortRef = useRef<AbortController | null>(null);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText, 300);

  const [status, setStatus] = useState<SearchStatus>("idle");
  const [committedQuery, setCommittedQuery] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<MediaFilterKind>("all");
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [genreLabelById, setGenreLabelById] = useState<Map<number, string>>(
    () => new Map()
  );
  const [trendingItems, setTrendingItems] = useState<SearchResultItem[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const addRecentQuery = useSearchRecentStore((s) => s.addRecentQuery);
  const recentQueries = useSearchRecentStore((s) => s.recentQueries);
  const removeRecentQuery = useSearchRecentStore((s) => s.removeRecentQuery);

  const awaitingDebounce =
    searchText.trim().length > 0 &&
    searchText.trim() !== debouncedSearchText.trim();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [movieG, tvG] = await Promise.all([
        movieService.current.getGenres(),
        movieService.current.getTvGenres(),
      ]);
      if (cancelled) return;
      const map = new Map<number, string>();
      for (const g of movieG) map.set(g.id, g.name);
      for (const g of tvG) map.set(g.id, g.name);
      setGenreLabelById(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    trendingAbortRef.current?.abort();
    const ac = new AbortController();
    trendingAbortRef.current = ac;
    setTrendingLoading(true);
    (async () => {
      try {
        const t = await movieService.current.getTrendingAllDay(1, {
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        setTrendingItems(t.results.slice(0, 18));
      } catch (e: unknown) {
        if ((e as Error)?.name === "AbortError") return;
        setTrendingItems([]);
      } finally {
        if (!ac.signal.aborted) setTrendingLoading(false);
      }
    })();
    return () => ac.abort();
  }, [language]);

  const fetchFirstPage = useCallback(
    async (q: string, signal: AbortSignal) => {
      setStatus("loading");
      setErrorKey(null);
      setItems([]);
      try {
        const result = await movieService.current.searchMulti(q, 1, {
          signal,
        });
        if (signal.aborted) return;
        setItems(result.results);
        setPage(result.page);
        setTotalPages(result.totalPages);
        setCommittedQuery(q);
        setStatus("success");
        addRecentQuery(q);
      } catch (e: unknown) {
        if ((e as Error)?.name === "AbortError") return;
        setErrorKey("search_error");
        setStatus("error");
        setItems([]);
      }
    },
    [addRecentQuery]
  );

  useEffect(() => {
    if (!searchText.trim()) {
      searchAbortRef.current?.abort();
      setStatus("idle");
      setCommittedQuery("");
      setErrorKey(null);
      setItems([]);
      setPage(1);
      setTotalPages(0);
      setLoadingMore(false);
      setMediaFilter("all");
      setSelectedGenreIds([]);
    }
  }, [searchText]);

  useEffect(() => {
    const q = debouncedSearchText.trim();
    if (!q) {
      return;
    }

    const ac = new AbortController();
    searchAbortRef.current?.abort();
    searchAbortRef.current = ac;

    setMediaFilter("all");
    setSelectedGenreIds([]);
    void fetchFirstPage(q, ac.signal);

    return () => ac.abort();
  }, [debouncedSearchText, fetchFirstPage]);

  const loadMore = useCallback(async () => {
    const q = committedQuery.trim();
    if (
      !q ||
      loadingMore ||
      page >= totalPages ||
      status !== "success" ||
      errorKey
    ) {
      return;
    }
    setLoadingMore(true);
    try {
      const next = await movieService.current.searchMulti(q, page + 1);
      setItems((prev) => [...prev, ...next.results]);
      setPage(next.page);
      setTotalPages(next.totalPages);
    } catch {
      // keep existing items; pagination failure is non-fatal
    } finally {
      setLoadingMore(false);
    }
  }, [committedQuery, loadingMore, page, totalPages, status, errorKey]);

  const retry = useCallback(() => {
    const q = committedQuery.trim() || searchText.trim();
    if (!q) return;
    const ac = new AbortController();
    searchAbortRef.current?.abort();
    searchAbortRef.current = ac;
    void fetchFirstPage(q, ac.signal);
  }, [committedQuery, searchText, fetchFirstPage]);

  const clearList = useCallback(() => {
    setSearchText("");
  }, []);

  const selectRecentQuery = useCallback((q: string) => {
    setSearchText(q);
  }, []);

  const toggleGenre = useCallback((id: number) => {
    setSelectedGenreIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const displayedItems = useMemo(() => {
    let list = items;
    if (mediaFilter !== "all") {
      list = list.filter((i) => i.mediaType === mediaFilter);
    }
    if (selectedGenreIds.length > 0) {
      list = list.filter((i) =>
        i.genreIds?.some((gid) => selectedGenreIds.includes(gid))
      );
    }
    return list;
  }, [items, mediaFilter, selectedGenreIds]);

  const genreOptions = useMemo(() => {
    const ids = new Set<number>();
    for (const item of items) {
      item.genreIds?.forEach((id) => ids.add(id));
    }
    return [...ids]
      .map((id) => ({
        id,
        label: genreLabelById.get(id) ?? `#${id}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [items, genreLabelById]);

  const hasMore = page < totalPages && status === "success";

  const showIdleHome =
    searchText.trim().length === 0 && status === "idle" && !errorKey;

  return {
    searchText,
    setSearchText,
    clearList,
    status,
    committedQuery,
    errorKey,
    retry,
    items,
    displayedItems,
    loadMore,
    loadingMore,
    hasMore,
    mediaFilter,
    setMediaFilter,
    genreOptions,
    selectedGenreIds,
    toggleGenre,
    trendingItems,
    trendingLoading,
    recentQueries,
    removeRecentQuery,
    selectRecentQuery,
    showIdleHome,
    awaitingDebounce,
  };
}
