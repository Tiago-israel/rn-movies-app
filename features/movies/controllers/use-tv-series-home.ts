import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TVSeriesService } from "../services";
import { GenericItem } from "../interfaces";

export function useTVSeriesHome() {
  const tvSeriesService = useRef(new TVSeriesService()).current;

  const { data: airingToday } = useQuery({
    initialData: [],
    queryKey: ["airingToday"],
    queryFn: async () => {
      const { results = [] } = await tvSeriesService.getAiringToday();
      return results;
    },
  });

  const { data: onTheAir } = useQuery({
    initialData: [],
    queryKey: ["onTheAir"],
    queryFn: async () => {
      const { results = [] } = await tvSeriesService.getOnTheAir();
      return results
    }
  });

  const { data: popular } = useQuery({
    initialData: [],
    queryKey: ["popular"],
    queryFn: async () => {
      const { results = [] } = await tvSeriesService.getPopular();
      return results;
    },
  });

  const { data: topRated } = useQuery({
    initialData: [],
    queryKey: ["topRated"],
    queryFn: async () => {
      const { results = [] } = await tvSeriesService.getTopRated();
      return results;
    },
  });

  return {
    airingToday,
    onTheAir,
    popular,
    topRated,
  };
}
