import { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { STALE_TRENDING_MS } from "../constants/query-stale";
import { trackHomeScrollJank } from "../services/home-performance-telemetry";
import { MoviesService } from "../services";
import type { SearchResultItem } from "../interfaces";

export const TRENDING_HOME_QUERY_KEY = ["trendingAllDay"] as const;

export const HOME_SESSION_ID = "home-session";

const JANK_SCROLL_EVENT_GAP_MS = 64;
const JANK_EMIT_COOLDOWN_MS = 500;

const gcMs = 30 * 60 * 1000;

function toVelocityBucket(velocityY: number): "slow" | "medium" | "fast" {
  const a = Math.abs(velocityY);
  if (a < 0.35) return "slow";
  if (a < 1.2) return "medium";
  return "fast";
}

export function useHomeScrollJankTelemetry(
  sessionId: string = HOME_SESSION_ID
) {
  const lastEventMonotonicMs = useRef<number | null>(null);
  const lastJankAtMs = useRef(0);

  useFocusEffect(
    useCallback(() => {
      lastEventMonotonicMs.current = null;
      lastJankAtMs.current = 0;
    }, [])
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const now =
        typeof e.timeStamp === "number" && Number.isFinite(e.timeStamp)
          ? e.timeStamp
          : Date.now();
      if (lastEventMonotonicMs.current != null) {
        const gap = now - lastEventMonotonicMs.current;
        if (
          gap > JANK_SCROLL_EVENT_GAP_MS &&
          now - lastJankAtMs.current > JANK_EMIT_COOLDOWN_MS
        ) {
          lastJankAtMs.current = now;
          const velY = e.nativeEvent.velocity?.y;
          const vy = typeof velY === "number" && !Number.isNaN(velY) ? velY : 0;
          trackHomeScrollJank({
            sessionId,
            blockId: "home-main-scroll",
            frameDropCount: 1,
            severity: gap > 120 ? "major" : "minor",
            scrollVelocityBucket: toVelocityBucket(vy),
          });
        }
      }
      lastEventMonotonicMs.current = now;
    },
    [sessionId]
  );

  return { onScroll };
}

export function useTrendingHome() {
  const moviesService = new MoviesService();

  const {
    data: trendingItems = [],
    isFetching: trendingLoading,
    isError: trendingError,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: TRENDING_HOME_QUERY_KEY,
    staleTime: STALE_TRENDING_MS,
    gcTime: gcMs,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (p) => p,
    queryFn: async ({ signal }) => {
      const { results = [] } = await moviesService.getTrendingAllDay(1, {
        signal,
      });
      return results.filter(
        (item): item is SearchResultItem =>
          item.mediaType === "movie" || item.mediaType === "tv"
      );
    },
  });

  return { trendingItems, trendingLoading, trendingError, refetchTrending };
}
