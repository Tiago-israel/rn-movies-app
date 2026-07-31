import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { haptics } from "@/lib/haptics";
import type { GenericItem } from "../interfaces";

const MAX_VISIBLE_DOTS = 5;
const DOT_ANIMATION_MS = 220;
const PAGE_ANIMATION_MS = 240;
/** Pan activates only after clear horizontal movement. */
const ACTIVE_OFFSET_X = 12;
/** If vertical movement wins first, pan fails and parent scroll keeps the gesture. */
const FAIL_OFFSET_Y = 10;

const DOT_ACTIVE = { width: 24, height: 8, opacity: 1 };
const DOT_MEDIUM = { width: 6, height: 6, opacity: 0.5 };
const DOT_SMALL = { width: 4, height: 4, opacity: 0.4 };

type HeroCarouselProps = {
  data: GenericItem[];
  onPressItem: (id: number) => void | Promise<void>;
};

type DotVariant = "active" | "medium" | "small";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getWindowStart(activeIndex: number, total: number): number {
  if (total <= MAX_VISIBLE_DOTS) return 0;

  const maxStart = total - MAX_VISIBLE_DOTS;

  if (activeIndex >= total - 1) {
    return maxStart;
  }

  return clamp(activeIndex - (MAX_VISIBLE_DOTS - 2), 0, maxStart);
}

function getVisiblePageIndices(activeIndex: number, total: number): number[] {
  const visibleCount = Math.min(MAX_VISIBLE_DOTS, total);
  const start = getWindowStart(activeIndex, total);
  return Array.from({ length: visibleCount }, (_, i) => start + i);
}

function getDotVariant(
  pageIndex: number,
  activeIndex: number,
  visibleIndices: number[],
  total: number
): DotVariant {
  if (pageIndex === activeIndex) return "active";

  const position = visibleIndices.indexOf(pageIndex);
  const activePosition = visibleIndices.indexOf(activeIndex);
  const distance = Math.abs(position - activePosition);

  const isLeadingEdge = position === 0 && visibleIndices[0] > 0;
  const isTrailingEdge =
    position === visibleIndices.length - 1 &&
    visibleIndices[visibleIndices.length - 1] < total - 1;

  if (isLeadingEdge || isTrailingEdge || distance >= 2) {
    return "small";
  }

  return "medium";
}

function getDotStyle(variant: DotVariant) {
  if (variant === "active") return DOT_ACTIVE;
  if (variant === "medium") return DOT_MEDIUM;
  return DOT_SMALL;
}

type HeroCarouselDotProps = {
  variant: DotVariant;
  onPress: () => void;
  accessibilityLabel: string;
  selected: boolean;
};

function HeroCarouselDot({
  variant,
  onPress,
  accessibilityLabel,
  selected,
}: HeroCarouselDotProps) {
  const target = getDotStyle(variant);
  const width = useSharedValue(target.width);
  const height = useSharedValue(target.height);
  const opacity = useSharedValue(target.opacity);

  useEffect(() => {
    const config = { duration: DOT_ANIMATION_MS };
    width.value = withTiming(target.width, config);
    height.value = withTiming(target.height, config);
    opacity.value = withTiming(target.opacity, config);
  }, [target.width, target.height, target.opacity, width, height, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    opacity: opacity.value,
    borderRadius: 999,
    backgroundColor: "#fff",
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(DOT_ANIMATION_MS)}
      exiting={FadeOut.duration(DOT_ANIMATION_MS)}
      layout={LinearTransition.duration(DOT_ANIMATION_MS)}
    >
      <Pressable
        onPress={onPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected }}
      >
        <Animated.View style={animatedStyle} />
      </Pressable>
    </Animated.View>
  );
}

