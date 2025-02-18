import { Box } from "@/components/Box";
import { useHome } from "../controller";
import {
  FlatListProps,
  ImageProps,
  ScrollViewProps,
  TextProps,
} from "react-native";

export function Home() {
  const { artists } = useHome();
  return (
    <Box width={"100%"} height={"100%"}>
      <Box as="SafeAreaView" />
      <Box<ScrollViewProps>>
        <Box<FlatListProps<any>>
          as="FlatList"
          data={artists}
          horizontal={true}
          contentContainerStyle={{ gap: 16 }}
          showsHorizontalScrollIndicator={false}
          px="sm"
          renderItem={({ item }) => (
            <Box as="Pressable" key={item.id} width={120} alignItems="center" justifyContent="center" gap={'xxs'}>
              <Box
                as="Image"
                width={120}
                height={120}
                borderRadius={"full"}
                source={{ uri: item.album.images[0].url }}
              ></Box>
              <Box<TextProps> as="Text" color="white" numberOfLines={2} width={'100%'} textAlign="center">
                {item.name}
              </Box>
            </Box>
          )}
        ></Box>
      </Box>
    </Box>
  );
}
