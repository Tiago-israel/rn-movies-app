import { Box, List } from "@/components";
import { ItemPoster } from "./item-poster";
import type { TVSeriesListItem } from "../interfaces";
import { memo, useCallback } from "react";
import { useWindowDimensions } from "react-native";

type SeriesCarouselProps = {
  data: TVSeriesListItem[];
  itemWidth?: number;
  itemHeight?: number;
  onPressItem: (movieId: number) => void | Promise<void>;
};

export const SeriesCarousel = memo(({ ...props }: SeriesCarouselProps) => {
  const { width } = useWindowDimensions();
  const renderItem = useCallback(
    ({ item }: any) => (
      <ItemPoster
        key={item.id}
        width={props.itemWidth}
        height={props.itemHeight}
        posterUrl={item.posterPath}
        onPress={() => props.onPressItem(item.id)}
      />
    ),
    [props.onPressItem, props.itemWidth, props.itemHeight]
  );

  return (
    <List
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => `${item.id}`}
      estimatedItemSize={props.itemHeight ?? 200}
      estimatedListSize={{ width, height: props.itemHeight ?? 200 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      ItemSeparatorComponent={() => <Box width={8} height={8} />}
      data={props.data}
      renderItem={renderItem}
    />
  );
});
