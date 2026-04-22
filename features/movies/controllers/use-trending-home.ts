import { useQuery } from "@tanstack/react-query";
import { STALE_TRENDING_MS } from "../constants/query-stale";
import { MoviesService } from "../services";
import type { SearchResultItem } from "../interfaces";

export const TRENDING_HOME_QUERY_KEY = ["trendingAllDay"] as const;

export function useTrendingHome() {
  const moviesService = new MoviesService();

  const { data: trendingItems = [], isFetching: trendingLoading } = useQuery({
    queryKey: TRENDING_HOME_QUERY_KEY,
    staleTime: STALE_TRENDING_MS,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getTrendingAllDay(1, {
        signal,
      });
      return results.filter(
        (item): item is SearchResultItem =>
          item.mediaType === "movie" || item.mediaType === "tv"
      );
    },
  });

  return { trendingItems, trendingLoading };
}
