import { PressableProps } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Box } from "./box";
import { ReactNode } from "react";

export type MonthYearSelectorProps = {
  children: ReactNode;
  onNextMonth: () => void;
  onPrevMonth: () => void;
};

export function MonthYearSelector(props: MonthYearSelectorProps) {
  return (
    <Box
      width={"100%"}
      padding={20}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box<PressableProps>
        as="Pressable"
        width={40}
        height={40}
        alignItems="center"
        justifyContent="center"
        onPress={props.onPrevMonth}
      >
        <Icon name="chevron-left" size={24} />
      </Box>
      <Box as="Text" fontSize={18} children={props.children} />
      <Box<PressableProps>
        as="Pressable"
        width={40}
        height={40}
        alignItems="center"
        justifyContent="center"
        onPress={props.onNextMonth}
      >
        <Icon name="chevron-right" size={24} />
      </Box>
    </Box>
  );
}
