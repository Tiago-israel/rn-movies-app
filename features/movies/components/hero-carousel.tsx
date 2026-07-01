import { useCallback, useRef, useState } from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type ViewToken,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { ListRenderItemInfo } from "@shopify/flash-list";
import { List } from "@/components";
import { haptics } from "@/lib/haptics";
import type { GenericItem } from "../interfaces";

type HeroCarouselProps = {
  data: GenericItem[];
  onPressItem: (id: number) => void | Promise<void>;
};

export function HeroCarousel({ data, onPressItem }: HeroCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listRef = useRef<any>(null);

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
    ({ item }: ListRenderItemInfo<GenericItem>) => {
      const imageUri = item.backdropPath || item.posterPath;
      const aspectRatio = item.backdropPath ? 16 / 9 : 2 / 3;
      const height = width / aspectRatio;

      return (
        <Pressable
          onPress={() => {
            haptics.light();
            onPressItem(item.id);
          }}
          style={{ width }}
          className="overflow-hidden"
          accessibilityRole="button"
          accessibilityLabel={item.title ?? "Open details"}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width, height }}
            contentFit="cover"
            cachePolicy="memory-disk"
            recyclingKey={`hero-${item.id}-${imageUri}`}
            transition={200}
          />
        </Pressable>
      );
    },
    [width, onPressItem]
  );

  const handleBulletPress = useCallback(
    (index: number) => {
      haptics.selection();
      listRef.current?.scrollToOffset({
        offset: index * width,
        animated: true,
      });
    },
    [width]
  );

  const keyExtractor = useCallback(
    (item: GenericItem) => `hero-${item.id}`,
    []
  );

  if (!data?.length) return null;

  return (
    <View className="w-full">
      <List<GenericItem>
        innerRef={listRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={width}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.88)"]}
        pointerEvents="box-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 20,
          paddingTop: 56,
        }}
      >
        {data[activeIndex]?.title ? (
          <Text
            className="px-4 text-xl font-bold text-white"
            numberOfLines={2}
          >
            {data[activeIndex].title}
          </Text>
        ) : null}
        <View className="mt-4 flex-row justify-center px-4">
          <View className="flex-row items-center gap-2 rounded-full bg-black/40 px-3 py-2">
            {data.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => handleBulletPress(index)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={`Slide ${index + 1} of ${data.length}`}
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
      </LinearGradient>
    </View>
  );
}
