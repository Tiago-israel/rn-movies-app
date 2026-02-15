import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";

type SkeletonPlaceholderProps = {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonPlaceholder({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonPlaceholderProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#272727",
  },
});
