import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useUserStore } from "../store";
import { Box, NavBar } from "../components";
import { ScrollViewProps } from "react-native";
import { List, Toggle } from "@/components";

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
    <Box width="100%" height="100%" backgroundColor="surface">
      <NavBar hideButtons title="Settings" />
      <Box<ScrollViewProps>
        as="ScrollView"
        contentContainerStyle={{ paddingTop: 20, gap: 8 }}
      >
        <Box
          px="sm"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box as="Text" color="onSurface" fontSize={24} fontWeight={700}>
            Appearance
          </Box>
          <Box gap="xs" flexDirection="row">
            <Box
              as="Pressable"
              p="xxs"
              borderWidth={2}
              borderColor="onSurfaceBorder"
              borderRadius="sm"
              onPress={() => {
                setTheme("light");
              }}
            >
              <Icon
                name="white-balance-sunny"
                color={userTheme === "light" ? "#f1c40f" : "#fff"}
                size={24}
              />
            </Box>
            <Box
              as="Pressable"
              p="xxs"
              borderWidth={2}
              borderColor="onSurfaceBorder"
              borderRadius="sm"
              onPress={() => {
                setTheme("dark");
              }}
            >
              <Icon
                name="moon-waxing-crescent"
                color={userTheme === "dark" ? "#f1c40f" : "#fff"}
                size={24}
              />
            </Box>
          </Box>
        </Box>
        <Box px="sm">
          <Box
            as="Text"
            color="onSurface"
            fontSize={24}
            fontWeight={700}
            pb="sm"
          >
            Languages
          </Box>
          <List
            scrollEnabled={false}
            horizontal={false}
            estimatedItemSize={61}
            data={[
              { label: "English", id: "en" },
              { label: "Brazilian Portuguese", id: "pt-BR" },
            ]}
            ItemSeparatorComponent={() => (
              <Box width="100%" height={2} backgroundColor="onSurfaceBorder" />
            )}
            renderItem={({ item }) => {
              return (
                <Box
                  as="Pressable"
                  width="100%"
                  height={48}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onPress={() => setLanguage(item.id)}
                >
                  <Box as="Text" color="onSurface" flex={1} fontSize={16}>
                    {item.label}
                  </Box>
                  <Toggle />
                </Box>
              );
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
