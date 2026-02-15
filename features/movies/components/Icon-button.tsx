import { useRef, type ReactNode } from "react";
import { Pressable } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
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
  const { colors } = useTheme<MovieTheme>();
  return (
    <Pressable
      className="w-12 h-12 items-center justify-center overflow-hidden rounded-full bg-secondary"
      onPress={props.onPress}
      onPressIn={() => TapStateRef.current?.setPressed(true)}
      onPressOut={() => TapStateRef.current?.setPressed(false)}
    >
      <TapState ref={TapStateRef} variant="dark" />
      {props.children ? (
        props.children
      ) : (
        <Icon
          name={props.icon}
          color={props.color ?? colors["icon-button"]["on-container"]}
          size={24}
        />
      )}
    </Pressable>
  );
}
