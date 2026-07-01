import { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ItemPoster } from "./item-poster";
import type { GenericItem } from "../interfaces";
import { MoreOptionsCarousel } from "./more-options-carousel";

type SeriesCarouselProps = {
  data: GenericItem[];
  itemWidth?: number;
  itemHeight?: number;
  onPressItem: (movieId: number) => void | Promise<void>;
  onPressMoreOptions: () => void;
};

/** @see MovieCarousel — ScrollView avoids nested FlashList layout issues */
export const SeriesCarousel = memo(function SeriesCarousel({
  data,
  itemWidth = 150,
  itemHeight = 200,
  onPressItem,
  onPressMoreOptions,
}: SeriesCarouselProps) {
  return (
    <ScrollView
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
            recyclingKey={`series-${item.id}`}
            onPress={() => onPressItem(item.id)}
          />
        </View>
      ))}
      <MoreOptionsCarousel
        width={itemWidth}
        height={itemHeight}
        onPress={onPressMoreOptions}
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
