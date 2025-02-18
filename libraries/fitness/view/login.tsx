import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/Box";
import { Button } from "../components";
import ImageBG from "../assets/running.png";

export function Login() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Box width="100%" height="100%">
      <Box as="ImageBackground" source={ImageBG} width={"100%"} height={"100%"}>
        <Box
          width={"100%"}
          height={"100%"}
          px="sm"
          pb="lg"
          justifyContent="space-between"
        >
          <Box
            width={"100%"}
            flexDirection="row"
            mt={insets.top}
            py="xxs"
            justifyContent="flex-end"
          >
            <Box
              as="Pressable"
              flexDirection="row"
              alignItems="center"
              onPress={() => router.push("/store")}
            >
              <Box as="Text" color="white" fontSize={14} fontWeight={100}>
                SKIP
              </Box>
              <Ionicons name="right" size={24} color={"#fff5"} />
            </Box>
          </Box>
          <Box gap={200}>
            <Box gap="xs">
              <Box as="Text" fontSize={48} fontWeight={700} color="white">
                Supplements
              </Box>
              <Box as="Text" fontSize={16} color="white">
                Workout plans designed to help you achieve your fitness goals -
                whether losing weight or building muscle
              </Box>
            </Box>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              gap="sm"
            >
              <Button variant="secondary">Log in</Button>
              <Button variant="primary">Sign Up</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
