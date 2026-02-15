import { memo, useCallback, useMemo } from "react";
import { useWindowDimensions, ScrollView, View } from "react-native";
import { List } from "@/components";
import { type MovieDetails } from "../interfaces";
import { ListRenderItemInfo } from "@shopify/flash-list";
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
          <View
            className="mb-2"
            style={{
              width: columnWidth,
              height: 200,
              marginHorizontal: 4,
            }}
          >
            <ItemPoster
              width={columnWidth}
              height={200}
              posterUrl={info.item.posterPath}
              onPress={() => props.onPress?.(info.item.id)}
            />
          </View>
        );
      },
      [props.onPress, columnWidth]
    );

    return (
      <ScrollView
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
      </ScrollView>
    );
  }
);
