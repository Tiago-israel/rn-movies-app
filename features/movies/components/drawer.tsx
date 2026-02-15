import {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import {
  Animated,
  Easing,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from "react-native";
import { IconButton } from "./Icon-button";

const DRAWER_WIDTH = 300;

export type DrawerProps = {
  direction?: "left" | "right";
  children?: ReactNode;
};

export type DrawerRef = {
  open: () => void;
  close: () => void;
};

export function useDrawer(props: DrawerProps) {
  const { width } = useWindowDimensions();
  const left = useAnimatedValue(-DRAWER_WIDTH);
  const right = useAnimatedValue(-DRAWER_WIDTH);

  const open = useCallback(() => {
    const direction = props.direction === "right" ? right : left;
    Animated.timing(direction, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [left, right, props.direction]);

  const close = useCallback(
    (callback: () => void) => {
      const direction = props.direction === "right" ? right : left;
      Animated.timing(direction, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          callback();
        }
      });
    },
    [right, left, width, props.direction]
  );

  return {
    left,
    right,
    open,
    close,
  };
}

export const Drawer = forwardRef((props: DrawerProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { left, right, open, close } = useDrawer(props);

  function onClose() {
    close(() => setIsOpen(false));
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      open();
    },
    close: () => {
      onClose();
    },
  }));

  if (!isOpen) return null;

  return (
    <View className="w-full h-full absolute">
      <Animated.View
        className="absolute w-full h-full z-[1]"
        style={[
          { backgroundColor: "rgba(0,0,0,0.6)" },
          { left: 0, right: 0, top: 0, bottom: 0 },
        ]}
      />
      <Animated.View
        className="absolute h-full top-0 z-[2] bg-card"
        style={[
          { width: DRAWER_WIDTH },
          {
            left: props.direction === "left" ? left : undefined,
            right: props.direction === "right" ? right : undefined,
          },
        ]}
      >
        <View className="w-full flex-row items-center justify-end px-sm h-[72]">
          <IconButton icon="close" onPress={onClose} />
        </View>
        {props.children}
      </Animated.View>
    </View>
  );
});
