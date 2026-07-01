import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import { haptics } from "@/lib/haptics";

export type ItemPosterProps = {
  width?: number;
  height?: number;
  posterUrl?: string;
  borderRadius?: "lg" | "none";
  onPress?: () => void | Promise<void>;
  recyclingKey?: string;
};

export function ItemPoster({
  width = 150,
  height = 200,
  borderRadius = "lg",
  recyclingKey,
  onPress,
  ...props
}: ItemPosterProps) {
  const radiusClass = borderRadius === "none" ? "" : "rounded-lg";
  const Component = onPress ? Pressable : View;
  const handlePress = onPress
    ? () => {
        haptics.light();
        void onPress();
      }
    : undefined;

  return (
    <Component
      className={`overflow-hidden ${radiusClass}`}
      style={{ width, height }}
      onPress={handlePress}
    >
      {props.posterUrl ? (
        <Image
          source={{ uri: props.posterUrl }}
          style={{ width, height }}
          contentFit="cover"
          recyclingKey={recyclingKey ?? props.posterUrl}
          transition={150}
          cachePolicy="memory-disk"
        />
      ) : (
        <View
          className="h-full w-full bg-muted"
          style={{ width, height }}
        />
      )}
    </Component>
  );
}
