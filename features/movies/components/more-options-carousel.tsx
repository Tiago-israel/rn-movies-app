import { useRef } from "react";
import { View, Pressable } from "react-native";
import { TapState, type TapStateRef } from "@/components";
import { Text } from "./text";
import { getText } from "../localization";
import { IconButton } from "./Icon-button";

export type MoreOptionsCarouselProps = {
  width?: number;
  height?: number;
  borderRadius?: "lg" | "none";
  onPress: () => void | Promise<void>;
};

export function MoreOptionsCarousel({
  width = 150,
  height = 200,
  borderRadius = "lg",
  ...props
}: MoreOptionsCarouselProps) {
  const ref = useRef<TapStateRef>(null);
  const radiusClass = borderRadius === "none" ? "" : "rounded-lg";
  return (
    <Pressable
      className={`items-center justify-center overflow-hidden gap-2 ml-2 ${radiusClass}`}
      style={{
        width,
        height,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onPressIn={() => {
        ref.current?.setPressed(true);
      }}
      onPressOut={() => {
        ref.current?.setPressed(false);
      }}
      onPress={props.onPress}
    >
      <TapState ref={ref} variant="light" />
      <IconButton icon="plus" />
      <Text color="foreground" fontSize={14} fontWeight={700}>
        {getText("show_more")}
      </Text>
    </Pressable>
  );
}
