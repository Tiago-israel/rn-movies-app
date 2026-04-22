import { memo, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { List } from "@/components";
import type { ListRenderItemInfo } from "@shopify/flash-list";
import type { SearchResultItem } from "../interfaces";
import type { MediaFilterKind, SearchStatus } from "../controllers/use-search-movies";
import { getText } from "../localization";
import { SearchResultCard } from "./search-result-card";
import { SearchFilterChips } from "./search-filter-chips";
import { useTheme } from "@/lib/theme-provider";
import type { MovieTheme } from "../theme";

const POSTER_HEIGHT = 152;

export type SearchResultsProps = {
  displayedItems: SearchResultItem[];
  rawCount: number;
  status: SearchStatus;
  awaitingDebounce: boolean;
  committedQuery: string;
  errorKey: string | null;
  onRetry: () => void;
  onPress?: (item: SearchResultItem) => void;
  loadMore: () => void;
  loadingMore: boolean;
  hasMore: boolean;
  mediaFilter: MediaFilterKind;
  onMediaFilterChange: (m: MediaFilterKind) => void;
  genreOptions: { id: number; label: string }[];
  selectedGenreIds: number[];
  onToggleGenre: (id: number) => void;
  onAddToWatchlist?: (item: SearchResultItem) => void;
  isInWatchlist?: (item: SearchResultItem) => boolean;
  watchlistVersion?: number;
  contentTopPadding: number;
};

const MEDIA_FILTERS: MediaFilterKind[] = ["all", "movie", "tv", "person"];

function mediaFilterLabel(m: MediaFilterKind): string {
  switch (m) {
    case "all":
      return getText("search_filter_all");
    case "movie":
      return getText("search_filter_movie");
    case "tv":
      return getText("search_filter_tv");
    case "person":
      return getText("search_filter_person");
    default:
      return "";
  }
}

export const SearchResults = memo(function SearchResults({
  displayedItems,
  rawCount,
  status,
  awaitingDebounce,
  committedQuery,
  errorKey,
  onRetry,
  onPress,
  loadMore,
  loadingMore,
  hasMore,
  mediaFilter,
  onMediaFilterChange,
  genreOptions,
  selectedGenreIds,
  onToggleGenre,
  onAddToWatchlist,
  isInWatchlist,
  watchlistVersion = 0,
  contentTopPadding,
}: SearchResultsProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme<MovieTheme>();
  const numColumns = 3;
  const columnWidth = useMemo(
    () => (width - 40 - 2 * 8) / numColumns,
    [width]
  );

  const renderItem = useCallback(
    (info: ListRenderItemInfo<SearchResultItem>) => (
      <SearchResultCard
        item={info.item}
        width={columnWidth}
        posterHeight={POSTER_HEIGHT}
        onPress={() => onPress?.(info.item)}
        onAddToWatchlist={
          onAddToWatchlist
            ? () => onAddToWatchlist(info.item)
            : undefined
        }
        inWatchlist={isInWatchlist?.(info.item)}
      />
    ),
    [columnWidth, onPress, onAddToWatchlist, isInWatchlist, watchlistVersion]
  );

  const keyExtractor = useCallback(
    (item: SearchResultItem) => `${item.mediaType}-${item.id}`,
    []
  );

  const onEndReached = useCallback(() => {
    if (hasMore && !loadingMore && status === "success") {
      loadMore();
    }
  }, [hasMore, loadingMore, loadMore, status]);

  const showFilters = status === "success" && rawCount > 0;

  const listHeader = useMemo(
    () =>
      showFilters ? (
        <View className="w-full mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          >
            {MEDIA_FILTERS.map((m) => {
              const selected = mediaFilter === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => onMediaFilterChange(m)}
                  className="px-3 py-1.5 rounded-full border"
                  style={{
                    borderColor: selected
                      ? colors.palette.belizeHole
                      : colors.secondary,
                    backgroundColor: selected ? colors.secondary : "transparent",
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{
                      color: selected
                        ? colors["secondary-foreground"]
                        : colors["muted-foreground"],
                    }}
                  >
                    {mediaFilterLabel(m)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {genreOptions.length > 0 ? (
            <SearchFilterChips
              title={getText("search_genres_title")}
              options={genreOptions}
              selectedIds={selectedGenreIds}
              onToggle={onToggleGenre}
            />
          ) : null}
        </View>
      ) : null,
    [
      colors,
      genreOptions,
      mediaFilter,
      onMediaFilterChange,
      onToggleGenre,
      selectedGenreIds,
      rawCount,
      showFilters,
      status,
    ]
  );

  const emptyComponent = useMemo(() => {
    if (awaitingDebounce && rawCount === 0 && status !== "error") {
      return (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      );
    }
    if (status === "loading" && rawCount === 0) {
      return (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      );
    }
    if (status === "error" && errorKey) {
      return (
        <View className="py-12 px-6 items-center">
          <Text className="text-center text-muted-foreground mb-4">
            {getText("search_error")}
          </Text>
          <Pressable
            onPress={onRetry}
            className="px-4 py-2 rounded-lg bg-secondary"
          >
            <Text className="text-secondary-foreground font-medium">
              {getText("search_retry")}
            </Text>
          </Pressable>
        </View>
      );
    }
    if (status === "success" && rawCount === 0) {
      return (
        <View className="py-12 px-4 items-center">
          <Text className="text-center text-muted-foreground">
            {getText("search_no_results", { query: committedQuery })}
          </Text>
        </View>
      );
    }
    if (
      status === "success" &&
      rawCount > 0 &&
      displayedItems.length === 0
    ) {
      return (
        <View className="py-12 px-4 items-center">
          <Text className="text-center text-muted-foreground">
            {getText("search_no_filter_matches")}
          </Text>
        </View>
      );
    }
    return <View className="min-h-[120px]" />;
  }, [
    awaitingDebounce,
    committedQuery,
    displayedItems.length,
    errorKey,
    onRetry,
    rawCount,
    status,
  ]);

  const footer = useMemo(
    () =>
      loadingMore ? (
        <View className="py-4 items-center">
          <ActivityIndicator />
        </View>
      ) : null,
    [loadingMore]
  );

  return (
    <View className="flex-1 w-full">
      {awaitingDebounce && rawCount > 0 ? (
        <View
          className="absolute left-0 right-0 z-10 items-center py-2 bg-background/90"
          style={{ top: contentTopPadding - 36 }}
          pointerEvents="none"
        >
          <ActivityIndicator size="small" />
        </View>
      ) : null}
      <List
        data={displayedItems}
        numColumns={numColumns}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        extraData={{
          mediaFilter,
          selectedGenreIds,
          watchlistVersion,
        }}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footer}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: contentTopPadding,
          paddingBottom: 32,
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});
