import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export type ProgressBarProps = {
  progress: number; // 0–100
  height?: number;
};

export function ProgressBar({ progress, height = 4 }: ProgressBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      className="bg-secondary rounded-full overflow-hidden"
      style={{ height }}
    >
      <Animated.View
        className="bg-foreground h-full rounded-full"
        style={{ width: animatedWidth }}
      />
    </View>
  );
}
