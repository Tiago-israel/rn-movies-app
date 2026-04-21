import { ReactNode } from "react";
import { View, Text } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export type HomeTitleProps = {
  icon?: {
    name: React.ComponentProps<typeof Icon>["name"];
    color?: string;
  };
  children?: ReactNode;
};

export function HomeTitle(props: HomeTitleProps) {
  return (
    <View className="flex-row items-center gap-2 px-sm py-xs">
      {props.icon && (
        <Icon name={props.icon.name} size={22} color={props.icon.color} />
      )}
      <Text className="text-foreground text-lg font-bold flex-1">
        {props.children}
      </Text>
    </View>
  );
}
