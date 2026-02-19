import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import {
  View,
  Pressable,
  Modal as RNModal,
  Animated,
  useAnimatedValue,
  Dimensions,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export type ModalProps = {
  children?: React.ReactNode;
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
  }, [translateY, opacity]);

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
          className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl"
          style={{
            transform: [{ translateY }],
            maxHeight: SCREEN_HEIGHT * 0.9,
          }}
        >
          {/* Handle */}
          <View className="items-center py-3">
            <View className="w-10 h-1 bg-muted-foreground rounded-full opacity-30" />
          </View>

          {/* Scrollable Content */}
          <ScrollView
            className="px-sm pb-10"
            showsVerticalScrollIndicator={false}
          >
            {props.children}
          </ScrollView>
        </Animated.View>
      </View>
    </RNModal>
  );
});
