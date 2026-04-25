import { useCallback, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

let homeScrollY = 0;

export function getHomeScrollOffset() {
  return homeScrollY;
}

export function setHomeScrollOffset(y: number) {
  homeScrollY = y;
}

export function useHomeScrollPosition() {
  const scrollRef = useRef<ScrollView | null>(null);
  const yRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const y = getHomeScrollOffset();
      const id = requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y, animated: false });
      });
      return () => {
        cancelAnimationFrame(id);
        setHomeScrollOffset(yRef.current);
      };
    }, [])
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      yRef.current = e.nativeEvent.contentOffset.y;
    },
    []
  );

  return { scrollRef, onScroll };
}
