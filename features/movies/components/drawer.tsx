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
} from "react-native";
import { Box } from "./box";
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
        width={DRAWER_WIDTH}
        height="100%"
        zIndex={2}
        backgroundColor="surfaceVariant"
        top={0}
        style={[
          {
            left: props.direction === "left" ? left : undefined,
            right: props.direction === "right" ? right : undefined,
          },
        ]}
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
