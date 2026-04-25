import { getHomeStatusA11yLabel } from "../../constants/home-status-a11y";

describe("Home status accessibility labels", () => {
  it("returns labels for all non-content states", () => {
    expect(getHomeStatusA11yLabel("loading")).toBeTruthy();
    expect(getHomeStatusA11yLabel("empty")).toBeTruthy();
    expect(getHomeStatusA11yLabel("error")).toBeTruthy();
  });
});
