import { Pressable, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

export type WatchlistFABProps = {
  onPress: () => void;
};

export function WatchlistFAB({ onPress }: WatchlistFABProps) {
  const { colors } = useTheme<MovieTheme>();
  return (
    <View className="absolute bottom-6 right-sm z-50">
      <Pressable
        onPress={() => {
          haptics.light();
          onPress();
        }}
        className="w-14 h-14 rounded-full bg-foreground items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <Icon name="plus" size={28} color={colors.background} />
      </Pressable>
    </View>
  );
}
