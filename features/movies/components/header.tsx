import { View, Pressable, Text } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export type HeaderProps = {
  title?: string;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
};

const HEADER_HEIGHT = 56;

export function Header(props: HeaderProps) {
  return (
    <View
      className="w-full flex-row justify-between items-center px-sm"
      style={{ height: HEADER_HEIGHT }}
    >
      <View className="w-10">
        {props.onMenuPress ? (
          <Pressable
            hitSlop={40}
            onPress={props.onMenuPress}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <Icon name="menu" size={24} color="#fff" />
          </Pressable>
        ) : null}
      </View>
      {props.title ? (
        <Text
          className="flex-1 text-center text-lg font-bold text-white"
          numberOfLines={1}
          accessibilityRole="header"
        >
          {props.title}
        </Text>
      ) : (
        <View className="flex-1" />
      )}
      <View className="w-10 items-end">
        {props.onSearchPress ? (
          <Pressable
            hitSlop={40}
            onPress={props.onSearchPress}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <Icon name="magnify" size={24} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

Header.HEIGHT = HEADER_HEIGHT;
