import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  STALE_CATALOG_DEFAULT_MS,
  STALE_CATALOG_MEDIUM_MS,
  STALE_CATALOG_SLOW_MS,
  STALE_NOW_PLAYING_MS,
} from "../constants/query-stale";
import { TVSeriesService } from "../services";

const HOME_CACHE_MS = 30 * 60 * 1000;

const homeCache = {
  gcTime: HOME_CACHE_MS,
  refetchOnMount: false as const,
  refetchOnWindowFocus: false as const,
  placeholderData: <T,>(p: T | undefined) => p,
};

export function useTVSeriesHome() {
  const tvSeriesService = useRef(new TVSeriesService()).current;

  /**
   * Do not use `initialData: []` with a non-zero `staleTime`: TanStack Query treats
   * that empty array as fresh server data and skips the first fetch until stale.
   */
  const { data: airingToday = [], isFetching: isAiringTodayFetching } = useQuery({
    queryKey: ["airingToday"],
    staleTime: STALE_NOW_PLAYING_MS,
    ...homeCache,
    queryFn: async ({ signal }) => {
      const { results = [] } = await tvSeriesService.getAiringToday(1, {
        signal,
      });
      return results;
    },
  });

  const isLoading = isAiringTodayFetching && airingToday.length === 0;

  const {
    data: onTheAir = [],
    isError: isOnTheAirError,
    refetch: refetchOnTheAir,
  } = useQuery({
    queryKey: ["onTheAir"],
    staleTime: STALE_CATALOG_MEDIUM_MS,
    ...homeCache,
    queryFn: async ({ signal }) => {
      const { results = [] } = await tvSeriesService.getOnTheAir(1, {
        signal,
      });
      return results;
    },
  });

  const {
    data: popular = [],
    isError: isPopularError,
    refetch: refetchPopular,
  } = useQuery({
    queryKey: ["popular"],
    staleTime: STALE_CATALOG_DEFAULT_MS,
    ...homeCache,
    queryFn: async ({ signal }) => {
      const { results = [] } = await tvSeriesService.getPopular(1, {
        signal,
      });
      return results;
    },
  });

  const {
    data: topRated = [],
    isError: isTopRatedError,
    refetch: refetchTopRated,
  } = useQuery({
    queryKey: ["topRated"],
    staleTime: STALE_CATALOG_SLOW_MS,
    ...homeCache,
    queryFn: async ({ signal }) => {
      const { results = [] } = await tvSeriesService.getTopRated(1, {
        signal,
      });
      return results;
    },
  });

  return {
    airingToday,
    onTheAir,
    popular,
    topRated,
    isLoading,
    isOnTheAirError,
    isPopularError,
    isTopRatedError,
    refetchOnTheAir,
    refetchPopular,
    refetchTopRated,
  };
}
