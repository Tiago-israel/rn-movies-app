export type HomeBenchmarkNetworkProfile = {
  name: string;
  latencyMs: number;
  bandwidthKbps: number;
};

export type HomeBenchmarkConfig = {
  network: HomeBenchmarkNetworkProfile;
  deviceTier: "entry" | "mid" | "high";
  buildType: "debug" | "release";
  sampleSize: number;
};

export const HOME_PERFORMANCE_BENCHMARK: HomeBenchmarkConfig = {
  network: {
    name: "normal",
    latencyMs: 120,
    bandwidthKbps: 5000,
  },
  deviceTier: "entry",
  buildType: "release",
  sampleSize: 5,
};
