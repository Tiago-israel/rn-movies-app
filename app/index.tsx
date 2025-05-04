import { Box } from "@/components/Box";
import { ThemeProvider } from "@/lib";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Index() {
  return (
    <Pressable
      style={{
        width: "100%",
        height: 48,
        backgroundColor: "blue",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => {
        router.replace("/movies", { withAnchor: true });
      }}
    >
      <Text style={{ color: "#fff" }}>Go To Movies</Text>
    </Pressable>
  );
}
