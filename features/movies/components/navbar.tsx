import { ReactNode } from "react";
import { View, Text } from "react-native";
import { IconButton } from "./Icon-button";

const NAVBAR_HEIGHT = 72;

export type NavBarTrailingItem = {
  name: any;
  color?: string;
  children?: ReactNode;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

export type NavBarProps = {
  title?: string;
  hideButtons?: boolean;
  /** Defaults to `nav-back` for Maestro / a11y. */
  leadingTestID?: string;
  leadingAccessibilityLabel?: string;
  leadingIcon?: {
    name: any;
    color?: string;
    children?: ReactNode;
  };
  trainlingIcon?: NavBarTrailingItem[];
  onPressLeading?: () => void | Promise<void>;
  onPressTrailing?: () => void | Promise<void>;
};

export function NavBar({
  leadingIcon = {
    name: "arrow-left",
  },
  trainlingIcon = [
    {
      name: "close",
    },
  ],
  ...props
}: NavBarProps) {
  return (
    <View
      className="w-full flex-row items-center overflow-visible px-sm border-b border-border"
      style={{
        height: NAVBAR_HEIGHT,
        justifyContent: props.hideButtons ? "center" : "space-between",
      }}
    >
      {!props.hideButtons && leadingIcon && (
        <IconButton
          icon={leadingIcon.name}
          onPress={props.onPressLeading}
          children={leadingIcon.children}
          testID={props.leadingTestID ?? "nav-back"}
          accessibilityLabel={
            props.leadingAccessibilityLabel ?? "Go back"
          }
        />
      )}
      {props.title && (
        <Text className="text-xl text-foreground">{props.title}</Text>
      )}
      <View className="flex-row gap-xs overflow-visible">
        {!props.hideButtons &&
          trainlingIcon?.map((item, index) => (
            <IconButton
              key={index}
              icon={item.name}
              color={item.color}
              children={item.children}
              onPress={item.onPress || props.onPressTrailing}
              testID={item.testID ?? `nav-trailing-${index}`}
              accessibilityLabel={item.accessibilityLabel}
            />
          ))}
      </View>
    </View>
  );
}

NavBar.Height = NAVBAR_HEIGHT;
