import Icon from "@expo/vector-icons/FontAwesome6";
import { View, Text } from "react-native";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

type PillProps = {
  children?: string;
  icon?: any;
};

export function Pill(props: PillProps) {
  const { colors } = useTheme<MovieTheme>();
  return (
    <View className="h-9 px-sm flex-row bg-secondary rounded-full items-center gap-xxs justify-center">
      {props.icon && (
        <Icon
          name={props.icon || "han"}
          size={16}
          color={colors["secondary-foreground"]}
        />
      )}
      <Text className="text-secondary-foreground text-sm font-bold">
        {props.children}
      </Text>
    </View>
  );
}
