import { TVSeriesListItemResponse } from "./tv-series-list-item.response";

export type PersonTvCreditsResponse = {
  cast: Array<TVSeriesListItemResponse>;
  crew: Array<TVSeriesListItemResponse>;
};
