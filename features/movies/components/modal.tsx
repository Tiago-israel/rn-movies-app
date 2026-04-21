import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal as RNModal,
  Animated,
  useAnimatedValue,
  Dimensions,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { IconButton } from "./Icon-button";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HANDLE_BLOCK = 40;
const HEADER_BLOCK = 56;
const FOOTER_BLOCK = 148;
const MODAL_VERTICAL_PADDING = 8;

export type ModalProps = {
  children?: React.ReactNode;
  /** Renders below the scroll area, fixed at the bottom of the sheet. */
  footer?: React.ReactNode;
  /** Optional header row with title and close control. */
  title?: string;
  visible?: boolean;
  onClose?: () => void;
};

export type ModalRef = {
  open: () => void;
  close: () => void;
};

export const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const translateY = useAnimatedValue(SCREEN_HEIGHT);
  const opacity = useAnimatedValue(0);

  const open = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsVisible(true);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [translateY, opacity]);

  const close = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      props.onClose?.();
    });
  }, [translateY, opacity, props.onClose]);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  useEffect(() => {
    if (props.visible) {
      open();
    } else if (props.visible === false) {
      translateY.setValue(SCREEN_HEIGHT);
      opacity.setValue(0);
      setIsVisible(false);
    }
  }, [props.visible]);

  return (
    <RNModal
      visible={isVisible || props.visible === true}
      transparent
      animationType="none"
      onRequestClose={close}
    >
      <View className="flex-1">
        {/* Backdrop */}
        <Animated.View
          className="absolute inset-0 bg-overlay"
          style={{ opacity }}
        >
          <Pressable className="flex-1" onPress={close} />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl overflow-hidden"
          style={{
            transform: [{ translateY }],
            maxHeight: SCREEN_HEIGHT * 0.9,
          }}
        >
          {/* Handle */}
          <View className="items-center py-3">
            <View className="w-10 h-1 bg-muted-foreground rounded-full opacity-30" />
          </View>

          {props.title ? (
            <View className="flex-row items-center justify-between px-sm pb-3 border-b border-border gap-xs">
              <Text
                className="text-lg font-semibold text-foreground flex-1"
                numberOfLines={1}
              >
                {props.title}
              </Text>
              <IconButton icon="close" onPress={close} />
            </View>
          ) : null}

          <ScrollView
            className="px-sm"
            style={{
              maxHeight:
                SCREEN_HEIGHT * 0.9 -
                HANDLE_BLOCK -
                MODAL_VERTICAL_PADDING -
                (props.title ? HEADER_BLOCK : 0) -
                (props.footer != null ? FOOTER_BLOCK : 0),
            }}
            contentContainerStyle={{
              paddingBottom: props.footer != null ? 8 : 40,
            }}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {props.children}
          </ScrollView>

          {props.footer != null ? (
            <View className="px-sm pt-2 pb-5 border-t border-border bg-background">
              {props.footer}
            </View>
          ) : null}
        </Animated.View>
      </View>
    </RNModal>
  );
});
