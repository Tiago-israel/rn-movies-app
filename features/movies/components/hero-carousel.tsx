import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  View,
  useWindowDimensions,
  type ViewToken,
} from "react-native";
import type { GenericItem } from "../interfaces";

type HeroCarouselProps = {
  data: GenericItem[];
  onPressItem: (id: number) => void | Promise<void>;
};

export function HeroCarousel({ data, onPressItem }: HeroCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<GenericItem>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: GenericItem }) => {
      const imageUri = item.backdropPath || item.posterPath;
      const aspectRatio = item.backdropPath ? 16 / 9 : 2 / 3;
      const height = width / aspectRatio;

      return (
        <Pressable
          onPress={() => onPressItem(item.id)}
          style={{ width }}
          className="overflow-hidden"
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width, height }}
            resizeMode="cover"
          />
        </Pressable>
      );
    },
    [width, onPressItem]
  );

  const handleBulletPress = useCallback(
    (index: number) => {
      flatListRef.current?.scrollToOffset({
        offset: index * width,
        animated: true,
      });
    },
    [width]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width]
  );

  if (!data?.length) return null;

  return (
    <View className="w-full">
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => `hero-${item.id}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
      />
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
        {data.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => handleBulletPress(index)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View
              className={`h-2 rounded-full ${
                index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
