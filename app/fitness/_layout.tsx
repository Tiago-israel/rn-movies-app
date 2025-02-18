import { Stack } from "expo-router";
import { ThemeProvider } from "@/lib";
import { theme } from "@/theme";

export default function FitnessLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="store" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
