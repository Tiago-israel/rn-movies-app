import * as Updates from "expo-updates";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { View, Text, Pressable, ScrollView } from "react-native";
import { List, Toggle } from "@/components";
import { useUserStore } from "../store";
import { NavBar } from "../components";

export type PreferencesProps = {
  theme?: "light" | "dark";
};

export function usePreferences() {
  const userTheme = useUserStore((state) => state.theme);
  const setTheme = useUserStore((state) => state.setTheme);
  const setLanguage = useUserStore((state) => state.setLanguage);
  return { userTheme, setTheme, setLanguage };
}

export function PreferencesView(props: PreferencesProps) {
  const { userTheme, setTheme, setLanguage } = usePreferences();
  return (
    <View className="w-full h-full bg-background">
      <NavBar hideButtons title="Settings" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 20, gap: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-sm flex-row items-center justify-between">
          <Text className="text-foreground text-2xl font-bold">Appearance</Text>
          <View className="gap-xs flex-row">
            <Pressable
              className="p-xxs border-2 border-border rounded-sm"
              onPress={() => setTheme("light")}
            >
              <Icon
                name="white-balance-sunny"
                color={userTheme === "light" ? "#f1c40f" : "#fff"}
                size={24}
              />
            </Pressable>
            <Pressable
              className="p-xxs border-2 border-border rounded-sm"
              onPress={() => setTheme("dark")}
            >
              <Icon
                name="moon-waxing-crescent"
                color={userTheme === "dark" ? "#f1c40f" : "#fff"}
                size={24}
              />
            </Pressable>
          </View>
        </View>
        <View className="px-sm">
          <Text className="text-foreground text-2xl font-bold pb-sm">
            Languages
          </Text>
          <List
            scrollEnabled={false}
            horizontal={false}
            estimatedItemSize={61}
            data={[
              { label: "English", id: "en" },
              { label: "Brazilian Portuguese", id: "pt-BR" },
            ]}
            ItemSeparatorComponent={() => (
              <View className="w-full h-0.5 bg-border" />
            )}
            renderItem={({ item }) => (
              <Pressable
                className="w-full h-12 flex-row items-center justify-between"
                onPress={() => {
                  setLanguage(item.id as "en" | "pt-BR");
                  Updates.reloadAsync();
                }}
              >
                <Text className="text-foreground flex-1 text-base">
                  {item.label}
                </Text>
                <Toggle />
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
