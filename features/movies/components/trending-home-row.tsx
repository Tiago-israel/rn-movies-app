import { memo, useCallback, useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { List } from "@/components";
import type { SearchResultItem } from "../interfaces";
import { ItemPoster } from "./item-poster";
import { getHomeRetryLabel, getHomeStatusMessage } from "../constants/home-status-messages";
import { getHomeStatusA11yLabel, HOME_STATUS_A11Y_ROLE } from "../constants/home-status-a11y";

type TrendingHomeRowProps = {
  items: SearchResultItem[];
  loading: boolean;
  error?: boolean;
  onRetry?: () => void;
  onSelectItem: (item: SearchResultItem) => void;
  itemWidth?: number;
  itemHeight?: number;
};

export const TrendingPosterItem = memo(function TrendingPosterItem({
  item,
  itemWidth,
  itemHeight,
  onSelectItem,
}: {
  item: SearchResultItem;
  itemWidth: number;
  itemHeight: number;
  onSelectItem: (item: SearchResultItem) => void;
}) {
  return (
    <ItemPoster
      width={itemWidth}
      height={itemHeight}
      posterUrl={item.posterPath}
      onPress={() => onSelectItem(item)}
      recyclingKey={`trending-${item.mediaType}-${item.id}`}
    />
  );
});

export const TrendingHomeRow = memo(function TrendingHomeRow({
  items,
  loading,
  error = false,
  onRetry,
  onSelectItem,
  itemWidth = 110,
  itemHeight = 165,
}: TrendingHomeRowProps) {
  const renderItem = useCallback(
    ({ item }: { item: SearchResultItem }) => (
      <TrendingPosterItem
        item={item}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        onSelectItem={onSelectItem}
      />
    ),
    [onSelectItem, itemWidth, itemHeight]
  );

  const keyExtractor = useCallback(
    (item: SearchResultItem) => `${item.mediaType}-${item.id}`,
    []
  );

  const ItemSeparator = useMemo(
    () =>
      function ItemSeparator() {
        return <View className="w-2 h-2" />;
      },
    []
  );

  if (loading && !items.length) {
    return (
      <View className="py-6 items-center justify-center">
        <ActivityIndicator />
        <Text accessibilityRole={HOME_STATUS_A11Y_ROLE} className="mt-2 text-muted-foreground">
          {getHomeStatusA11yLabel("loading")}
        </Text>
      </View>
    );
  }

  if (error && !items.length) {
    return (
      <View className="py-6 items-center justify-center px-5">
        <Text className="text-sm text-center text-muted-foreground mb-3">
          {getHomeStatusMessage("error")}
        </Text>
        {onRetry ? (
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel={getHomeStatusA11yLabel("error")}
            className="rounded-md bg-secondary px-3 py-2"
          >
            <Text className="text-foreground font-semibold">{getHomeRetryLabel()}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (!items.length) return null;

  const estimatedSpan = itemWidth + 8;

  return (
    <List
      horizontal
      showsHorizontalScrollIndicator={false}
      estimatedItemSize={estimatedSpan}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      ItemSeparatorComponent={ItemSeparator}
      data={items}
      renderItem={renderItem}
    />
  );
});
