import { getText } from "../localization";
import type { BlockState } from "../types/home-block-state";

export function getHomeStatusMessage(state: BlockState) {
  switch (state) {
    case "loading":
      return getText("home_status_loading");
    case "empty":
      return getText("home_status_empty");
    case "error":
      return getText("home_status_error");
    default:
      return "";
  }
}

export function getHomeRetryLabel() {
  return getText("home_status_retry");
}
