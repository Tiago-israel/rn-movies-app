import { memo, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
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
  onPress?: () => void;
};

export const SearchResultCard = memo(function SearchResultCard({
  item,
  width,
  posterHeight,
  onPress,
}: SearchResultCardProps) {
  const label = useMemo(() => mediaLabel(item.mediaType), [item.mediaType]);
  const a11y = `${item.title}, ${label}`;

  const body = (
    <>
      <ItemPoster
        width={width}
        height={posterHeight}
        posterUrl={item.posterPath}
        recyclingKey={`${item.mediaType}-${item.id}`}
      />
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
      {onPress ? (
        <Pressable
          accessibilityLabel={a11y}
          accessibilityRole="button"
          onPress={onPress}
        >
          {body}
        </Pressable>
      ) : (
        body
      )}
    </View>
  );
});
