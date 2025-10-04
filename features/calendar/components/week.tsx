import { useCallback } from "react";
import { FlatListProps, ListRenderItemInfo } from "react-native";
import { Box } from "./box";

export type WeekProps = {
  days: string[];
  itemWidth: number;
};

export function Week(props: WeekProps) {
  const item = useCallback((info: ListRenderItemInfo<string>) => {
    return (
      <Box
        as="Text"
        width={props.itemWidth}
        fontSize={18}
        color={"#333"}
        textAlign="center"
        children={info.item}
      />
    );
  }, []);

  return (
    <Box<FlatListProps<string>>
      as="FlatList"
      contentContainerStyle={{ paddingHorizontal: 20 }}
      keyExtractor={(item) => item}
      scrollEnabled={false}
      horizontal
      data={props.days}
      renderItem={item}
    />
  );
}
