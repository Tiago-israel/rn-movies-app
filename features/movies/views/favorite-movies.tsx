import { useMemo } from "react";
import { Pressable, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { List } from "@/components";
import { useFavoriteMovies } from "../controllers";
import { getText } from "../localization";
import {
  NavBar,
  Drawer,
  Text,
  Input,
  Button,
  ItemPoster,
} from "../components";

export type FavoriteMediaType = "movie" | "tv";

export type FavoriteMoviesViewProps = {
  onBack: () => void;
  goToDetails: (id: number, mediaType?: FavoriteMediaType) => void;
};

type FavoriteEntry = {
  id: number;
  title: string;
  posterPath?: string;
  mediaType: FavoriteMediaType;
  meta: string;
  rating?: string;
};

export function FavoriteMoviesView(props: FavoriteMoviesViewProps) {
  const {
    drawerRef,
    favoriteMovies,
    favoriteSeries,
    name,
    description,
    setDescription,
    setName,
    subimtFavoriteItem,
  } = useFavoriteMovies();

  const favoriteEntries = useMemo<FavoriteEntry[]>(
    () => [
      ...favoriteMovies
        .filter((m) => m.id != null)
        .map((m) => ({
          id: m.id as number,
          title: m.title ?? "Untitled",
          posterPath: m.posterPath,
          mediaType: "movie" as const,
          meta: [m.genre, m.runtime ?? m.releaseDate].filter(Boolean).join(" · "),
          rating: m.voteAverageStr,
        })),
      ...favoriteSeries
        .filter((s) => s.id != null)
        .map((s) => ({
          id: s.id as number,
          title: s.name ?? "Untitled",
          posterPath: s.posterPath,
          mediaType: "tv" as const,
          meta: [s.genre, s.firstAirDate].filter(Boolean).join(" · "),
          rating: s.voteAverageStr,
        })),
    ],
    [favoriteMovies, favoriteSeries]
  );

  return (
    <View className="w-full h-full bg-background">
      <NavBar
        title={getText("favorites_title")}
        onPressLeading={props.onBack}
        trainlingIcon={[
          { name: "plus", onPress: () => drawerRef.current?.open() },
        ]}
      />
      <List
        data={favoriteEntries}
        keyExtractor={(item) => `${item.mediaType}-${item.id}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => props.goToDetails(item.id, item.mediaType)}
            className="flex-row items-center bg-background border-b border-border px-sm"
            style={{ paddingVertical: 10 }}
          >
            <ItemPoster
              width={52}
              height={76}
              posterUrl={item.posterPath}
              borderRadius="lg"
            />
            <View className="flex-1" style={{ marginLeft: 12 }}>
              <Text
                className="text-foreground font-bold text-sm"
                numberOfLines={2}
                style={{ marginBottom: 2 }}
              >
                {item.title}
              </Text>
              <Text
                className="text-muted-foreground text-xs"
                numberOfLines={1}
                style={{ marginBottom: 4 }}
              >
                {item.meta || (item.mediaType === "movie" ? "Movie" : "TV Series")}
              </Text>
              {item.rating && (
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <Icon name="star-outline" size={11} color="#7f8c8d" />
                  <Text className="text-muted-foreground text-xs">
                    {item.rating}/10
                  </Text>
                </View>
              )}
            </View>
            <View className="items-end">
              <View
                className="flex-row items-center border border-border rounded-full"
                style={{ paddingHorizontal: 8, paddingVertical: 3, gap: 4 }}
              >
                <Icon
                  name={item.mediaType === "movie" ? "movie-outline" : "television-classic"}
                  size={11}
                  color="#7f8c8d"
                />
                <Text className="text-muted-foreground text-xs">
                  {item.mediaType === "movie" ? "Movie" : "TV"}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
      <Drawer ref={drawerRef} direction="right">
        <View className="px-sm gap-sm">
          <View className="flex-col gap-xxs">
            <Text color="secondary-foreground">Name*</Text>
            <Input placeholder="name" value={name} onChangeText={setName} />
          </View>
          <View className="flex-col gap-xxs">
            <Text color="secondary-foreground">Description</Text>
            <Input
              multiline
              numberOfLines={10}
              textAlign="left"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <Button
            variant="primary"
            disabled={name === ""}
            onPress={subimtFavoriteItem}
          >
            Save
          </Button>
        </View>
      </Drawer>
    </View>
  );
}
