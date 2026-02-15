import { useCallback, useMemo } from "react";
import {
  useWindowDimensions,
  Pressable,
  View,
  Text as RNText,
} from "react-native";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { NavBar, Text } from "../components";
import { useSeriesCast } from "../controllers";
import { Image, List } from "@/components";
import { getText } from "../localization";

export type SeriesCastProps = {
  seriesId: number;
  goBack: () => void;
  goToPerson: (personId: number) => void;
};

export function SeriesCastView(props: SeriesCastProps) {
  const numColumns = 3;
  const { cast } = useSeriesCast(props.seriesId);
  const { width } = useWindowDimensions();
  const columnWidth = useMemo(() => (width - 40 - 2 * 8) / numColumns, [width]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<(typeof cast)[0]>) => (
      <Pressable
        style={{ width: columnWidth, height: 200, marginBottom: 8 }}
        className="flex-col justify-end rounded-md overflow-hidden"
        onPress={() => props.goToPerson?.(item.id)}
      >
        <Image
          source={{ uri: item.profilePath }}
          placeholder={require("../assets/user.png")}
          contentFit="cover"
          placeholderContentFit="contain"
          style={{
            width: columnWidth,
            height: 200,
            borderRadius: 20,
            position: "absolute",
          }}
        />
        <View
          className="w-full gap-0.5 flex-col"
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
        >
          <Text color="primary-foreground" style={{ textAlign: "center" }}>
            {item.name}
          </Text>
          <RNText
            className="text-base"
            style={{ color: "#c2c2c2", textAlign: "center" }}
            numberOfLines={1}
          >
            {item.character}
          </RNText>
        </View>
      </Pressable>
    ),
    [columnWidth, props.goToPerson]
  );

  return (
    <View className="w-full h-full bg-background">
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
    </View>
  );
}
