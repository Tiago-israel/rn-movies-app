import { useCallback, useMemo } from "react";
import {
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { List, SkeletonPlaceholder } from "@/components";
import { ItemPoster, NavBar } from "../components";
import { useViewMore } from "../controllers";
import { GenericItem, ServiceType } from "../interfaces";

export type ViewMoreProps = {
  type: ServiceType;
  title: string;
  goBack: () => void;
};

export function ViewMoreView(props: ViewMoreProps) {
  const { items, getPaginatedItems, isLoading } = useViewMore(props.type);
  const { width } = useWindowDimensions();
  const numColumns = 3;
  const columnWidth = useMemo(() => (width - 40 - 2 * 8) / numColumns, [width]);

  if (isLoading) {
    const skeletonItems = Array.from({ length: 12 }, (_, i) => i);
    return (
      <View className="w-full h-full bg-background">
        <NavBar
          title={props.title}
          onPressLeading={props.goBack}
          onPressTrailing={props.goBack}
        />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {skeletonItems.map((i) => (
            <SkeletonPlaceholder
              key={i}
              width={columnWidth}
              height={200}
              borderRadius={16}
              style={{ marginBottom: 8 }}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  const renderItem = useCallback(
    (info: ListRenderItemInfo<GenericItem>) => (
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
        />
      </View>
    ),
    [columnWidth]
  );

  const keyExtractor = useCallback((item: any, i: number) => `${i}-${item.id}`, []);

  return (
    <View className="w-full h-full bg-background">
      <NavBar
        title={props.title}
        onPressLeading={props.goBack}
        onPressTrailing={props.goBack}
      />
      <List
        estimatedItemSize={200}
        numColumns={3}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={getPaginatedItems}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
      />
    </View>
  );
}
