import {
  getHomeScrollOffset,
  setHomeScrollOffset,
} from "@/hooks/use-home-scroll-position";

describe("home return — scroll offset store", () => {
  beforeEach(() => {
    setHomeScrollOffset(0);
  });

  it("persists offset for useHomeScrollPosition / useFocusEffect restore", () => {
    setHomeScrollOffset(128);
    expect(getHomeScrollOffset()).toBe(128);
  });
});
