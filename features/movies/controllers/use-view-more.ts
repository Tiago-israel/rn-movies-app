import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  ViewMoreService,
  MoviesService,
  TVSeriesService,
} from "../services";
import type {
  Genre,
  GenericItem,
  PaginatedResult,
  ServiceType,
  WatchProviderOption,
} from "../interfaces";
import { useUserStore } from "../store";

const FILTER_META_STALE_MS = 1000 * 60 * 60 * 24;

function discoverSortByForViewMore(type: ServiceType): string {
  switch (type) {
    case "movies.popular":
    case "tv.popular":
    case "tv.airing_today":
    case "tv.on_the_air":
      return "popularity.desc";
    case "movies.top_rated":
    case "tv.top_rated":
      return "vote_average.desc";
    case "movies.upcoming":
      return "primary_release_date.asc";
    case "movies.now_playing":
      return "primary_release_date.desc";
    default:
      return "popularity.desc";
  }
}

export function useViewMore(type: ServiceType) {
  const language = useUserStore((s) => s.language);
  const isMovieCatalog = type.startsWith("movies.");

  const moviesService = useRef(new MoviesService()).current;
  const tvService = useRef(new TVSeriesService()).current;
  const viewMoreService = useMemo(() => new ViewMoreService(type), [type]);

  const [appliedGenreIds, setAppliedGenreIds] = useState<number[]>([]);
  const [appliedProviderIds, setAppliedProviderIds] = useState<number[]>([]);

  const providerFilterKey = useMemo(
    () => [...appliedProviderIds].sort((a, b) => a - b).join(","),
    [appliedProviderIds]
  );
  const hasProviderFilter = providerFilterKey.length > 0;

  /** TMDB: `|` = OR entre gêneros (alinhado ao filtro anterior no cliente). */
  const genreFilterKey = useMemo(
    () => [...appliedGenreIds].sort((a, b) => a - b).join("|"),
    [appliedGenreIds]
  );
  const hasGenreFilter = appliedGenreIds.length > 0;
  const needsDiscover = hasProviderFilter || hasGenreFilter;

  useEffect(() => {
    setAppliedGenreIds([]);
    setAppliedProviderIds([]);
  }, [type]);

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["viewMoreGenres", isMovieCatalog ? "movie" : "tv", language],
    queryFn: async () => {
      const g = isMovieCatalog
        ? await moviesService.getGenres()
        : await moviesService.getTvGenres();
      return [...g].sort((a, b) => a.name.localeCompare(b.name));
    },
    enabled: Boolean(type),
    staleTime: FILTER_META_STALE_MS,
  });

  const { data: providersCatalog = [] } = useQuery<WatchProviderOption[]>({
    queryKey: [
      "watchProvidersCatalog",
      isMovieCatalog ? "movie" : "tv",
      language,
    ],
    queryFn: async () => {
      const catalog = await moviesService.getWatchProvidersCatalog(
        isMovieCatalog ? "movie" : "tv"
      );
      return catalog.slice(0, 48);
    },
    enabled: Boolean(type),
    staleTime: FILTER_META_STALE_MS,
  });

  const baseListQuery = useInfiniteQuery<
    PaginatedResult<GenericItem>,
    Error,
    InfiniteData<PaginatedResult<GenericItem>>,
    (string | ServiceType)[],
    number
  >({
    queryKey: ["viewMore", type, language],
    queryFn: async ({ pageParam }) =>
      viewMoreService.getPaginatedItems(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      const p = lastPageParam as number;
      if (!lastPage.results.length || p >= lastPage.totalPages) {
        return undefined;
      }
      return p + 1;
    },
    enabled: Boolean(type) && !needsDiscover,
  });

  const discoverQuery = useInfiniteQuery<
    PaginatedResult<GenericItem>,
    Error,
    InfiniteData<PaginatedResult<GenericItem>>,
    (string | ServiceType)[],
    number
  >({
    queryKey: ["viewMoreDiscover", type, language, providerFilterKey, genreFilterKey],
    queryFn: async ({ pageParam }) => {
      const page = pageParam;
      const sortBy = discoverSortByForViewMore(type);
      const withWatchProviders = hasProviderFilter ? providerFilterKey : undefined;
      const withGenres = hasGenreFilter ? genreFilterKey : undefined;
      if (isMovieCatalog) {
        return moviesService.discoverMovies(page, {
          sortBy,
          withWatchProviders,
          withGenres,
        });
      }
      return tvService.discoverTv(page, {
        sortBy,
        withWatchProviders,
        withGenres,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      const p = lastPageParam as number;
      if (!lastPage.results.length || p >= lastPage.totalPages) {
        return undefined;
      }
      return p + 1;
    },
    enabled: Boolean(type) && needsDiscover,
  });

  const activeQuery = needsDiscover ? discoverQuery : baseListQuery;

  const flatItems = useMemo(
    () => activeQuery.data?.pages.flatMap((p) => p.results) ?? [],
    [activeQuery.data?.pages]
  );

  const items = flatItems;

  const listHeaderResultCount = useMemo(() => {
    const total = activeQuery.data?.pages[0]?.totalResults;
    return total ?? items.length;
  }, [items.length, activeQuery.data?.pages]);

  const getPaginatedItems = useCallback(() => {
    if (!activeQuery.hasNextPage || activeQuery.isFetchingNextPage) return;
    activeQuery.fetchNextPage();
  }, [
    activeQuery.fetchNextPage,
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
  ]);

  /** Full skeleton só na lista base (sem Discover). */
  const isLoading =
    !needsDiscover && Boolean(type) && baseListQuery.isLoading;

  const providersLoading =
    needsDiscover &&
    discoverQuery.isFetching &&
    !discoverQuery.isFetchingNextPage;

  /** Footer spinner: próxima página do infinite query ou 1ª carga do discover com filtro de streaming. */
  const isListFooterLoading =
    activeQuery.isFetchingNextPage || providersLoading;

  const applyFilters = useCallback(
    (genreIds: number[], providerIds: number[]) => {
      setAppliedGenreIds(genreIds);
      setAppliedProviderIds(providerIds);
    },
    []
  );

  return {
    items,
    listHeaderResultCount,
    getPaginatedItems,
    isLoading,
    genres,
    providersCatalog,
    appliedGenreIds,
    appliedProviderIds,
    applyFilters,
    providersLoading,
    isListFooterLoading,
    isMovieCatalog,
  };
}
