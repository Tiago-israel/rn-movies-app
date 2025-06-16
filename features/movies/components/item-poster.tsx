import { Box, Image } from "@/components";
import { ImageProps } from "react-native";

export type ItemPosterProps = {
  width?: number;
  height?: number;
  posterUrl?: string;
  borderRadius?: "lg" | "none";
  onPress?: () => void | Promise<void>;
};

export function ItemPoster({
  width = 150,
  height = 200,
  borderRadius = "lg",
  ...props
}: ItemPosterProps) {
  return (
    <Box
      as={props.onPress ? "Pressable" : "View"}
      width={width}
      height={height}
      onPress={props.onPress}
      overflow="hidden"
      borderRadius={borderRadius}
    >
      <Image
        source={{ uri: props.posterUrl }}
        placeholder={require("../assets/placeholder.png")}
        style={{
          width: width,
          height: height,
        }}
      />
    </Box>
  );
}
