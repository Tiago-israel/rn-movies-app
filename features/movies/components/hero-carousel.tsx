import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { ListRenderItemInfo } from "@shopify/flash-list";
import { List } from "@/components";
import { haptics } from "@/lib/haptics";
import type { GenericItem } from "../interfaces";

const MAX_VISIBLE_DOTS = 5;
const DOT_ANIMATION_MS = 220;

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

/**
 * While not on the last item, keep the active pill on the penultimate visible
 * slot so there is always one dot ahead and the window keeps sliding.
 * On the last item, pin the window to the end.
 */
function getWindowStart(activeIndex: number, total: number): number {
  if (total <= MAX_VISIBLE_DOTS) return 0;

  const maxStart = total - MAX_VISIBLE_DOTS;

  if (activeIndex >= total - 1) {
    return maxStart;
  }

  // Active sits at slot (MAX - 2) whenever possible → continuous sliding
  // until the final page, with one dot always ahead.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listRef = useRef<any>(null);
  const activeIndexRef = useRef(0);

  const updateActiveIndex = useCallback((nextIndex: number) => {
    if (nextIndex === activeIndexRef.current) return;
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, []);

  const updateActiveIndexRef = useRef(updateActiveIndex);
  updateActiveIndexRef.current = updateActiveIndex;

  useEffect(() => {
    if (!data.length) return;
    if (activeIndex > data.length - 1) {
      updateActiveIndex(Math.max(0, data.length - 1));
    }
  }, [activeIndex, data.length, updateActiveIndex]);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index;
      if (index == null) return;
      updateActiveIndexRef.current(index);
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const syncIndexFromOffset = useCallback(
    (offsetX: number) => {
      if (width <= 0 || data.length === 0) return;
      const index = Math.round(offsetX / width);
      const clamped = clamp(index, 0, data.length - 1);
      updateActiveIndex(clamped);
    },
    [data.length, updateActiveIndex, width]
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(e.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset]
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(e.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GenericItem>) => {
      const imageUri = item.backdropPath || item.posterPath;
      const aspectRatio = item.backdropPath ? 16 / 9 : 2 / 3;
      const height = width / aspectRatio;

      return (
        <Pressable
          onPress={() => {
            haptics.light();
            onPressItem(item.id);
          }}
          style={{ width }}
          className="overflow-hidden"
          accessibilityRole="button"
          accessibilityLabel={item.title ?? "Open details"}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width, height }}
            contentFit="cover"
            cachePolicy="memory-disk"
            recyclingKey={`hero-${item.id}-${imageUri}`}
            transition={200}
          />
        </Pressable>
      );
    },
    [width, onPressItem]
  );

  const handleBulletPress = useCallback(
    (index: number) => {
      haptics.selection();
      updateActiveIndex(index);
      listRef.current?.scrollToOffset({
        offset: index * width,
        animated: true,
      });
    },
    [updateActiveIndex, width]
  );

  const keyExtractor = useCallback(
    (item: GenericItem) => `hero-${item.id}`,
    []
  );

  if (!data?.length) return null;

  const visibleIndices = getVisiblePageIndices(activeIndex, data.length);

  return (
    <View className="w-full">
      <List<GenericItem>
        innerRef={listRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={width}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
      />
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
