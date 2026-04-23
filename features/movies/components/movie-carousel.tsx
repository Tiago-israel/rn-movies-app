import { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { type MovieDetails } from "../interfaces";
import { ItemPoster } from "./item-poster";
import { MoreOptionsCarousel } from "./more-options-carousel";

type MovieCarouselProps = {
  data: MovieDetails[];
  itemWidth?: number;
  itemHeight?: number;
  onPressItem: (movieId: number) => void | Promise<void>;
  onPressMoreOptions: () => void;
  /** Horizontal list — for Maestro scroll before tapping “Show more”. */
  carouselTestID?: string;
  moreOptionsTestID?: string;
};

/**
 * Horizontal row of posters + “more” tile. Uses ScrollView instead of FlashList
 * so layout works when nested in a vertical ScrollView (FlashList v2 often fails to
 * measure in that configuration).
 */
export const MovieCarousel = memo(function MovieCarousel({
  data,
  itemWidth = 150,
  itemHeight = 200,
  onPressItem,
  onPressMoreOptions,
  carouselTestID,
  moreOptionsTestID,
}: MovieCarouselProps) {
  return (
    <ScrollView
      testID={carouselTestID}
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      {data.map((item) => (
        <View key={item.id} style={styles.cell}>
          <ItemPoster
            width={itemWidth}
            height={itemHeight}
            posterUrl={item.posterPath}
            recyclingKey={String(item.id)}
            onPress={() => item.id != null && onPressItem(item.id)}
          />
        </View>
      ))}
      <MoreOptionsCarousel
        width={itemWidth}
        height={itemHeight}
        onPress={onPressMoreOptions}
        testID={moreOptionsTestID}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 2,
    flexGrow: 0,
  },
  cell: {
    marginRight: 8,
  },
});
