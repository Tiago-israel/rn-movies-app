import { memo, useCallback } from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { Genre } from "../interfaces";
import { Text } from "./text";

export type HomeGenreChipsProps = {
  genres: Genre[];
  onSelectGenre: (genre: Genre) => void;
};

export const HomeGenreChips = memo(function HomeGenreChips({
  genres,
  onSelectGenre,
}: HomeGenreChipsProps) {
  const renderChip = useCallback(
    (g: Genre) => (
      <Pressable
        key={g.id}
        accessibilityRole="button"
        accessibilityLabel={g.name}
        onPress={() => onSelectGenre(g)}
        style={{ flexShrink: 0 }}
        className="mr-2 px-3 py-1.5 rounded-full border border-border bg-overlay active:opacity-80"
      >
        <Text color="foreground" fontSize={13} fontWeight={600} numberOfLines={1}>
          {g.name}
        </Text>
      </Pressable>
    ),
    [onSelectGenre]
  );

  if (!genres.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
    >
      <View className="flex-row">{genres.map(renderChip)}</View>
    </ScrollView>
  );
});
