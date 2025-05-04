import { useEffect, useState } from "react";
import { TVSeriesService } from "../services";
import { GenericItem, TVSeriesListItem } from "../interfaces";

export function useTVSeriesHome() {
  const tvSeriesService = new TVSeriesService();
  const [airingToday, setAiringToday] = useState<GenericItem[]>([]);
  const [onTheAir, setOnTheAir] = useState<GenericItem[]>([]);
  const [popular, setPopular] = useState<GenericItem[]>([]);
  const [topRated, setTopRated] = useState<GenericItem[]>([]);

  async function getAiringToday() {
    const response = await tvSeriesService.getAiringToday();
    setAiringToday(response.results);
  }

  async function getOnTheAir() {
    const response = await tvSeriesService.getOnTheAir();
    setOnTheAir(response.results);
  }

  async function getPopular() {
    const response = await tvSeriesService.getPopular();
    setPopular(response.results);
  }

  async function getTopRated() {
    const response = await tvSeriesService.getTopRated();
    setTopRated(response.results);
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
