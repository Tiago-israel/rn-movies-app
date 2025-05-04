import { useEffect, useState, type ReactNode } from "react";
import { Animated, useAnimatedValue } from "react-native";
import { Box } from "./box";
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
  const {colors} = useTheme<MovieTheme>();
  const borderColor = useAnimatedValue(0);
  const [checked, setChecked] = useState(props.checked ?? false);

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, "#2980b9"],
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

  return { animatedBorderColor, animateBorderColor, onPress };
}

export function SelectableCard(props: SelectableCardProps) {
  const { animatedBorderColor, onPress } = useSelectableCard(props);
  return (
    <Box
      as="AnimatedView"
      width={props.width}
      height={props.height}
      borderRadius={"lg"}
      overflow="hidden"
      borderWidth={4}
      style={[{ borderColor: animatedBorderColor }]}
    >
      <Box
        as="Pressable"
        width={"100%"}
        height={"100%"}
        onPress={onPress}
      >
        {props.children}
      </Box>
    </Box>
  );
}
