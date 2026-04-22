import { memo, useCallback, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import type { SearchResultItem } from "../interfaces";
import { getText } from "../localization";
import { ItemPoster } from "./item-poster";

function mediaLabel(mediaType: SearchResultItem["mediaType"]): string {
  switch (mediaType) {
    case "movie":
      return getText("search_media_movie");
    case "tv":
      return getText("search_media_tv");
    case "person":
      return getText("search_media_person");
    default:
      return "";
  }
}

export type SearchResultCardProps = {
  item: SearchResultItem;
  width: number;
  posterHeight: number;
  onItemPress?: (item: SearchResultItem) => void;
  /** Save movie/TV to local watchlist (shown as bookmark on poster). */
  onAddToWatchlistItem?: (item: SearchResultItem) => void;
  inWatchlist?: boolean;
};

export const SearchResultCard = memo(function SearchResultCard({
  item,
  width,
  posterHeight,
  onItemPress,
  onAddToWatchlistItem,
  inWatchlist,
}: SearchResultCardProps) {
  const label = useMemo(() => mediaLabel(item.mediaType), [item.mediaType]);
  const a11y = `${item.title}, ${label}`;
  const showListBtn =
    (item.mediaType === "movie" || item.mediaType === "tv") &&
    onAddToWatchlistItem;

  const handlePress = useCallback(() => {
    onItemPress?.(item);
  }, [onItemPress, item]);

  const handleAddWatchlist = useCallback(() => {
    onAddToWatchlistItem?.(item);
  }, [onAddToWatchlistItem, item]);

  const texts = (
    <>
      <Text
        className="text-foreground text-xs font-medium mt-1"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <Text
        className="text-muted-foreground text-[10px] mt-0.5"
        numberOfLines={1}
      >
        {label}
      </Text>
    </>
  );

  return (
    <View className="mb-2" style={{ width, marginHorizontal: 4 }}>
      <View className="relative w-full">
        {onItemPress ? (
          <Pressable
            accessibilityLabel={a11y}
            accessibilityRole="button"
            onPress={handlePress}
          >
            <ItemPoster
              width={width}
              height={posterHeight}
              posterUrl={item.posterPath}
              recyclingKey={`${item.mediaType}-${item.id}`}
            />
          </Pressable>
        ) : (
          <ItemPoster
            width={width}
            height={posterHeight}
            posterUrl={item.posterPath}
            recyclingKey={`${item.mediaType}-${item.id}`}
          />
        )}
        {showListBtn ? (
          <Pressable
            onPress={handleAddWatchlist}
            accessibilityLabel={
              inWatchlist
                ? getText("search_in_watchlist_a11y")
                : getText("search_add_watchlist_a11y")
            }
            accessibilityRole="button"
            hitSlop={10}
            className="absolute top-1 right-1 rounded-full bg-overlay/90 p-1"
          >
            <Icon
              name={inWatchlist ? "bookmark" : "bookmark-outline"}
              size={18}
              color={inWatchlist ? "#f1c40f" : "#ecf0f1"}
            />
          </Pressable>
        ) : null}
      </View>
      {onItemPress ? (
        <Pressable
          accessibilityLabel={a11y}
          accessibilityRole="button"
          onPress={handlePress}
        >
          {texts}
        </Pressable>
      ) : (
        texts
      )}
    </View>
  );
});
