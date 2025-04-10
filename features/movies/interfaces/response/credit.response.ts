import { CastResponse } from "./cast.response";

export type CreditResponse = {
  id: number;
  cast: Array<CastResponse>;
};
