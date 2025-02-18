import { useMemo } from "react";
import { useWindowDimensions, type ScrollViewProps } from "react-native";
import { SearchField, Box, SearchResults } from "../components";
import { useSearchMovies } from "../controllers";

export type SearchViewProps = {
  goToDetails: (movieId?: number) => void;
};

export function SearchView(props: SearchViewProps) {
  const { movies, onChangeText, clearList } = useSearchMovies();

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
      <Box
        width="100%"
        zIndex={999}
        position="absolute"
        top={0}
        px="sm"
        pt="sm"
        pb={40}
        backgroundColor="surface-overlay"
      >
        <SearchField onChangeText={onChangeText} onClear={clearList} />
      </Box>
      <SearchResults movies={movies} onPress={props.goToDetails} />
    </Box>
  );
}
