import { useEffect, useRef } from "react";
import { FlatListProps, ImageBackgroundProps, Linking } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Image, List } from "@/components";
import {
  Box,
  IconButton,
  NavBar,
  Pill,
  Text,
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
      moviesListRef.current?.scrollToOffset(0);
    };
  });

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
      <NavBar onPressLeading={props.goBack} onPressTrailing={props.goBack} />
      <Box
        as="ScrollView"
        flex={1}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Box
          as="ImageBackground"
          width="100%"
          height={300}
          source={{ uri: person?.profilePath }}
        ></Box>
        <Box
          pt="sm"
          borderTopStartRadius="xl"
          borderTopEndRadius="xl"
          width="100%"
          marginTop={-30}
          backgroundColor="surface"
        >
          <Text color="onSurface" fontSize={28} fontWeight={700} px="sm">
            {person?.name}
          </Text>
          <Box flexDirection="row" pt="xs" gap="xxs" px="sm">
            <Pill icon="star">{person?.birthday}</Pill>
            {person?.deathday && <Pill icon="cross">{person?.deathday}</Pill>}
          </Box>
          <Box<FlatListProps<MediaItem>>
            as="FlatList"
            data={externalMedias}
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              gap: 8,
            }}
            renderItem={({ item }) => {
              return (
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
                    color={"#fff"}
                  />
                </IconButton>
              );
            }}
          />
          {person?.biography && (
            <ViewMoreText
              ref={viewMoreTextRef}
              color="#7f8c8d"
              fontSize={16}
              fontWeight={700}
              numberOfLines={4}
              containerStyle={{ py: "md", px: "sm" }}
            >
              {person?.biography}
            </ViewMoreText>
          )}

          <Box width={"100%"} height={250}>
            {movies.length > 0 && (
              <List
                innerRef={moviesListRef}
                horizontal
                data={movies}
                estimatedItemSize={250}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Box
                    as="Pressable"
                    width={150}
                    height={250}
                    onPress={() => props.goToMovie?.(item.id)}
                  >
                    <Image
                      source={{ uri: item.backdropPath }}
                      style={{
                        width: 150,
                        height: 250,
                        borderRadius: 16,
                      }}
                    />
                  </Box>
                )}
                ItemSeparatorComponent={() => <Box width={8} height={8} />}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
