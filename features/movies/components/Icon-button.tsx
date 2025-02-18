import { useRef, type ReactNode } from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Box } from "./box";
import { TapState, TapStateRef } from "@/components";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

export type IconButtonProps = {
  icon?: any;
  onPress?: () => void | Promise<void>;
  color?: string;
  children?: ReactNode;
};

export function IconButton(props: IconButtonProps) {
  const TapStateRef = useRef<TapStateRef>(null);
  const {
    colors: { components },
  } = useTheme<MovieTheme>();
  return (
    <Box
      as="Pressable"
      width={48}
      height={48}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      borderRadius="full"
      onPress={props.onPress}
      onPressIn={() => TapStateRef.current?.setPressed(true)}
      onPressOut={() => TapStateRef.current?.setPressed(false)}
      backgroundColor="components.icon-button.primary.container.color"
    >
      <TapState ref={TapStateRef} variant="dark" />
      {props.children ? (
        props.children
      ) : (
        <Icon
          name={props.icon}
          color={
            props.color ??
            components["icon-button"].primary["on-container"].color
          }
          size={24}
        />
      )}
    </Box>
  );
}
