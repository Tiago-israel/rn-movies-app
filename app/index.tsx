import { Box } from "@/components/Box";
import { ThemeProvider } from "@/lib";
import { theme } from "@/theme";
import { router, Tabs } from "expo-router";

export default function Index() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        as="Pressable"
        backgroundColor="red"
        alignItems="center"
        justifyContent="center"
        height={200}
        onPress={() => {
          router.replace("/movies", { withAnchor: true });
        }}
      >
        <Box as="Text" fontSize={24} color="#000">
          Movies
        </Box>
      </Box>
    </ThemeProvider>
  );
}
