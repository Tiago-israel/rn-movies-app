import { useMemo } from "react";
import { useWindowDimensions, ScrollView, View } from "react-native";
import { List } from "@/components";
import { useFavoriteMovies } from "../controllers";
import {
  ItemPoster,
  NavBar,
  Drawer,
  Text,
  Input,
  Button,
} from "../components";

export type FavoriteMoviesViewProps = {
  goToDetails: (movieId?: number) => void;
};

export function FavoriteMoviesView(props: FavoriteMoviesViewProps) {
  const { width } = useWindowDimensions();
  const columnWidth = useMemo(() => (width - 40 - 2 * 8) / 3, [width]);
  const {
    drawerRef,
    favoriteMovies,
    name,
    description,
    setDescription,
    setName,
    subimtFavoriteItem,
  } = useFavoriteMovies();

  return (
    <View className="w-full h-full bg-background">
      <NavBar
        title="My favorite movies"
        trainlingIcon={[{ name: "plus", onPress: () => drawerRef.current?.open() }]}
      />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <List
          scrollEnabled={false}
          estimatedItemSize={200}
          numColumns={3}
          data={favoriteMovies}
          keyExtractor={(item) => `${item.id}`}
          renderItem={(info) => (
            <View
              className="mb-2"
              style={{
                width: columnWidth,
                height: 200,
                marginHorizontal: 4,
              }}
            >
              <ItemPoster
                width={columnWidth}
                height={200}
                posterUrl={info.item.posterPath}
                borderRadius="lg"
                onPress={() => props.goToDetails(info.item.id)}
              />
            </View>
          )}
        />
      </ScrollView>
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
