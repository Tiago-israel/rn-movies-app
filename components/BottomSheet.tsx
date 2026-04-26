import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { haptics } from "@/lib/haptics";
import { IconButton } from "./IconButton";

// ---------------------------------------------------------------------------
// Context — lets children (e.g. ScrollView) report their scroll offset so the
// contentPanGesture can decide whether to move the sheet or let the scroll go.
// ---------------------------------------------------------------------------

type BottomSheetContextValue = {
  scrollY: SharedValue<number>;
  /**
   * Attach this gesture to the ScrollView inside BottomSheet children so that
   * scroll and sheet-drag can fire simultaneously. The contentPanGesture gates
   * sheet movement based on scrollY, so scrolling still works when content is
   * not at the top.
   *
   * Usage:
   *   const { scrollGesture } = useBottomSheetScroll();
   *   <GestureDetector gesture={scrollGesture}>
   *     <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
   */
  scrollGesture: ReturnType<typeof Gesture.Native>;
};
const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function useBottomSheetScroll(): BottomSheetContextValue | null {
  return useContext(BottomSheetContext);
}

/**
 * Drop-in replacement for ScrollView inside a BottomSheet.
 * Automatically wires up scroll-position tracking and gesture coordination so
 * that dragging down from the top of the list dismisses the sheet, while
 * dragging down when the list is scrolled simply scrolls the content.
 */
export function BottomSheetScrollView({
  children,
  ...props
}: ScrollViewProps) {
  const bs = useBottomSheetScroll();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      "worklet";
      if (bs) bs.scrollY.value = e.contentOffset.y;
    },
  });

  const animatedScrollView = (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </Animated.ScrollView>
  );

  if (!bs) return animatedScrollView;

  return (
    <GestureDetector gesture={bs.scrollGesture}>
      {animatedScrollView}
    </GestureDetector>
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/** The Y position when the sheet is fully collapsed (off-screen) */
const COLLAPSED_Y = SCREEN_HEIGHT;

const SPRING_CONFIG = {
  damping: 30,
  stiffness: 200,
  mass: 0.8,
  overshootClamping: false,
};

const SPRING_CONFIG_DISMISS = {
  damping: 28,
  stiffness: 180,
  overshootClamping: true,
};

/** Velocity threshold to trigger a snap in the swipe direction (px/s) */
const VELOCITY_THRESHOLD = 500;

/** Backdrop max opacity when fully expanded */
const BACKDROP_MAX_OPACITY = 0.55;

/** Overscroll allowance above the highest snap point */
const OVERSCROLL_PX = 30;

/** Height of the drag handle area (paddingTop 16 + paddingBottom 12 + track 20) */
const HANDLE_AREA_HEIGHT = 48;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /**
   * Height of the sheet as fraction of screen (0–1). Default 0.6.
   * Ignored when `snapPoints` is provided.
   */
  heightRatio?: number;
  /**
   * Custom snap-point fractions of screen height (ascending order).
   * E.g. `[0.5, 0.9]` → half-screen and near-full.
   * The sheet can always be dismissed by swiping below the lowest snap point.
   */
  snapPoints?: number[];
  /** Index into `snapPoints` (0-based) to snap to when the sheet opens. Default 0. */
  initialSnapIndex?: number;
  /** Fires whenever the sheet settles on a new snap point. */
  onSnapChange?: (index: number) => void;
  /** Allow dragging the content area in addition to the handle. Default false. */
  enableContentDrag?: boolean;
};

// ---------------------------------------------------------------------------
// Helpers — marked as worklets so they run safely on the UI thread
// ---------------------------------------------------------------------------

function fractionsToYPositions(fractions: number[]): number[] {
  return fractions.map((f) => SCREEN_HEIGHT * (1 - f));
}

function nearestSnap(y: number, snaps: number[]): number {
  "worklet";
  let best = snaps[0];
  let bestDist = Math.abs(y - best);
  for (let i = 1; i < snaps.length; i++) {
    const d = Math.abs(y - snaps[i]);
    if (d < bestDist) {
      best = snaps[i];
      bestDist = d;
    }
  }
  return best;
}

function resolveSnap(
  currentY: number,
  velocityY: number,
  snapYs: number[],
): number {
  "worklet";
  // Manual sort (no spread/filter inside worklets for safety)
  const sorted: number[] = [];
  for (let i = 0; i < snapYs.length; i++) sorted.push(snapYs[i]);
  sorted.sort((a, b) => a - b);

  if (Math.abs(velocityY) > VELOCITY_THRESHOLD) {
    if (velocityY > 0) {
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] > currentY + 1) return sorted[i];
      }
      return COLLAPSED_Y;
    } else {
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i] < currentY - 1) return sorted[i];
      }
      return sorted[0];
    }
  }

  const lowestSnap = sorted[sorted.length - 1];
  const dismissThreshold = lowestSnap + (COLLAPSED_Y - lowestSnap) * 0.35;
  if (currentY > dismissThreshold) return COLLAPSED_Y;

  return nearestSnap(currentY, sorted);
}

