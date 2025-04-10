import { useCallback, useEffect, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { Box, NavBar, Text } from "../components";
import { useMovieCast } from "../controllers";
import { List } from "@/components";
import { getText } from "../localization";

export type CastProps = {
  movieId: number;
  goBack: () => void;
  goToPerson: (personId: number) => void;
};

export function CastView(props: CastProps) {
  const numColumns = 3;
  const { cast } = useMovieCast(props.movieId);
  const { width } = useWindowDimensions();
  const columnWidth = useMemo(() => (width - 40 - 2 * 8) / numColumns, [width]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<(typeof cast)[0]>) => {
      return (
        <Box
          as="Pressable"
          width={columnWidth}
          height={200}
          marginBottom={8}
          flexDirection="column"
          justifyContent="flex-end"
          borderRadius="md"
          overflow="hidden"
          onPress={() => props.goToPerson?.(item.id)}
        >
          <Box
            as="Image"
            width={columnWidth}
            height={200}
            source={
              item.profilePath
                ? { uri: item.profilePath }
                : require("../assets/user.png")
            }
            borderRadius="md"
            position="absolute"
          />
          <Box width="100%" backgroundColor="rgba(0,0,0,0.9)" gap={2}>
            <Text color="onPrimary" textAlign="center">
              {item.name}
            </Text>
            <Text color="#c2c2c2" textAlign="center" numberOfLines={1}>
              {item.character}
            </Text>
          </Box>
        </Box>
      );
    },
    []
  );

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
      <NavBar
        onPressLeading={props.goBack}
        onPressTrailing={props.goBack}
        title={getText("movie_details_cast_title")}
      />
      <List
        contentContainerStyle={{ padding: 20 }}
        estimatedItemSize={200}
        numColumns={numColumns}
        data={cast}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
      />
    </Box>
  );
}
