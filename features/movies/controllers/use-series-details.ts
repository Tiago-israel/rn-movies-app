import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { TVSeriesService } from "../services";

export function useSeriesDetails(seriesId: number) {
  const tvSeriesService = useRef(new TVSeriesService()).current;

  const { data: series } = useQuery({
    initialData: {},
    queryKey: ["series", seriesId],
    queryFn: async () => {
      const result = await tvSeriesService.getSeriesDetails(seriesId);
      return result;
    },
  });

  const { data: images } = useQuery({
    initialData: [],
    queryKey: ["seriesImages", seriesId],
    queryFn: async () => {
      const result = await tvSeriesService.getSeriesImages(seriesId);
      return result;
    },
  });

  const { data: recommendations } = useQuery({
    initialData: [],
    queryKey: ["seriesRecommendations", seriesId],
    queryFn: async () => {
      const result = await tvSeriesService.getSeriesRecommendations(seriesId);
      return result;
    },
  });

  const { data: cast } = useQuery({
    initialData: [],
    queryKey: ["seriesCast", seriesId],
    queryFn: async () => {
      const result = await tvSeriesService.getSeriesCredits(seriesId);
      return result;
    },
  });

  const { data: watchProviders } = useQuery({
    initialData: [],
    queryKey: ["seriesWatchProviders", seriesId],
    queryFn: async () => {
      const result = await tvSeriesService.getSeriesWatchProviders(seriesId);
      return result;
    },
  });

  const isFavorite = false;
  const onFavoriteSeries = () => {};

  return {
    series,
    isFavorite,
    recommendations,
    images,
    cast,
    watchProviders,
    onFavoriteSeries,
  };
}
