import { Box, List } from "@/components";
import { MoviePoster } from "../components/movie-poster";
import { MovieDetails } from "../interfaces";
import { memo, useCallback } from "react";
import { useWindowDimensions } from "react-native";

type MovieCarouselProps = {
  data: MovieDetails[];
  itemWidth?: number;
  itemHeight?: number;
  onPressItem: (movieId: number) => void | Promise<void>;
};

export const MovieCarousel = memo(({ ...props }: MovieCarouselProps) => {
  const { width } = useWindowDimensions();
  const renderItem = useCallback(
    ({ item }: any) => (
      <MoviePoster
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
