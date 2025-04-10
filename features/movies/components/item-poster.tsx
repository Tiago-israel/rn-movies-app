import { Box, Image } from "@/components";
import { DimensionValue } from "react-native";

export type ItemPosterProps = {
  width?: DimensionValue | number;
  height?: DimensionValue | number;
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
        style={{
          width: width,
          height: height,
        }}
      />
    </Box>
  );
}
