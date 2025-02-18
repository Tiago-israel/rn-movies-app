import LottieView from "lottie-react-native";
import { Box } from "./box";

export function EmptyState() {
  return (
    <Box width="100%" flex={1} alignItems="center">
      <LottieView
        autoPlay
        source={require("../assets/empty.json")}
        style={{
          width: 200,
          height: 200,
        }}
      />
    </Box>
  );
}
