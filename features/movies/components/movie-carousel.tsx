import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { List } from "@/components";
import { type MovieDetails } from "../interfaces";
import { ItemPoster } from "./item-poster";
import { MoreOptionsCarousel } from "./more-options-carousel";

type MovieCarouselProps = {
  data: MovieDetails[];
  itemWidth?: number;
  itemHeight?: number;
  onPressItem: (movieId: number) => void | Promise<void>;
  onPressMoreOptions: () => void;
};

export const MovieCarousel = memo(({ ...props }: MovieCarouselProps) => {
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

  const keyExtractor = useCallback((item: MovieDetails) => `${item.id}`, []);

  const renderFooter = useCallback(() => (
    <MoreOptionsCarousel
      width={props.itemWidth}
      height={props.itemHeight}
      onPress={props?.onPressMoreOptions}
    />
  ), [props.onPressMoreOptions, props.itemWidth, props.itemHeight]);

  const renderSeparator = useCallback(() => (
    <View className="w-2 h-2" />
  ), []);

  return (
    <List
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={renderSeparator}
      data={props.data}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});