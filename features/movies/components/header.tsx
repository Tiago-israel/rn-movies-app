import { type PressableProps } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Box } from "./box";

export type HeaderProps = {
  onMenuPress?: () => void;
};

export function Header(props: HeaderProps) {
  return (
    <Box
      width="100%"
      height={72}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="sm"
      borderBottomWidth={2}
      borderBottomColor="onSurfaceBorder"
    >
      <Box<PressableProps>
        as="Pressable"
        hitSlop={40}
        onPress={props.onMenuPress}
      >
        <Icon name="menu" size={24} color={"#fff"} />
      </Box>
    </Box>
  );
}
