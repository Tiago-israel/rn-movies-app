import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { TVSeriesService } from "../services";

export function useSeriesDetails(seriesId: number) {
    const tvSeries = useRef(new TVSeriesService()).current;

    const { data: series } = useQuery({
        initialData: {},
        queryKey: ["series", seriesId],
        queryFn: async () => {
            const result = await tvSeries.getTvSeriesDetails(seriesId);
            return result;
        },
    });

    return { series};

}