function findSnapIndex(target: number, snapYs: number[]): number {
  "worklet";
  let bestIdx = 0;
  let bestDist = Math.abs(target - snapYs[0]);
  for (let i = 1; i < snapYs.length; i++) {
    const d = Math.abs(target - snapYs[i]);
    if (d < bestDist) {
      bestIdx = i;
      bestDist = d;
    }
  }
  return bestIdx;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  heightRatio = 0.6,
  snapPoints: snapPointsProp,
  initialSnapIndex = 0,
  onSnapChange,
  enableContentDrag = false,
}: BottomSheetProps) {
  // Resolve snap points (fractions → Y positions)
  const snapFractions = useMemo(
    () =>
      snapPointsProp && snapPointsProp.length > 0
        ? [...snapPointsProp].sort((a, b) => a - b)
        : [heightRatio],
    [snapPointsProp, heightRatio],
  );

  const snapYPositions = useMemo(
    () => fractionsToYPositions(snapFractions),
    [snapFractions],
  );

  const clampedInitialIndex = Math.min(
    initialSnapIndex,
    snapYPositions.length - 1,
  );
  const initialY = snapYPositions[clampedInitialIndex];

  const highestSnapY = useMemo(
    () => Math.min(...snapYPositions),
    [snapYPositions],
  );

  const sheetHeight = SCREEN_HEIGHT - highestSnapY + OVERSCROLL_PX;

  // -----------------------------------------------------------------------
  // Shared values — gesture objects read from these to stay stable
  // -----------------------------------------------------------------------

  const translateY = useSharedValue(COLLAPSED_Y);
  const gestureStartY = useSharedValue(0);
  const currentSnapIndex = useSharedValue(clampedInitialIndex);

  // Config shared values updated via useEffect — gestures never need recreation
  const snapYPositionsSV = useSharedValue<number[]>(snapYPositions);
  const highestSnapYSV = useSharedValue(highestSnapY);

  // Tracks the vertical scroll offset of any scrollable child.
  // Children access this via useBottomSheetScroll() to update it.
  const scrollY = useSharedValue(0);

  // Native gesture that wraps the consumer's ScrollView.
  // contentPanGesture runs simultaneously with it, so both scroll and
  // drag-to-close can fire at the same time; scrollY gates sheet movement.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollGesture = useMemo(() => Gesture.Native(), []);

  useEffect(() => {
    snapYPositionsSV.value = snapYPositions;
    highestSnapYSV.value = highestSnapY;
  }, [snapYPositions, highestSnapY, snapYPositionsSV, highestSnapYSV]);

  // -----------------------------------------------------------------------
  // Stable JS callbacks via refs — gesture objects can have empty deps
  // -----------------------------------------------------------------------

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onSnapChangeRef = useRef(onSnapChange);
  onSnapChangeRef.current = onSnapChange;

  // Empty deps → stable references across all renders
  const closeSheet = useCallback(() => {
    onCloseRef.current();
  }, []);

  const fireSnapChange = useCallback((index: number) => {
    onSnapChangeRef.current?.(index);
  }, []);

  const triggerHaptic = useCallback(() => {
    haptics.light();
  }, []);

  // -----------------------------------------------------------------------
  // Open / Close animations
  // -----------------------------------------------------------------------

  const animateOpen = useCallback(() => {
    translateY.value = COLLAPSED_Y;
    translateY.value = withSpring(initialY, SPRING_CONFIG);
  }, [translateY, initialY]);

  const animateClose = useCallback(() => {
    translateY.value = withSpring(
      COLLAPSED_Y,
      SPRING_CONFIG_DISMISS,
      (finished) => {
        if (finished) runOnJS(closeSheet)();
      },
    );
  }, [translateY, closeSheet]);

  useEffect(() => {
    if (visible) {
      scrollY.value = 0;
      currentSnapIndex.value = clampedInitialIndex;
      animateOpen();
    } else {
      translateY.value = withSpring(COLLAPSED_Y, SPRING_CONFIG_DISMISS);
    }
  }, [
    visible,
    animateOpen,
    translateY,
    currentSnapIndex,
    clampedInitialIndex,
    scrollY,
  ]);

  // -----------------------------------------------------------------------
  // Gestures — created ONCE at mount (empty deps).
  // All values read via stable shared values or stable callbacks.
  // -----------------------------------------------------------------------

  const handlePanGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .failOffsetX([-18, 18])
        .onStart(() => {
          "worklet";
          gestureStartY.value = translateY.value;
        })
        .onUpdate((e) => {
          "worklet";
          const newY = gestureStartY.value + e.translationY;
          translateY.value = Math.max(
            highestSnapYSV.value - OVERSCROLL_PX,
            newY,
          );
        })
        .onEnd((e) => {
          "worklet";
          const target = resolveSnap(
            translateY.value,
            e.velocityY,
            snapYPositionsSV.value,
          );
          if (target === COLLAPSED_Y) {
            translateY.value = withSpring(
              COLLAPSED_Y,
              SPRING_CONFIG_DISMISS,
              (finished) => {
                "worklet";
                if (finished) {
                  runOnJS(triggerHaptic)();
                  runOnJS(closeSheet)();
                }
              },
            );
            return;
          }
          const snapIdx = findSnapIndex(target, snapYPositionsSV.value);
          const prevIdx = currentSnapIndex.value;
          translateY.value = withSpring(target, SPRING_CONFIG, (finished) => {
            "worklet";
            if (finished && snapIdx !== prevIdx) {
              currentSnapIndex.value = snapIdx;
              runOnJS(triggerHaptic)();
              runOnJS(fireSnapChange)(snapIdx);
            }
          });
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const contentPanGesture = useMemo(
    () =>
      Gesture.Pan()
        // Only activate for downward movement so upward scroll is never blocked
        .activeOffsetY([0, 10])
        .failOffsetX([-18, 18])
        // Run simultaneously with the ScrollView's native gesture so that
        // when we don't move the sheet, the scroll still propagates.
        .simultaneousWithExternalGesture(scrollGesture)
        .onStart(() => {
          "worklet";
          gestureStartY.value = translateY.value;
        })
        .onUpdate((e: { translationY: number }) => {
          "worklet";
          // Don't move the sheet when content is scrolled — let scroll handle it
          if (scrollY.value > 1 || e.translationY <= 0) return;
          const newY = gestureStartY.value + e.translationY;
          translateY.value = Math.max(
            highestSnapYSV.value - OVERSCROLL_PX,
            newY,
          );
        })
        .onEnd((e: { translationY: number; velocityY: number }) => {
          "worklet";
          if (scrollY.value > 1 || e.translationY <= 0) return;
          const target = resolveSnap(
            translateY.value,
            e.velocityY,
            snapYPositionsSV.value,
          );
          if (target === COLLAPSED_Y) {
            translateY.value = withSpring(
              COLLAPSED_Y,
              SPRING_CONFIG_DISMISS,
              (finished) => {
                "worklet";
                if (finished) {
                  runOnJS(triggerHaptic)();
                  runOnJS(closeSheet)();
                }
              },
            );
            return;
          }
          const snapIdx = findSnapIndex(target, snapYPositionsSV.value);
          const prevIdx = currentSnapIndex.value;
          translateY.value = withSpring(target, SPRING_CONFIG, (finished) => {
            "worklet";
            if (finished && snapIdx !== prevIdx) {
              currentSnapIndex.value = snapIdx;
              runOnJS(triggerHaptic)();
              runOnJS(fireSnapChange)(snapIdx);
            }
          });
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // -----------------------------------------------------------------------
  // Animated styles
  // -----------------------------------------------------------------------

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.max(
          highestSnapYSV.value - OVERSCROLL_PX,
          translateY.value,
        ),
      },
    ],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [COLLAPSED_Y, highestSnapYSV.value],
      [0, BACKDROP_MAX_OPACITY],
      "clamp",
    ),
  }));

  // Derives the visible content height from the current sheet position so that
  // any ScrollView inside knows exactly how much space it actually has.
  const contentHeightStyle = useAnimatedStyle(() => ({
    height: Math.max(0, SCREEN_HEIGHT - translateY.value - HANDLE_AREA_HEIGHT),
  }));

  // -----------------------------------------------------------------------
  // Content wrapper: optionally draggable
  // -----------------------------------------------------------------------

  const sheetContent = (
    <Animated.View style={[styles.sheetInner, contentHeightStyle]}>
      {title != null && (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}
      <View style={styles.contentContainer}>{children}</View>
    </Animated.View>
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <BottomSheetContext.Provider value={{ scrollY, scrollGesture }}>
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={animateClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.root}>
          {/* Backdrop */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              haptics.light();
              animateClose();
            }}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.backdrop,
                backdropAnimatedStyle,
              ]}
            />
          </Pressable>

          {/* Sheet */}
          <Animated.View
            style={[
              styles.sheet,
              { height: sheetHeight },
              sheetAnimatedStyle,
            ]}
          >
            {/* Drag handle area (always draggable) */}
            <GestureDetector gesture={handlePanGesture}>
              <View style={styles.handleArea} collapsable={false}>
                <View style={styles.handleTrack}>
                  <View style={styles.handle} />
                </View>
                <View style={styles.closeButton}>
                  <IconButton
                    size="small"
                    icon="close"
                    onPress={animateClose}
                  />
                </View>
              </View>
            </GestureDetector>

            {/* Content area */}
            {enableContentDrag ? (
              <GestureDetector gesture={contentPanGesture}>
                <Animated.View style={styles.contentWrapper}>
                  {sheetContent}
                </Animated.View>
              </GestureDetector>
            ) : (
              sheetContent
            )}
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
    </BottomSheetContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: "#000",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#1c1c1e",
    overflow: "hidden",
  },
  handleArea: {
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  handleTrack: {
    width: 48,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 1000,
  },
  sheetInner: {
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
  },
  contentWrapper: {
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    paddingVertical: 16,
  },
});
