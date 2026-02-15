import { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  ImageBackground,
  Linking,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Image, List } from "@/components";
import {
  IconButton,
  NavBar,
  Pill,
  ViewMoreText,
} from "../components";
import { usePerson } from "../controllers";
import { MediaItem } from "../interfaces";

export type PersonDetailsViewProps = {
  personId: number;
  goBack: () => void;
  goToMovie: (movieId: number) => void;
};

export function PersonDetailsView(props: PersonDetailsViewProps) {
  const moviesListRef = useRef<any>();
  const viewMoreTextRef = useRef<any>(null);
  const { person, movies, externalMedias } = usePerson(props.personId);

  useEffect(() => {
    viewMoreTextRef.current?.hideText?.();
  }, [props.personId]);

  useEffect(() => {
    return () => {
      moviesListRef.current?.scrollToOffset?.(0);
    };
  });

  return (
    <View className="w-full h-full bg-background">
      <NavBar
        onPressLeading={props.goBack}
        onPressTrailing={props.goBack}
      />
      <ScrollView
        bounces={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: person?.profilePath }}
          style={{ width: "100%", height: 300 }}
        >
          <FlatList
            data={externalMedias}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={{
              gap: 8,
              position: "absolute",
              bottom: 50,
              right: 0,
              paddingHorizontal: 10,
            }}
            renderItem={({ item }) => (
              <IconButton
                onPress={() => {
                  if (item.path) {
                    Linking.openURL(item.path);
                  }
                }}
              >
                <Icon
                  name={`logo-${item.media}` as any}
                  size={24}
                  color="#fff"
                />
              </IconButton>
            )}
          />
        </ImageBackground>
        <View
          className="pt-sm w-full bg-background rounded-tl-xl rounded-tr-xl -mt-[30px]"
        >
          <View className="w-full px-sm flex-row items-center justify-between">
            <Text className="text-foreground flex-1 text-3xl font-bold">
              {person?.name}
            </Text>
          </View>
          <View className="flex-row pt-xs gap-xxs px-sm">
            <Pill icon="star">{person?.birthday}</Pill>
            {person?.deathday && (
              <Pill icon="cross">{person?.deathday}</Pill>
            )}
          </View>
          <View className="py-5">
          {person?.biography && (
            <ViewMoreText
              ref={viewMoreTextRef}
              className="text-palette-asbestos"
              fontSize={16}
              fontWeight={700}
              numberOfLines={4}
              containerStyle={{ py: "md", px: "sm" }}
            >
              {person?.biography}
            </ViewMoreText>
          )}
          </View>
         
          <View className="w-full h-[250]">
            {movies.length > 0 && (
              <List
                innerRef={moviesListRef}
                horizontal
                data={movies}
                estimatedItemSize={250}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    className="w-[120] h-[200]"
                    onPress={() => props.goToMovie?.(item.id)}
                  >
                    <Image
                      source={{ uri: item.backdropPath }}
                      style={{
                        width: 120,
                        height: 200,
                        borderRadius: 16,
                      }}
                    />
                  </Pressable>
                )}
                ItemSeparatorComponent={() => (
                  <View className="w-2 h-2" />
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
