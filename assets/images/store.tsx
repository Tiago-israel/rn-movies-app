import { useState } from "react";
import Icon from "@expo/vector-icons/FontAwesome";
import { Box } from "@/components/Box";
import { FlatListProps, ScrollViewProps } from "react-native";

const products = [
  { name: "Training Plain", image: require("../../assets/images/fight.png") },
  { name: "Training Plain", image: require("../../assets/images/fight.png") },
  { name: "Training Plain", image: require("../../assets/images/fight.png") },
  { name: "Training Plain", image: require("../../assets/images/fight.png") },
];

export function useStore() {
  const [products, setProducts] = useState([]);
  return { products };
}

export default function Store() {
  const { products } = useStore();
  return (
    <Box width="100%" height="100%" px="sm" backgroundColor="white">
      <Box flexDirection="row" gap={24} justifyContent="flex-end" mt={"xxl"}>
        <Icon name="bell" color={"#ccc"} size={24} />
        <Icon name="user" color={"#ccc"} size={24} />
      </Box>
      <Box<ScrollViewProps> as="ScrollView">
        <Box as="Text" fontSize={24} fontWeight={700}>
          Store
        </Box>
        <Box<FlatListProps> as="FlatList" />
      </Box>
    </Box>
  );
}
