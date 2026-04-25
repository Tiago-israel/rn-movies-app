import { getText } from "../localization";
import type { BlockState } from "../types/home-block-state";

export function getHomeStatusA11yLabel(state: BlockState) {
  switch (state) {
    case "loading":
      return getText("home_status_loading_a11y");
    case "empty":
      return getText("home_status_empty_a11y");
    case "error":
      return getText("home_status_error_a11y");
    default:
      return "";
  }
}

export const HOME_STATUS_A11Y_ROLE = "text";
