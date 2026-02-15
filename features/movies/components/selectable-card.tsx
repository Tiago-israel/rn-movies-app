import { useEffect, useState, type ReactNode } from "react";
import { Animated, Pressable, useAnimatedValue } from "react-native";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

export type SelectableCardProps = {
  width?: number;
  height?: number;
  borderRadius?: "lg" | "md" | "sm";
  checked?: boolean;
  children?: ReactNode;
  onPress?: () => void;
};

function useSelectableCard(props: SelectableCardProps) {
  const { colors } = useTheme<MovieTheme>();
  const borderColor = useAnimatedValue(0);
  const [checked, setChecked] = useState(props.checked ?? false);

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.palette.belizeHole],
  });

  function animateBorderColor(checked: boolean) {
    Animated.timing(borderColor, {
      toValue: checked ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  function onPress() {
    setChecked(!checked);
    animateBorderColor(!checked);
    props.onPress?.();
  }

  useEffect(() => {
    setChecked(props.checked ?? false);
    animateBorderColor(props.checked ?? false);
  }, [props.checked]);

  return { animatedBorderColor, onPress };
}

export function SelectableCard(props: SelectableCardProps) {
  const { animatedBorderColor, onPress } = useSelectableCard(props);
  return (
    <Animated.View
      className="rounded-lg overflow-hidden border-4 border-background"
      style={[
        { width: props.width, height: props.height },
        { borderColor: animatedBorderColor },
      ]}
    >
      <Pressable className="w-full h-full" onPress={onPress}>
        {props.children}
      </Pressable>
    </Animated.View>
  );
}
