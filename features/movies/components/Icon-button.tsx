import { useRef, useCallback, type ReactNode } from "react";
import { Pressable } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { TapState, TapStateRef } from "@/components";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

export type IconButtonProps = {
  icon?: any;
  onPress?: () => void | Promise<void>;
  color?: string;
  children?: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
};

export function IconButton({
  icon,
  onPress: onPressProp,
  color,
  children,
  testID,
  accessibilityLabel,
}: IconButtonProps) {
  const TapStateRef = useRef<TapStateRef>(null);
  const { colors } = useTheme<MovieTheme>();
  const onPress = useCallback(() => {
    if (onPressProp) {
      haptics.light();
      void onPressProp();
    }
  }, [onPressProp]);
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={`w-12 h-12 items-center justify-center rounded-full bg-secondary ${
        children ? "overflow-visible" : "overflow-hidden"
      }`}
      onPress={onPress}
      onPressIn={() => TapStateRef.current?.setPressed(true)}
      onPressOut={() => TapStateRef.current?.setPressed(false)}
    >
      <TapState ref={TapStateRef} variant="dark" />
      {children ? (
        children
      ) : (
        <Icon
          name={icon}
          color={color ?? colors["icon-button"]["on-container"]}
          size={24}
        />
      )}
    </Pressable>
  );
}
