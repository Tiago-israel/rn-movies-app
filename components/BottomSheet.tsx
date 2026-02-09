import { useCallback, useEffect } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SPRING_CONFIG = {
  damping: 28,
  stiffness: 180,
  overshootClamping: true,
};

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Height of the sheet as fraction of screen (0.5 = 50%). Default 0.6 */
  heightRatio?: number;
};

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  heightRatio = 0.6,
}: BottomSheetProps) {
  const sheetHeight = SCREEN_HEIGHT * heightRatio;
  const translateY = useSharedValue(sheetHeight);
  const backdropOpacity = useSharedValue(0);

  const closeSheet = useCallback(() => {
    onClose();
  }, [onClose]);

  const animateClose = useCallback(() => {
    translateY.value = withSpring(
      sheetHeight,
      SPRING_CONFIG,
      () => runOnJS(closeSheet)(),
    );
    backdropOpacity.value = withTiming(0, { duration: 200 });
  }, [sheetHeight, translateY, backdropOpacity, closeSheet]);

  useEffect(() => {
    if (visible) {
      translateY.value = sheetHeight;
      backdropOpacity.value = 0;
      translateY.value = withSpring(0, SPRING_CONFIG);
      backdropOpacity.value = withTiming(0.5, { duration: 200 });
    } else {
      translateY.value = withSpring(sheetHeight, SPRING_CONFIG);
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, sheetHeight, translateY, backdropOpacity]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      const shouldClose =
        e.translationY > sheetHeight * 0.25 || e.velocityY > 300;
      if (shouldClose) {
        translateY.value = withSpring(
          sheetHeight,
          SPRING_CONFIG,
          () => runOnJS(closeSheet)(),
        );
        backdropOpacity.value = withTiming(0, { duration: 200 });
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, translateY.value) }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={animateClose}
    >
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={animateClose}>
            <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
          </Pressable>
          <Animated.View
            style={[
              styles.sheet,
              { height: sheetHeight },
              sheetAnimatedStyle,
            ]}
          >
            <GestureDetector gesture={panGesture}>
              <View style={styles.handleArea} collapsable={false}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>
          <View style={styles.sheetInner}>
            {title != null && (
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            )}
            <View style={styles.content}>{children}</View>
          </View>
        </Animated.View>
      </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#1c1c1e",
    overflow: "hidden",
  },
  sheetInner: {
    flex: 1,
    paddingHorizontal: 16,
  },
  handleArea: {
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    paddingVertical: 20,
  },
  content: {
    flex: 1,
  },
});
