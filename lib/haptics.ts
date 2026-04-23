import { Platform } from "react-native";
import * as ExpoHaptics from "expo-haptics";

const native = Platform.OS === "ios" || Platform.OS === "android";

export const haptics = {
  light: () => {
    if (native) void ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
  },
  medium: () => {
    if (native) void ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
  },
  heavy: () => {
    if (native) void ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);
  },
  /** Tabs, chips, segment controls */
  selection: () => {
    if (native) void ExpoHaptics.selectionAsync();
  },
  success: () => {
    if (native)
      void ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
  },
  warning: () => {
    if (native)
      void ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
  },
  error: () => {
    if (native)
      void ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
  },
};
