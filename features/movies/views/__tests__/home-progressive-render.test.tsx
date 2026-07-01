import { hasRenderableContent } from "../../controllers/home-block-state-mapper";

describe("Home progressive render", () => {
  it("treats content, empty and error blocks as renderable", () => {
    expect(hasRenderableContent("content")).toBe(true);
    expect(hasRenderableContent("empty")).toBe(true);
    expect(hasRenderableContent("error")).toBe(true);
    expect(hasRenderableContent("loading")).toBe(false);
  });
});
