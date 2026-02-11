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
import { IconButton } from "./IconButton";

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
      <GestureHandlerRootView className="absolute inset-0">
        <View className="absolute inset-0">
          <Pressable className="absolute inset-0" onPress={animateClose}>
            <Animated.View className="absolute inset-0 bg-black" style={[backdropAnimatedStyle]} />
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
                <View style={styles.closeButton} >
                  <IconButton
                    size="small"
                    icon={"close"}
                    onPress={animateClose}
                  />
                </View>
              </View>
            </GestureDetector>
            <View style={styles.sheetInner}>
              {title != null && (
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
              )}
              <View className="flex-1">{children}</View>
            </View>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  closeButton:{
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1000,
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
});
