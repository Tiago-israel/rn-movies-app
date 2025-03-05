import { Box, Image } from "@/components";
import { DimensionValue } from "react-native";

export type MoviePosterProps = {
  width?: DimensionValue | number;
  height?: DimensionValue | number;
  posterUrl?: string;
  onPress?: () => void | Promise<void>;
};

export function MoviePoster({
  width = 150,
  height = 200,
  ...props
}: MoviePosterProps) {
  return (
    <Box as="Pressable" width={width} height={height} onPress={props.onPress}>
      <Image
        source={{ uri: props.posterUrl }}
        style={{
          width: width,
          height: height,
          borderRadius: 16,
        }}
      />
    </Box>
  );
}
