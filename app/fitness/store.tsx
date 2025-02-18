import { useRef, useState } from "react";
import { FlatListProps, ImageProps, ScrollViewProps } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { Box } from "@/components/Box";
import { TapState, TapStateRef } from "@/components/TapState";

type Product = {
  name: string;
  image: any;
  productColor: string;
  description: string;
};

const productsList: Product[] = [
  {
    name: "Training Plain",
    image: require("@/assets/images/fight.png"),
    productColor: "#EF9C66",
    description:
      "A training plain product is a simple, foundational item designed to help users learn and practice essential skills without extra features.",
  },
  {
    name: "Meal Plain",
    image: require("@/assets/images/fight2.png"),
    productColor: "#EF9C66",
    description:
      "A training plain product is a simple, foundational item designed to help users learn and practice essential skills without extra features.",
  },
  {
    name: "Supplement Plain",
    image: require("@/assets/images/ginastic.png"),
    productColor: "#F7B5CA",
    description:
      "A training plain product is a simple, foundational item designed to help users learn and practice essential skills without extra features.",
  },
  {
    name: "workout Plain",
    image: require("@/assets/images/running.png"),
    productColor: "#141414",
    description:
      "A training plain product is a simple, foundational item designed to help users learn and practice essential skills without extra features.",
  },
  {
    name: "Yoga Plain",
    image: require("@/assets/images/yoga.png"),
    productColor: "#F0C1E1",
    description:
      "A training plain product is a simple, foundational item designed to help users learn and practice essential skills without extra features.",
  },
];

export function useStore() {
  const [products, setProducts] = useState<Product[]>(productsList);
  return { products };
}

export default function Store() {
  const tapStateRef = useRef<TapStateRef>();
  const { products } = useStore();

  return (
    <Box width="100%" height="100%" backgroundColor="white">
      <Box
        flexDirection="row"
        gap={24}
        justifyContent="flex-end"
        mt={"sm"}
        p="sm"
        borderBottomWidth={1}
        borderColor="#c0c0c0"
      >
        <Icon name="bell" color={"#ccc"} size={24} />
        <Icon name="user" color={"#ccc"} size={24} />
      </Box>

      <Box<ScrollViewProps>
        as="ScrollView"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <Box as="Text" fontSize={24} fontWeight={700} py="sm">
          Store
        </Box>
        <Box<FlatListProps<Product>>
          as="FlatList"
          scrollEnabled={false}
          horizontal={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
          data={products}
          renderItem={({ item }) => (
            <Box
              as="Pressable"
              flex={1}
              height={150}
              borderRadius="lg"
              overflow="hidden"
              flexDirection="row"
              backgroundColor={item.productColor}
              onPressIn={() => tapStateRef.current?.setPressed(true)}
              onPressOut={() => tapStateRef.current?.setPressed(false)}
            >
              <TapState ref={tapStateRef} variant="dark" />
              <Box flex={1} p="sm" justifyContent="space-between">
                <Box as="Text" color="white" fontSize={20} fontWeight={700}>
                  {item.name}
                </Box>
                <Box as="Text" color="white" fontSize={12} fontWeight={700}>
                  {item.description}
                </Box>
              </Box>
              <Box
                as="Image"
                source={item.image}
                width={130}
                height={"100%"}
                justifyContent="flex-end"
              ></Box>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
