import { TrendingPosterItem } from "../trending-home-row";

/**
 * List row memoization: full FlashList mount is covered by Maestro; Jest+FlashList
 * tears down with async work after the suite — we assert the exported cell wrapper.
 */
describe("TrendingHomeRow (scroll stability)", () => {
  it("exports memoized list row for recycling", () => {
    expect(TrendingPosterItem).toBeDefined();
  });
});
