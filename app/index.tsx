import { Box } from "@/components/Box";
import { router } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Index() {
  return (
    <Box width={'100%'} height={'100%'} alignItems="center" justifyContent="center">
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
    </Box>
  );
}
