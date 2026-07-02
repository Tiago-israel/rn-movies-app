import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { haptics } from "@/lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PRESS_SCALE = 0.95;
const PRESS_IN_MS = 70;
const PRESS_OUT_MS = 100;

export type PressableScaleProps = Omit<PressableProps, "onPress" | "style"> & {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void | Promise<void>;
  haptic?: boolean;
};

export function PressableScale({
  onPress,
  style,
  children,
  haptic = true,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(PRESS_SCALE, { duration: PRESS_IN_MS });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: PRESS_OUT_MS });
  };

  const handlePress = () => {
    if (!onPress || disabled) return;

    if (haptic) haptics.light();
    onPress();
  };

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      {children}
    </AnimatedPressable>
  );
}
