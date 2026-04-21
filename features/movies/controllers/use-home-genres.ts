import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";
import type { Genre } from "../interfaces";
import { useUserStore } from "../store";

export function useHomeGenres(catalog: "movie" | "tv") {
  const language = useUserStore((s) => s.language);

  return useQuery<Genre[]>({
    queryKey: ["homeGenres", catalog, language],
    queryFn: async () => {
      const ms = new MoviesService();
      const g =
        catalog === "movie" ? await ms.getGenres() : await ms.getTvGenres();
      return [...g].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 14);
    },
  });
}
