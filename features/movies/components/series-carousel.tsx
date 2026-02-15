import { List } from "@/components";
import { ItemPoster } from "./item-poster";
import type { GenericItem } from "../interfaces";
import { memo, useCallback } from "react";
import { useWindowDimensions, View } from "react-native";
import { MoreOptionsCarousel } from "./more-options-carousel";

type SeriesCarouselProps = {
  data: GenericItem[];
  itemWidth?: number;
  itemHeight?: number;
  onPressItem: (movieId: number) => void | Promise<void>;
  onPressMoreOptions: () => void;
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
      ItemSeparatorComponent={() => <View className="w-2 h-2" />}
      data={props.data}
      renderItem={renderItem}
      ListFooterComponent={() => {
        return (
          <MoreOptionsCarousel
            width={props.itemWidth}
            height={props.itemHeight}
            onPress={props?.onPressMoreOptions}
          />
        );
      }}
    />
  );
});
