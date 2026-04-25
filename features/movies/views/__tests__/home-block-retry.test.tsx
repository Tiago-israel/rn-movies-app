import { createHomeBlockStateEvent } from "../../services/home-performance-telemetry";

describe("Home block retry", () => {
  it("tracks error block transitions with retry metadata", () => {
    const event = createHomeBlockStateEvent({
      sessionId: "session",
      blockId: "trending",
      fromState: "loading",
      toState: "error",
      hasRetryAction: true,
    });

    expect(event.type).toBe("home_block_state");
    expect(event.toState).toBe("error");
    expect(event.hasRetryAction).toBe(true);
  });
});
