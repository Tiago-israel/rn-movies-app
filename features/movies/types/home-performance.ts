export type HomeBlockState = "loading" | "content" | "empty" | "error";

export type HomePerformanceBaseEvent = {
  sessionId: string;
  timestamp: string;
  networkProfile: string;
  deviceTier: "entry" | "mid" | "high";
  buildType: "debug" | "release";
};

export type HomeFirstUsefulContentEvent = HomePerformanceBaseEvent & {
  type: "home_first_useful_content";
  timeFromAppOpenMs: number;
};

export type HomeScrollJankEvent = HomePerformanceBaseEvent & {
  type: "home_scroll_jank";
  blockId?: string;
  frameDropCount: number;
  severity: "minor" | "major";
  scrollVelocityBucket: "slow" | "medium" | "fast";
};

export type HomeBlockStateEvent = Omit<
  HomePerformanceBaseEvent,
  "networkProfile" | "deviceTier" | "buildType"
> & {
  type: "home_block_state";
  blockId: string;
  fromState: HomeBlockState;
  toState: HomeBlockState;
  hasRetryAction: boolean;
};

export type HomeDiscoveryCompletedEvent = Omit<
  HomePerformanceBaseEvent,
  "networkProfile" | "deviceTier" | "buildType"
> & {
  type: "home_discovery_completed";
  timeFromAppOpenMs: number;
  firstCarouselId: string;
};

export type HomePerformanceEvent =
  | HomeFirstUsefulContentEvent
  | HomeScrollJankEvent
  | HomeBlockStateEvent
  | HomeDiscoveryCompletedEvent;
