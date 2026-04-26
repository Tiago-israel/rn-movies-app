import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { PeopleService } from "../services";

export type PersonCredit = {
  id: number;
  posterPath: string;
  title: string;
  mediaType: "movie" | "tv";
};

export function usePerson(id: number) {
  const peopleService = useRef(new PeopleService()).current;

  const { data: person, isFetching: isPersonFetching } = useQuery({
    queryKey: ["person", id],
    queryFn: () => peopleService.getPersonDetails(id),
    enabled: id > 0,
  });

  const isLoading = isPersonFetching && !person?.id;

  const { data: movies } = useQuery({
    initialData: [],
    queryKey: ["moviesCredits", id],
    queryFn: () => peopleService.getMovieCredits(id),
    enabled: id > 0,
  });

  const { data: tvCredits } = useQuery({
    initialData: [],
    queryKey: ["tvCredits", id],
    queryFn: () => peopleService.getTvCredits(id),
    enabled: id > 0,
  });

  const { data: externalMedias } = useQuery({
    initialData: [],
    queryKey: ["externalMedias", id],
    queryFn: () => peopleService.getExternalIds(id),
    enabled: id > 0,
  });

  // Build a combined, deduplicated credits list with media type info
  const credits: PersonCredit[] = (() => {
    const movieCredits: PersonCredit[] = movies.map((m) => ({
      id: m.id,
      posterPath: m.backdropPath,
      title: "",
      mediaType: "movie" as const,
    }));
    const seriesCredits: PersonCredit[] = tvCredits.map((s) => ({
      id: s.id,
      posterPath: s.posterPath,
      title: s.name,
      mediaType: "tv" as const,
    }));
    // Interleave for variety, deduplicate by composite key
    const all = [...movieCredits, ...seriesCredits];
    const seen = new Set<string>();
    return all.filter((c) => {
      const key = `${c.mediaType}-${c.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  return { person, movies, tvCredits, credits, externalMedias, isLoading };
}
