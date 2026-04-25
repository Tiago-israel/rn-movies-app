import { mapHomeBlockState } from "../home-block-state-mapper";

describe("mapHomeBlockState", () => {
  it("maps loading state when no data", () => {
    const block = mapHomeBlockState({
      id: "popular_movies",
      title: "Popular",
      items: [],
      isLoading: true,
      hasError: false,
    });

    expect(block.state).toBe("loading");
  });

  it("maps empty state when loaded with no items", () => {
    const block = mapHomeBlockState({
      id: "popular_movies",
      title: "Popular",
      items: [],
      isLoading: false,
      hasError: false,
    });

    expect(block.state).toBe("empty");
  });

  it("maps error state with fallback code", () => {
    const block = mapHomeBlockState({
      id: "popular_movies",
      title: "Popular",
      items: [],
      isLoading: false,
      hasError: true,
    });

    expect(block.state).toBe("error");
    expect(block.errorCode).toBe("unknown");
  });
});
