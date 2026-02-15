import { View, Pressable, Image } from "react-native";

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
  const radiusClass = borderRadius === "none" ? "" : "rounded-lg";
  const Component = props.onPress ? Pressable : View;

  return (
    <Component
      className={`overflow-hidden ${radiusClass}`}
      style={{ width, height }}
      onPress={props.onPress}
    >
      <Image
        source={{ uri: props.posterUrl }}
        style={{ width, height }}
      />
    </Component>
  );
}