export function HeroCarousel({ data, onPressItem }: HeroCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const translateX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const pageIndexSV = useSharedValue(0);
  const pageWidthSV = useSharedValue(width);
  const pageCountSV = useSharedValue(data.length);

  const firstItem = data[0];
  const aspectRatio = firstItem?.backdropPath ? 16 / 9 : 2 / 3;
  const slideHeight = width / aspectRatio;

  useEffect(() => {
    pageWidthSV.value = width;
    pageCountSV.value = data.length;
  }, [data.length, pageCountSV, pageWidthSV, width]);

  useEffect(() => {
    const max = Math.max(0, data.length - 1);
    setActiveIndex((prev) => {
      const next = clamp(prev, 0, max);
      pageIndexSV.value = next;
      translateX.value = -next * width;
      return next;
    });
  }, [data.length, pageIndexSV, translateX, width]);

  const commitPage = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goToPage = useCallback(
    (index: number) => {
      const next = clamp(index, 0, data.length - 1);
      pageIndexSV.value = next;
      translateX.value = withTiming(-next * width, {
        duration: PAGE_ANIMATION_MS,
      });
      setActiveIndex(next);
    },
    [data.length, pageIndexSV, translateX, width]
  );

  const pan = Gesture.Pan()
    .activeOffsetX([-ACTIVE_OFFSET_X, ACTIVE_OFFSET_X])
    .failOffsetY([-FAIL_OFFSET_Y, FAIL_OFFSET_Y])
    .onBegin(() => {
      dragStartX.value = translateX.value;
    })
    .onUpdate((e) => {
      const maxOffset = 0;
      const minOffset = -Math.max(0, pageCountSV.value - 1) * pageWidthSV.value;
      const next = dragStartX.value + e.translationX;
      translateX.value = Math.max(minOffset, Math.min(maxOffset, next));
    })
    .onEnd((e) => {
      const widthPx = pageWidthSV.value;
      const count = pageCountSV.value;
      const current = pageIndexSV.value;
      const threshold = widthPx * 0.22;
      let next = current;

      if (e.translationX < -threshold || e.velocityX < -600) {
        next = current + 1;
      } else if (e.translationX > threshold || e.velocityX > 600) {
        next = current - 1;
      }

      next = Math.max(0, Math.min(next, count - 1));
      pageIndexSV.value = next;
      translateX.value = withTiming(-next * widthPx, {
        duration: PAGE_ANIMATION_MS,
      });
      runOnJS(commitPage)(next);
    });

  const trackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleBulletPress = useCallback(
    (index: number) => {
      haptics.selection();
      goToPage(index);
    },
    [goToPage]
  );

  if (!data?.length) return null;

  const visibleIndices = getVisiblePageIndices(activeIndex, data.length);

  return (
    <View style={{ width, height: slideHeight }}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={{ width, height: slideHeight, overflow: "hidden" }}
        >
          <Animated.View
            style={[
              {
                flexDirection: "row",
                height: slideHeight,
                width: width * data.length,
              },
              trackStyle,
            ]}
          >
            {data.map((item) => {
              const imageUri = item.backdropPath || item.posterPath;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    haptics.light();
                    onPressItem(item.id);
                  }}
                  style={{ width, height: slideHeight }}
                  accessibilityRole="button"
                  accessibilityLabel={item.title ?? "Open details"}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width, height: slideHeight }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    recyclingKey={`hero-${item.id}-${imageUri}`}
                    transition={200}
                  />
                </Pressable>
              );
            })}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.88)"]}
        pointerEvents="box-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 20,
          paddingTop: 56,
        }}
      >
        {data[activeIndex]?.title ? (
          <Text
            className="px-4 text-xl font-bold text-white"
            numberOfLines={2}
          >
            {data[activeIndex].title}
          </Text>
        ) : null}
        <View className="mt-4 flex-row justify-center px-4">
          <View className="flex-row items-center gap-2 rounded-full bg-black/40 px-3 py-2">
            {visibleIndices.map((pageIndex) => {
              const variant = getDotVariant(
                pageIndex,
                activeIndex,
                visibleIndices,
                data.length
              );

              return (
                <HeroCarouselDot
                  key={pageIndex}
                  variant={variant}
                  selected={variant === "active"}
                  accessibilityLabel={`Slide ${pageIndex + 1} of ${data.length}`}
                  onPress={() => handleBulletPress(pageIndex)}
                />
              );
            })}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
