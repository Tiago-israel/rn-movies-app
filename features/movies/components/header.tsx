import { View, Pressable } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export type HeaderProps = {
  onMenuPress?: () => void;
};

const HEADER_HEIGHT = 72;

export function Header(props: HeaderProps) {
  return (
    <View
      className="w-full flex-row justify-between items-center px-sm border-b-2 border-border"
      style={{ height: HEADER_HEIGHT }}
    >
      <Pressable hitSlop={40} onPress={props.onMenuPress}>
        <Icon name="menu" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

Header.HEIGHT = HEADER_HEIGHT;
