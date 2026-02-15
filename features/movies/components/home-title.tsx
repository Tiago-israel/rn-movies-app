import { ReactNode } from "react";
import { View, Text } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome6";

export type HomeTitleProps = {
  icon?: {
    name: string;
    color?: string;
  };
  children?: ReactNode;
};

export function HomeTitle(props: HomeTitleProps) {
  return (
    <View className="flex-row items-center gap-2 px-sm py-xs">
      <Text className="text-foreground text-2xl font-bold">{props.children}</Text>
      {props.icon && (
        <Icon name={props.icon.name} size={24} color={props.icon.color} />
      )}
    </View>
  );
}
