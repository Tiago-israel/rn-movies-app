import { memo, useCallback } from "react";
import { ActivityIndicator, View } from "react-native";
import { List } from "@/components";
import type { SearchResultItem } from "../interfaces";
import { ItemPoster } from "./item-poster";

type TrendingHomeRowProps = {
  items: SearchResultItem[];
  loading: boolean;
  onSelectItem: (item: SearchResultItem) => void;
  itemWidth?: number;
  itemHeight?: number;
};

export const TrendingHomeRow = memo(function TrendingHomeRow({
  items,
  loading,
  onSelectItem,
  itemWidth = 110,
  itemHeight = 165,
}: TrendingHomeRowProps) {
  const renderItem = useCallback(
    ({ item }: { item: SearchResultItem }) => (
      <ItemPoster
        width={itemWidth}
        height={itemHeight}
        posterUrl={item.posterPath}
        onPress={() => onSelectItem(item)}
        recyclingKey={`trending-${item.mediaType}-${item.id}`}
      />
    ),
    [onSelectItem, itemWidth, itemHeight]
  );

  const keyExtractor = useCallback(
    (item: SearchResultItem) => `${item.mediaType}-${item.id}`,
    []
  );

  if (loading && !items.length) {
    return (
      <View className="py-6 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!items.length) return null;

  return (
    <List
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      ItemSeparatorComponent={() => <View className="w-2 h-2" />}
      data={items}
      renderItem={renderItem}
    />
  );
});
