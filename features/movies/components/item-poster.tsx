import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { PressableScale } from "@/components/PressableScale";

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
  const radius = borderRadius === "none" ? 0 : 8;

  const content = props.posterUrl ? (
    <Image
      source={{ uri: props.posterUrl }}
      style={{ width, height }}
      contentFit="cover"
      recyclingKey={recyclingKey ?? props.posterUrl}
      transition={150}
      cachePolicy="memory-disk"
    />
  ) : (
    <View className="h-full w-full bg-muted" style={{ width, height }} />
  );

  if (!onPress) {
    return (
      <View style={[styles.container, { width, height, borderRadius: radius }]}>
        {content}
      </View>
    );
  }

  return (
    <PressableScale
      style={[styles.container, { width, height, borderRadius: radius }]}
      onPress={onPress}
    >
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
