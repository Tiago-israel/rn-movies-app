import { memo, useCallback } from "react";
import { Pressable, View } from "react-native";
import { List } from "@/components";
import { haptics } from "@/lib/haptics";
import type { Genre } from "../interfaces";
import { Text } from "./text";

export type HomeGenreChipsProps = {
  genres: Genre[];
  onSelectGenre: (genre: Genre) => void;
};

const ChipSeparator = memo(function ChipSeparator() {
  return <View className="w-2" />;
});

export const HomeGenreChips = memo(function HomeGenreChips({
  genres,
  onSelectGenre,
}: HomeGenreChipsProps) {
  const renderItem = useCallback(
    ({ item: g }: { item: Genre }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={g.name}
        onPress={() => {
          haptics.selection();
          onSelectGenre(g);
        }}
        style={{ flexShrink: 0 }}
        className="px-3 py-1.5 rounded-full border border-border bg-overlay active:opacity-80"
      >
        <Text color="foreground" fontSize={13} fontWeight={600} numberOfLines={1}>
          {g.name}
        </Text>
      </Pressable>
    ),
    [onSelectGenre]
  );

  const keyExtractor = useCallback((g: Genre) => String(g.id), []);

  if (!genres.length) return null;

  return (
    <List<Genre>
      horizontal
      showsHorizontalScrollIndicator={false}
      data={genres}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ChipSeparator}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
      estimatedItemSize={100}
    />
  );
});
