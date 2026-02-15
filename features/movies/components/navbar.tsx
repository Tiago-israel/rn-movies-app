import { ReactNode } from "react";
import { View, Text } from "react-native";
import { IconButton } from "./Icon-button";

const NAVBAR_HEIGHT = 72;

export type NavBarProps = {
  title?: string;
  hideButtons?: boolean;
  leadingIcon?: {
    name: any;
    color?: string;
    children?: ReactNode;
  };
  trainlingIcon?: {
    name: any;
    color?: string;
    children?: ReactNode;
    onPress?: () => void;
  }[];
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
      className="w-full flex-row items-center px-sm border-b border-border"
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
        />
      )}
      {props.title && (
        <Text className="text-xl text-foreground">{props.title}</Text>
      )}
      <View className="flex-row gap-xs">
        {!props.hideButtons &&
          trainlingIcon?.map((item, index) => (
            <IconButton
              key={index}
              icon={item.name}
              color={item.color}
              children={item.children}
              onPress={item.onPress || props.onPressTrailing}
            />
          ))}
      </View>
    </View>
  );
}

NavBar.Height = NAVBAR_HEIGHT;
