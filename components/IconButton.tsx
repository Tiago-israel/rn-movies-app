import { useRef, type ReactNode } from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Box } from "./Box";
import { TapState, TapStateRef } from "./TapState";

export type IconButtonProps = {
  icon?: any;
  onPress?: () => void | Promise<void>;
  children?: ReactNode;
};

export function IconButton(props: IconButtonProps) {
  const TapStateRef = useRef<TapStateRef>(null);
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
      backgroundColor="#fff"
    >
      <TapState ref={TapStateRef} variant="dark" />
      {props.children ? props.children : <Icon name={props.icon} size={24} />}
    </Box>
  );
}
