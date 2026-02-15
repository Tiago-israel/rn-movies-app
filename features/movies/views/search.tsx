import { View } from "react-native";
import { SearchField, SearchResults } from "../components";
import { useSearchMovies } from "../controllers";

export type SearchViewProps = {
  goToDetails: (movieId?: number) => void;
};

export function SearchView(props: SearchViewProps) {
  const { movies, onChangeText, clearList } = useSearchMovies();

  return (
    <View className="w-full h-full bg-background">
      <View className="w-full z-[999] absolute top-0 px-sm pt-sm bg-overlay">
        <SearchField onChangeText={onChangeText} onClear={clearList} />
      </View>
      <SearchResults movies={movies} onPress={props.goToDetails} />
    </View>
  );
}
