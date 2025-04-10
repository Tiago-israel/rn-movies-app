import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  LayoutRectangle,
  useAnimatedValue,
} from "react-native";
import { Box } from "./box";
import { Text } from "./text";

const TABSGROUP_HEIGHT = 32;

export type TabsGroupProps = {
  items?: Array<{
    title: string;
  }>;
  onPress?: (index: number) => void;
  selectedIndex?: number;
};

export type TabItemProps = {
  index: number;
  children: string;
  selected?: boolean;
  onPress?: (index: number) => void;
  onLoad?: (index: number, measurements: LayoutRectangle) => void;
};

export const TabItem = forwardRef((props: TabItemProps, ref) => {
  return (
    <Box
      as="Pressable"
      height={TABSGROUP_HEIGHT}
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      px="lg"
      zIndex={999}
      onLayout={(event: LayoutChangeEvent) => {
        console.log(event.nativeEvent.layout);
        props.onLoad?.(props.index, event.nativeEvent.layout);
      }}
      onPress={() => {
        props.onPress?.(props.index);
      }}
    >
      <Text color="#fff">{props.children}</Text>
    </Box>
  );
});

export function TabsGroup({
  selectedIndex = 0,
  items = [],
  ...props
}: TabsGroupProps) {
  const selectedIndexRef = useRef(selectedIndex);
  const selectedWidth = useAnimatedValue(0);
  const left = useAnimatedValue(0);
  const [measurements, setMeasurements] = useState<
    Map<number, LayoutRectangle>
  >(new Map());

  function onLoad(index: number, measurement: LayoutRectangle) {
    setMeasurements((prev) => {
      const newMap = new Map(prev);
      newMap.set(index, measurement);
      return newMap;
    });
  }

  function animate(index: number) {
    Animated.parallel([
      Animated.timing(selectedWidth, {
        toValue: measurements.get(index)?.width || 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(left, {
        toValue: measurements.get(index)?.x || 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        props.onPress?.(index);
      }
    });
  }

  useEffect(() => {
    if (measurements.size < items?.length) return;
    if (!measurements.has(selectedIndex)) return;
    selectedWidth.setValue(measurements.get(selectedIndex)?.width || 0);
    left.setValue(measurements.get(selectedIndex)?.x || 0);
  }, [measurements, selectedIndex]);

  return (
    <Box
      flexDirection="row"
      borderWidth={2}
      borderColor="onSurfaceBorder"
      borderRadius="full"
    >
      <Box
        as="AnimatedView"
        borderRadius="full"
        height={TABSGROUP_HEIGHT}
        backgroundColor="red"
        position="absolute"
        top={0}
        style={[{ width: selectedWidth, left }]}
      />
      {items?.map((item, index) => {
        return (
          <TabItem
            key={index}
            index={index}
            selected={selectedIndex === index}
            onLoad={onLoad}
            onPress={(index) => {
              selectedIndexRef.current = index;
              animate(index);
            }}
          >
            {item.title}
          </TabItem>
        );
      })}
    </Box>
  );
}

TabsGroup.HEIGHT = TABSGROUP_HEIGHT;
