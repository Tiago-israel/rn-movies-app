import { HOME_PERFORMANCE_BENCHMARK } from "../constants/home-performance-benchmark";
import type {
  HomeBlockStateEvent,
  HomeDiscoveryCompletedEvent,
  HomeFirstUsefulContentEvent,
  HomePerformanceEvent,
  HomeScrollJankEvent,
} from "../types/home-performance";

const emit = (event: HomePerformanceEvent) => {
  // Centralized debug emission point until a remote analytics sink is wired.
  if (__DEV__) {
    console.log("[home-telemetry]", event.type, event);
  }
};

export const createHomeFirstUsefulContentEvent = (
  payload: Omit<
    HomeFirstUsefulContentEvent,
    "type" | "timestamp" | "networkProfile" | "deviceTier" | "buildType"
  >
): HomeFirstUsefulContentEvent => ({
  type: "home_first_useful_content",
  timestamp: new Date().toISOString(),
  networkProfile: HOME_PERFORMANCE_BENCHMARK.network.name,
  deviceTier: HOME_PERFORMANCE_BENCHMARK.deviceTier,
  buildType: HOME_PERFORMANCE_BENCHMARK.buildType,
  ...payload,
});

export const createHomeScrollJankEvent = (
  payload: Omit<
    HomeScrollJankEvent,
    "type" | "timestamp" | "networkProfile" | "deviceTier" | "buildType"
  >
): HomeScrollJankEvent => ({
  type: "home_scroll_jank",
  timestamp: new Date().toISOString(),
  networkProfile: HOME_PERFORMANCE_BENCHMARK.network.name,
  deviceTier: HOME_PERFORMANCE_BENCHMARK.deviceTier,
  buildType: HOME_PERFORMANCE_BENCHMARK.buildType,
  ...payload,
});

export const createHomeBlockStateEvent = (
  payload: Omit<HomeBlockStateEvent, "type" | "timestamp">
): HomeBlockStateEvent => ({
  type: "home_block_state",
  timestamp: new Date().toISOString(),
  ...payload,
});

export const createHomeDiscoveryCompletedEvent = (
  payload: Omit<HomeDiscoveryCompletedEvent, "type" | "timestamp">
): HomeDiscoveryCompletedEvent => ({
  type: "home_discovery_completed",
  timestamp: new Date().toISOString(),
  ...payload,
});

export const trackHomeFirstUsefulContent = (
  payload: Omit<
    HomeFirstUsefulContentEvent,
    "type" | "timestamp" | "networkProfile" | "deviceTier" | "buildType"
  >
) => emit(createHomeFirstUsefulContentEvent(payload));

export const trackHomeScrollJank = (
  payload: Omit<
    HomeScrollJankEvent,
    "type" | "timestamp" | "networkProfile" | "deviceTier" | "buildType"
  >
) => emit(createHomeScrollJankEvent(payload));

export const trackHomeBlockState = (
  payload: Omit<HomeBlockStateEvent, "type" | "timestamp">
) => emit(createHomeBlockStateEvent(payload));

export const trackHomeDiscoveryCompleted = (
  payload: Omit<HomeDiscoveryCompletedEvent, "type" | "timestamp">
) => emit(createHomeDiscoveryCompletedEvent(payload));
