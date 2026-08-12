import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
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
import { haptics } from "@/lib/haptics";
import type { GenericItem } from "../interfaces";

const MAX_VISIBLE_DOTS = 5;
const DOT_ANIMATION_MS = 220;
/** Max finger movement (px) still counted as a tap, not a swipe. */
const TAP_SLOP = 10;

const GRADIENT_END = "rgba(0,0,0,0.88)";
/** Extra paint under the gradient — Android can leave a hairline while scrolling. */
const GRADIENT_SEAL_PX = 3;
const GRADIENT_HEIGHT_RATIO = 0.42;

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

type HeroSlideProps = {
  item: GenericItem;
  width: number;
  height: number;
  isDraggingRef: MutableRefObject<boolean>;
  onPressItem: (id: number) => void | Promise<void>;
};

/**
 * Gradient lives on the slide (not a fixed overlay) so it stays locked to the
 * image during horizontal paging — fixed overlays leave a 1px hairline on Android.
 */
function HeroSlide({
  item,
  width,
  height,
  isDraggingRef,
  onPressItem,
}: HeroSlideProps) {
  const touchStart = useRef({ x: 0, y: 0 });
  const imageUri = item.backdropPath || item.posterPath;
  const gradientHeight = Math.ceil(height * GRADIENT_HEIGHT_RATIO);

  return (
    <View
      style={{ width, height, overflow: "hidden" }}
      accessibilityRole="button"
      accessibilityLabel={item.title ?? "Open details"}
      onTouchStart={(e) => {
        touchStart.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
      }}
      onTouchEnd={(e) => {
        if (isDraggingRef.current) return;
        const dx = Math.abs(e.nativeEvent.pageX - touchStart.current.x);
        const dy = Math.abs(e.nativeEvent.pageY - touchStart.current.y);
        if (dx > TAP_SLOP || dy > TAP_SLOP) return;
        haptics.light();
        void onPressItem(item.id);
      }}
    >
      <Image
        source={{ uri: imageUri }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={`hero-${item.id}-${imageUri}`}
        transition={200}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["transparent", GRADIENT_END]}
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: gradientHeight,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: GRADIENT_SEAL_PX,
          backgroundColor: GRADIENT_END,
        }}
      />
      {item.title ? (
        <Text
          pointerEvents="none"
          numberOfLines={2}
          style={styles.slideTitle}
        >
          {item.title}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Uses a native horizontal paging ScrollView so Android's nested-scroll /
 * SwipeRefreshLayout stack can distinguish sideways swipes from pull-to-refresh.
 */
export function HeroCarousel({ data, onPressItem }: HeroCarouselProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(() => Math.floor(windowWidth));
  const scrollRef = useRef<ScrollView>(null);
  const isDraggingRef = useRef(false);

  const firstItem = data[0];
  const aspectRatio = firstItem?.backdropPath ? 16 / 9 : 2 / 3;
  const slideHeight = Math.ceil(pageWidth / aspectRatio);

  const onRootLayout = useCallback((e: LayoutChangeEvent) => {
    const next = Math.floor(e.nativeEvent.layout.width);
    if (next > 0) {
      setPageWidth((prev) => (prev === next ? prev : next));
    }
  }, []);

  useEffect(() => {
    const max = Math.max(0, data.length - 1);
    setActiveIndex((prev) => {
      const next = clamp(prev, 0, max);
      scrollRef.current?.scrollTo({ x: next * pageWidth, animated: false });
      return next;
    });
  }, [data.length, pageWidth]);

  const goToPage = useCallback(
    (index: number) => {
      const next = clamp(index, 0, data.length - 1);
      scrollRef.current?.scrollTo({ x: next * pageWidth, animated: true });
      setActiveIndex(next);
    },
    [data.length, pageWidth]
  );

  const onScrollBeginDrag = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      isDraggingRef.current = false;
      const x = e.nativeEvent.contentOffset.x;
      const next = clamp(Math.round(x / pageWidth), 0, data.length - 1);
      setActiveIndex(next);
    },
    [data.length, pageWidth]
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (e.nativeEvent.velocity?.x === 0) {
        isDraggingRef.current = false;
      }
    },
    []
  );

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
    <View
      onLayout={onRootLayout}
      style={{ width: "100%", height: slideHeight, overflow: "hidden" }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        bounces={false}
        overScrollMode="never"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={{ width: pageWidth, height: slideHeight }}
      >
        {data.map((item) => (
          <HeroSlide
            key={item.id}
            item={item}
            width={pageWidth}
            height={slideHeight}
            isDraggingRef={isDraggingRef}
            onPressItem={onPressItem}
          />
        ))}
      </ScrollView>

      {/* Dots only — must not block slide taps outside the pill. */}
      <View pointerEvents="box-none" style={styles.dotsOverlay}>
        <View pointerEvents="box-none" style={styles.dotsRow}>
          <View style={styles.dotsPill}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slideTitle: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 52,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  dotsOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
  },
  dotsRow: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  dotsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
