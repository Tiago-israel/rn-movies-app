import { useEffect, useMemo, useRef } from "react";
import { ScrollViewProps, useWindowDimensions } from "react-native";
import { List } from "@/components";
import { useFavoriteMovies } from "../controllers";
import {
  ItemPoster,
  Box,
  NavBar,
  Drawer,
  Text,
  Input,
  Button,
  SelectableCard,
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
    favoriteItems,
    name,
    description,
    setDescription,
    setName,
    subimtFavoriteItem,
  } = useFavoriteMovies();

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
      <NavBar
        title="My favorite movies"
        trainlingIcon={[
          { name: "plus", onPress: () => drawerRef.current?.open() },
        ]}
      />
      <Box<ScrollViewProps>
        as="ScrollView"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        <List
          scrollEnabled={false}
          estimatedItemSize={200}
          numColumns={3}
          data={favoriteMovies}
          keyExtractor={(item) => `${item.id}`}
          renderItem={(info) => (
            <Box
              width={columnWidth}
              height={200}
              marginHorizontal={4}
              marginBottom={8}
            >
                <ItemPoster
                  width={columnWidth}
                  height={200}
                  posterUrl={info.item.posterPath}
                  borderRadius="lg"
                  onPress={() => props.goToDetails(info.item.id)}
                />
            </Box>
          )}
        />
        {/* <List
          scrollEnabled={false}
          estimatedItemSize={200}
          data={favoriteItems}
          keyExtractor={(item) => `${item.name}`}
          renderItem={(info) => <Box width={"100%"} height={56}>
            <Text>{info.item.name}</Text>
          </Box>}
        /> */}
      </Box>
      <Drawer ref={drawerRef} direction="right">
        <Box px="sm" gap="sm">
          <Box flexDirection="column" gap={"xxs"}>
            <Text color="onSecondary">Name*</Text>
            <Input placeholder="name" value={name} onChangeText={setName} />
          </Box>
          <Box flexDirection="column" gap={"xxs"}>
            <Text color="onSecondary">Description</Text>
            <Input
              multiline
              numberOfLines={10}
              textAlign="left"
              value={description}
              onChangeText={setDescription}
            />
          </Box>
          <Button
            variant="primary"
            disabled={name === ""}
            onPress={subimtFavoriteItem}
          >
            Save
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
