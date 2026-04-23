import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import DraggableFlatList from "react-native-draggable-flatlist";
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
  rankingKey: string;
  id: number;
  title: string;
  posterPath?: string;
  mediaType: FavoriteMediaType;
  meta: string;
  rating?: string;
};

export function FavoriteMoviesView(props: FavoriteMoviesViewProps) {
  const insets = useSafeAreaInsets();
  const {
    drawerRef,
    favoriteMovies,
    favoriteSeries,
    favoriteRanking,
    name,
    description,
    setDescription,
    setName,
    setFavoriteRanking,
    subimtFavoriteItem,
  } = useFavoriteMovies();

  const favoriteEntries = useMemo<FavoriteEntry[]>(
    () => {
      const rankingOrder = new Map(
        favoriteRanking.map((key, index) => [key, index] as const)
      );
      return [
        ...favoriteMovies
        .filter((m) => m.id != null)
        .map((m) => ({
          rankingKey: `movie-${m.id}`,
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
          rankingKey: `tv-${s.id}`,
          id: s.id as number,
          title: s.name ?? "Untitled",
          posterPath: s.posterPath,
          mediaType: "tv" as const,
          meta: [s.genre, s.firstAirDate].filter(Boolean).join(" · "),
          rating: s.voteAverageStr,
        })),
      ].sort((a, b) => {
        const aPos = rankingOrder.get(a.rankingKey);
        const bPos = rankingOrder.get(b.rankingKey);
        if (aPos == null && bPos == null) return 0;
        if (aPos == null) return 1;
        if (bPos == null) return -1;
        return aPos - bPos;
      });
    },
    [favoriteMovies, favoriteSeries, favoriteRanking]
  );

  return (
    <View
      className="w-full h-full bg-background"
      testID="favorites-screen"
      collapsable={false}
    >
      <NavBar
        title={getText("favorites_title")}
        onPressLeading={props.onBack}
        trainlingIcon={[
          { name: "plus", onPress: () => drawerRef.current?.open() },
        ]}
      />
      <DraggableFlatList
        data={favoriteEntries}
        keyExtractor={(item) => item.rankingKey}
        onDragEnd={({ data }) => {
          setFavoriteRanking(data.map((entry) => entry.rankingKey));
        }}
        renderItem={({ item, drag, isActive }) => (
          <Pressable
            onPress={() => props.goToDetails(item.id, item.mediaType)}
            onLongPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              drag();
            }}
            disabled={isActive}
            className="flex-row items-center bg-background border-b border-border px-sm"
            style={{
              paddingVertical: 10,
              opacity: isActive ? 0.95 : 1,
            }}
          >
            <View style={{ marginRight: 10 }}>
              <Icon name="drag-vertical" size={18} color="#7f8c8d" />
            </View>
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
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
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
