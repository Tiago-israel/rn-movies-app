import { useRef, useCallback, type ReactNode } from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { haptics } from "@/lib/haptics";
import { Box } from "./Box";
import { TapState, TapStateRef } from "./TapState";

export type IconButtonProps = {
  icon?: any;
  onPress?: () => void | Promise<void>;
  size?: "small" | "medium" | "large";
  children?: ReactNode;
};

export function IconButton({ size: sizeProp, onPress: onPressProp, children, icon }: IconButtonProps) {
  const TapStateRef = useRef<TapStateRef>(null);
  const size = sizeProp || "medium";
  const width = size === "small" ? 32 : size === "medium" ? 48 : 64;
  const height = size === "small" ? 32 : size === "medium" ? 48 : 64;
  const onPress = useCallback(() => {
    if (onPressProp) {
      haptics.light();
      void onPressProp();
    }
  }, [onPressProp]);
  return (
    <Box
      as="Pressable"
      width={width}
      height={height}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      borderRadius="full"
      onPress={onPress}
      onPressIn={() => TapStateRef.current?.setPressed(true)}
      onPressOut={() => TapStateRef.current?.setPressed(false)}
      backgroundColor="#fff"
    >
      <TapState ref={TapStateRef} variant="dark" />
      {children ? children : <Icon name={icon} size={24} />}
    </Box>
  );
}
