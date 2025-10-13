import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { PeopleService } from "../services";

export function usePerson(id: number) {
  const moviesService = useRef(new PeopleService()).current;

  const { data: person } = useQuery({
    queryKey: ["person", id],
    queryFn: async () => {
      const result = await moviesService.getPersonDetails(id);
      return result;
    },
  });

  const { data: movies } = useQuery({
    initialData: [],
    queryKey: ["moviesCredits", id],
    queryFn: async () => {
      const result = await moviesService.getMovieCredits(id);
      return result;
    },
  });

  const { data: externalMedias } = useQuery({
    initialData: [],
    queryKey: ["externalMedias", id],
    queryFn: async () => {
      const result = await moviesService.getExternalIds(id);
      return result;
    },
  });

  return { person, movies, externalMedias };
}
