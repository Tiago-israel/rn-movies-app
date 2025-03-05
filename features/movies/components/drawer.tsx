import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { Animated, Easing, useAnimatedValue } from "react-native";
import { Box } from "./box";
import { IconButton } from "./Icon-button";

const WIDTH = 300;

export type DrawerProps = {
  children?: ReactNode;
};

export type DrawerRef = {
  open: () => void;
  close: () => void;
};

export function useDrawer() {
  const left = useAnimatedValue(-WIDTH);

  function open() {
    Animated.timing(left, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }

  function close(callback: () => void) {
    Animated.timing(left, {
      toValue: -WIDTH,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        callback();
      }
    });
  }

  return {
    left,
    open,
    close,
  };
}

export const Drawer = forwardRef((props: DrawerProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { left, open, close } = useDrawer();

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
    <Box width={"100%"} height={"100%"} position="absolute">
      <Box
        as="AnimatedView"
        position="absolute"
        width={"100%"}
        height={"100%"}
        backgroundColor="rgba(0,0,0,0.6)"
        zIndex={1}
      />
      <Box
        as="AnimatedView"
        position="absolute"
        width={WIDTH}
        height="100%"
        zIndex={2}
        backgroundColor="surfaceVariant"
        top={0}
        style={[{ left }]}
      >
        <Box
          width="100%"
          height={72}
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          px="sm"
        >
          <IconButton icon="close" onPress={onClose} />
        </Box>
        {props.children}
      </Box>
    </Box>
  );
});
