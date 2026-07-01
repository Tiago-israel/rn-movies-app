import { memo, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import type { SearchResultItem } from "../interfaces";
import { haptics } from "@/lib/haptics";
import { getText } from "../localization";
import { SearchResultCard } from "./search-result-card";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export type SearchIdleContentProps = {
  recentQueries: string[];
  trendingItems: SearchResultItem[];
  trendingLoading: boolean;
  onSelectRecent: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  onSelectResult: (item: SearchResultItem) => void;
  onAddToWatchlist?: (item: SearchResultItem) => void;
  isInWatchlist?: (item: SearchResultItem) => boolean;
  /** Bumps when watchlist changes so bookmark state refreshes. */
  watchlistVersion?: number;
  contentTopPadding: number;
};

export const SearchIdleContent = memo(function SearchIdleContent({
  recentQueries,
  trendingItems,
  trendingLoading,
  onSelectRecent,
  onRemoveRecent,
  onSelectResult,
  onAddToWatchlist,
  isInWatchlist,
  watchlistVersion = 0,
  contentTopPadding,
}: SearchIdleContentProps) {
  const { width } = useWindowDimensions();
  const numColumns = 3;
  const columnWidth = useMemo(
    () => (width - 40 - 2 * 8) / numColumns,
    [width]
  );
  const posterHeight = 128;

  const rows = useMemo(() => {
    const chunk: SearchResultItem[][] = [];
    for (let i = 0; i < trendingItems.length; i += numColumns) {
      chunk.push(trendingItems.slice(i, i + numColumns));
    }
    return chunk;
  }, [trendingItems, numColumns]);

  const handleItemPress = useCallback(
    (item: SearchResultItem) => {
      onSelectResult(item);
    },
    [onSelectResult]
  );

  const handleAddToWatchlistItem = useCallback(
    (item: SearchResultItem) => {
      onAddToWatchlist?.(item);
    },
    [onAddToWatchlist]
  );

  const renderRow = useCallback(
    (row: SearchResultItem[], rowIndex: number) => (
      <View key={`row-${rowIndex}`} className="flex-row flex-wrap justify-start">
        {row.map((item) => (
          <SearchResultCard
            key={`${item.mediaType}-${item.id}-wl${watchlistVersion}`}
            item={item}
            width={columnWidth}
            posterHeight={posterHeight}
            onItemPress={handleItemPress}
            onAddToWatchlistItem={
              onAddToWatchlist ? handleAddToWatchlistItem : undefined
            }
            inWatchlist={isInWatchlist?.(item)}
          />
        ))}
      </View>
    ),
    [
      columnWidth,
      posterHeight,
      handleItemPress,
      handleAddToWatchlistItem,
      onAddToWatchlist,
      isInWatchlist,
      watchlistVersion,
    ]
  );

  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: contentTopPadding,
        paddingBottom: 32,
      }}
    >
      <Text className="text-muted-foreground text-sm mb-4">
        {getText("search_idle_hint")}
      </Text>

      {recentQueries.length > 0 ? (
        <View className="mb-6">
          <Text className="text-foreground text-xs font-semibold mb-2">
            {getText("search_recent_title")}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {recentQueries.map((q) => (
              <View
                key={q}
                className="flex-row items-center bg-secondary rounded-full pl-3 pr-1 py-1.5"
              >
                <Pressable
                  onPress={() => {
                    haptics.light();
                    onSelectRecent(q);
                  }}
                  hitSlop={8}
                >
                  <Text className="text-sm text-secondary-foreground pr-1">
                    {q}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityLabel="Remove"
                  onPress={() => {
                    haptics.selection();
                    onRemoveRecent(q);
                  }}
                  hitSlop={8}
                >
                  <Icon name="close" size={18} color="#888" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <Text className="text-foreground text-xs font-semibold mb-2">
        {getText("search_trending_title")}
      </Text>
      {trendingLoading ? (
        <ActivityIndicator className="py-8" />
      ) : (
        rows.map((row, i) => renderRow(row, i))
      )}
    </ScrollView>
  );
});
