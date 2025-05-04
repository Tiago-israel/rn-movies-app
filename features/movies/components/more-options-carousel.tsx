import { useRef } from "react";
import { TapState, type TapStateRef } from "@/components";
import { Box } from "./box";
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
  return (
    <Box
      as="Pressable"
      alignItems="center"
      justifyContent="center"
      width={width}
      height={height}
      backgroundColor="rgba(0, 0, 0, 0.5)"
      marginLeft={8}
      borderRadius={borderRadius}
      overflow="hidden"
      gap={8}
      onPressIn={() => {
        ref.current?.setPressed(true);
      }}
      onPressOut={() => {
        ref.current?.setPressed(false);
      }}
      onPress={props.onPress}
    >
      <TapState ref={ref} variant="light"/>
      <IconButton icon={'plus'}/>
      <Text color="onSurface" fontSize={14} fontWeight={700}>
        {getText("show_more")}
      </Text>
    </Box>
  );
}
