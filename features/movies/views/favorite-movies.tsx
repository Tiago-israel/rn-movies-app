import { useMemo } from "react";
import { ScrollViewProps, useWindowDimensions } from "react-native";
import { List } from "@/components";
import { useFavoriteMovies } from "../controllers";
import { MoviePoster, Box, NavBar } from "../components";

export type FavoriteMoviesViewProps = {
  goToDetails: (movieId?: number) => void;
};

export function FavoriteMoviesView(props: FavoriteMoviesViewProps) {
  const { width } = useWindowDimensions();
  const columnWidth = useMemo(() => (width - 40 - 2 * 8) / 3, [width]);
  const { favoriteMovies } = useFavoriteMovies();

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
      <NavBar hideButtons title="My favorite movies" />
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
              <MoviePoster
                width={columnWidth}
                height={200}
                posterUrl={info.item.posterPath}
                onPress={() => props.goToDetails(info.item.id)}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  );
}
