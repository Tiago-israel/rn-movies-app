import {
  FlatListProps,
  ListRenderItemInfo,
  useWindowDimensions,
} from "react-native";
import { Box } from "./box";
import { Week } from "./week";
import { Day } from "../models";
import { DayButton } from "./day-button";
import { useCallback, useMemo } from "react";
import { useCalendar } from "./use-calendar";

export type CalendarProps = {};

export function Calendar(props: CalendarProps) {
  const numColumns = 7;
  const { width } = useWindowDimensions();
  const { monthDays, onDayPress } = useCalendar(props);
  const columnWidth = useMemo(() => (width - 40) / numColumns, [width]);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Day>) => {
      return (
        <DayButton
          width={columnWidth}
          height={columnWidth}
          item={item}
          index={index}
          onPress={onDayPress}
        >
          {item.dayStr}
        </DayButton>
      );
    },
    [monthDays, onDayPress, columnWidth]
  );

  return (
    <Box width="100%">
      <Week
        itemWidth={columnWidth}
        days={["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]}
      />
      <Box<FlatListProps<Day>>
        as="FlatList"
        scrollEnabled={false}
        keyExtractor={(item, index) => `${item.dayStr}-${index}`}
        numColumns={numColumns}
        data={monthDays}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        renderItem={renderItem}
      />
    </Box>
  );
}
