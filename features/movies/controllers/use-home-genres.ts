import { useQuery } from "@tanstack/react-query";
import { STALE_CATALOG_SLOW_MS } from "../constants/query-stale";
import { MoviesService } from "../services";
import type { Genre } from "../interfaces";
import { useUserStore } from "../store";

export function useHomeGenres(catalog: "movie" | "tv") {
  const language = useUserStore((s) => s.language);

  return useQuery<Genre[]>({
    queryKey: ["homeGenres", catalog, language],
    staleTime: STALE_CATALOG_SLOW_MS,
    queryFn: async ({ signal }) => {
      const ms = new MoviesService();
      const g =
        catalog === "movie"
          ? await ms.getGenres({ signal })
          : await ms.getTvGenres({ signal });
      return [...g].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 14);
    },
  });
}
