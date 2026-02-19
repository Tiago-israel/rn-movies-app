import { useEffect, useRef, useState } from "react";
import { View, Pressable, Animated, Easing } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { Text } from "./text";

export type StatCardProps = {
  title: string;
  value: number | string;
  icon?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  animated?: boolean;
};

export function StatCard(props: StatCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (props.animated && typeof props.value === "number") {
      // Count-up animation
      const duration = 1500;
      const steps = 60;
      const targetValue = props.value as number;
      const increment = targetValue / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setDisplayValue(targetValue);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setDisplayValue(typeof props.value === "number" ? props.value : 0);
    }
  }, [props.value, props.animated]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    props.onPress?.();
  };

  return (
    <Pressable onPress={props.onPress ? handlePress : undefined} className="flex-1">
      <Animated.View
        className="flex-1 bg-card rounded-lg p-xs justify-between"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View className="flex-row justify-between">
          <Text color="card-foreground" style={{ fontSize: 12 }}>
            {props.title}
          </Text>
          {props.onPress && (
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
              <Icon size={16} name="arrow-top-right" color="#fff" />
            </View>
          )}
        </View>
        <View>
          {typeof props.value === "number" && props.animated ? (
            <Text
              color="foreground"
              style={{ fontSize: 24, fontWeight: "bold" }}
            >
              {displayValue.toLocaleString()}
            </Text>
          ) : (
            <Text
              color="foreground"
              style={{ fontSize: 24, fontWeight: "bold" }}
            >
              {props.value}
            </Text>
          )}
          {props.children}
        </View>
      </Animated.View>
    </Pressable>
  );
}
