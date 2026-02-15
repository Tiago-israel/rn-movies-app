import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { TVSeriesService } from "../services";

export function useSeriesCast(seriesId: number) {
  const tvSeriesService = useRef(new TVSeriesService()).current;

  const { data: cast, isFetching: isCastFetching } = useQuery({
    initialData: [],
    queryKey: ["seriesCast", seriesId],
    queryFn: async () => {
      const result = await tvSeriesService.getSeriesCredits(seriesId);
      return result;
    },
  });

  const isLoading = isCastFetching && cast.length === 0;
  return { cast, isLoading };
}
