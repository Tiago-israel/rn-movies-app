import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";
import type { SearchResultItem } from "../interfaces";

export const TRENDING_HOME_QUERY_KEY = ["trendingAllDay"] as const;

export function useTrendingHome() {
  const moviesService = new MoviesService();

  const { data: trendingItems = [], isFetching: trendingLoading } = useQuery({
    queryKey: TRENDING_HOME_QUERY_KEY,
    queryFn: async () => {
      const { results = [] } = await moviesService.getTrendingAllDay(1);
      return results.filter(
        (item): item is SearchResultItem =>
          item.mediaType === "movie" || item.mediaType === "tv"
      );
    },
  });

  return { trendingItems, trendingLoading };
}
