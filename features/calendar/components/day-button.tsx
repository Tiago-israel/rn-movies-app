import { PressableProps } from "react-native";
import { Box } from "./box";
import { Day } from "../models";
import { memo, useCallback, useMemo } from "react";

export type DayButtonProps = {
  width: number;
  height: number;
  children?: React.ReactNode;
  item: Day;
  index: number;
  onPress: (day: Day, index: number) => void;
};

export const DayButton = memo((props: DayButtonProps) => {
  const onPress = useCallback(() => {
    props.onPress(props.item, props.index);
  }, [props.item, props.index, props.onPress]);

  const textColor = useMemo(() => {
    if (props.item.active) return "#fff";
    if (props.item.isCurrent) return "#333";
    return "#95a5a6";
  }, [props.item.active, props.item.isCurrent]);

  const backgroundColor = useMemo(() => {
    if(props.item.isFirstActive) return 'red';
    if(props.item.isLastActive) return 'blue';
    if (props.item.active) return "#141414";
    return "transparent";
  }, [props.item.active, props.item.isInRange]);

  // if (props.item.active) {
  //   console.log(
  //     "active",
  //     "first",
  //     props.item.isFirstActive,
  //     "last",
  //     props.item.isLastActive,
  //     props.item.dayStr
  //   );
  // }

  return (
    <Box
      width={props.width}
      height={props.height}
      backgroundColor={props.item.isInRange ? "#e0e0e0" : "transparent"}
      borderBottomStartRadius={props.item.isFirstActive ? "full" : "none"}
      borderTopStartRadius={props.item.isFirstActive ? "full" : "none"}
      borderBottomEndRadius={props.item.isLastActive ? "full" : "none"}
      borderTopEndRadius={props.item.isLastActive ? "full" : "none"}
    >
      <Box<PressableProps>
        as="Pressable"
        width={props.width}
        height={props.height}
        borderRadius={props.item.active ? "full" : "none"}
        alignItems="center"
        justifyContent="center"
        backgroundColor={backgroundColor}
        onPress={onPress}
      >
        <Box as="Text" fontSize={20} color={textColor}>
          {props.children}
        </Box>
      </Box>
    </Box>
  );
});
