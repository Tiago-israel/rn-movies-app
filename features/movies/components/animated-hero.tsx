import { useEffect, useRef } from "react";
import { View, Animated, Easing, Dimensions } from "react-native";
import { Image } from "@/components";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type AnimatedHeroProps = {
  imageUri?: string;
  height?: number;
  children?: React.ReactNode;
};

export function AnimatedHero({
  imageUri,
  height = 240,
  children,
}: AnimatedHeroProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ken Burns zoom effect - subtle continuous zoom in/out
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <View
      className="relative border-b-2 border-border overflow-hidden"
      style={{ height }}
      pointerEvents="box-none"
    >
      <Animated.View
        pointerEvents="none"
        style={{
          width: SCREEN_WIDTH,
          height,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </Animated.View>

      {/* Overlay Content */}
      {children && (
        <View
          className="absolute bottom-0 left-0 right-0 p-sm"
          pointerEvents="box-none"
        >
          {children}
        </View>
      )}
    </View>
  );
}
