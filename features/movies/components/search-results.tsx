import { memo, useCallback, useMemo } from "react";
import { useWindowDimensions, type ScrollViewProps } from "react-native";
import { List } from "@/components";
// import { ItemPoster, Box, EmptyState } from "../components";
import { type MovieDetails } from "../interfaces";
import { ListRenderItemInfo } from "@shopify/flash-list";
import { Box } from "./box";
import { ItemPoster } from "./item-poster";
import { EmptyState } from "./empty-state";

export type SearchResultsProps = {
  movies: MovieDetails[];
  onPress?: (movieId?: number) => void;
};

export const SearchResults = memo(
  ({ movies = [], ...props }: SearchResultsProps) => {
    const { width } = useWindowDimensions();
    const numColumns = 3;
    const columnWidth = useMemo(
      () => (width - 40 - 2 * 8) / numColumns,
      [width]
    );

    const renderItem = useCallback(
      (info: ListRenderItemInfo<(typeof movies)[0]>) => {
        return (
          <Box
            width={columnWidth}
            height={200}
            marginHorizontal={4}
            marginBottom={8}
          >
            <ItemPoster
              width={columnWidth}
              height={200}
              posterUrl={info.item.posterPath}
              onPress={() => props.onPress?.(info.item.id)}
            />
          </Box>
        );
      },
      [props.onPress, columnWidth]
    );

    return (
      <Box<ScrollViewProps>
        as="ScrollView"
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 108 }}
      >
        <List
          scrollEnabled={false}
          estimatedItemSize={200}
          numColumns={numColumns}
          data={movies}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          ListEmptyComponent={EmptyState}
        />
      </Box>
    );
  }
);
