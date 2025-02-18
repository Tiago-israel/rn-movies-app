import LottieView from "lottie-react-native";
import { Box } from "./Box";

export type ToggleProps = {};

export function Toggle(props: ToggleProps) {
  return (
    <Box>
      <LottieView
        autoPlay={false}
        source={require("@/assets/lotties/toggle.json")}
        style={{
          width: 100,
          height: 100,
        }}
      />
    </Box>
  );
}
