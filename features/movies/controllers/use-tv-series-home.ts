import { useEffect, useState } from "react";
import { TVSeriesService } from "../services";
import { TVSeriesListItem } from "../interfaces";

export function useTVSeriesHome() {
  const tvSeriesService = new TVSeriesService();
  const [airingToday, setAiringToday] = useState<TVSeriesListItem[]>([]);
  const [onTheAir, setOnTheAir] = useState<TVSeriesListItem[]>([]);
  const [popular, setPopular] = useState<TVSeriesListItem[]>([]);
  const [topRated, setTopRated] = useState<TVSeriesListItem[]>([]);

  async function getAiringToday() {
    const result = await tvSeriesService.getAiringToday();
    setAiringToday(result);
  }

  async function getOnTheAir() {
    const result = await tvSeriesService.getOnTheAir();
    setOnTheAir(result);
  }

  async function getPopular() {
    const result = await tvSeriesService.getPopular();
    setPopular(result);
  }

  async function getTopRated() {
    const result = await tvSeriesService.getTopRated();
    setTopRated(result);
  }

  useEffect(() => {
    getAiringToday();
    getOnTheAir();
    getPopular();
    getTopRated();
  }, []);

  return {
    airingToday,
    onTheAir,
    popular,
    topRated,
  };
}
