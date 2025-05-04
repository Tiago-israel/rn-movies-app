import { useCallback, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { List } from "@/components";
import { Box, ItemPoster, NavBar, Text } from "../components";
import { useViewMore } from "../controllers";
import { GenericItem, ServiceType } from "../interfaces";

export type ViewMoreProps = {
  type: ServiceType;
  title: string;
  goBack: () => void;
};

export function ViewMoreView(props: ViewMoreProps) {
  const { items, getPaginatedItems } = useViewMore(props.type);
  const { width } = useWindowDimensions();
  const numColumns = 3;
  const columnWidth = useMemo(() => (width - 40 - 2 * 8) / numColumns, [width]);

  const renderItem = useCallback(
    (info: ListRenderItemInfo<GenericItem>) => {
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
          />
        </Box>
      );
    },
    [columnWidth]
  );

  const keyExtractor = useCallback(
    (item: any, i: number) => `${i}-${item.id}`,
    []
  );

  return (
    <Box width={"100%"} height="100%" backgroundColor="surface">
      <NavBar title={props.title} onPressLeading={props.goBack} onPressTrailing={props.goBack} />
        <List
          estimatedItemSize={200}
          numColumns={3}
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={getPaginatedItems}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}
        />
    </Box>
  );
}
