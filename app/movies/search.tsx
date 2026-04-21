import { router } from "expo-router";
import { SearchView } from "@/features";
import type { SearchResultItem } from "@/features/movies/interfaces";

export default function Search() {
  function onSelectResult(item: SearchResultItem) {
    if (item.mediaType === "movie") {
      router.navigate(`/movies/${item.id}`);
      return;
    }
    if (item.mediaType === "tv") {
      router.navigate(`/movies/series/${item.id}`);
      return;
    }
    router.navigate(`/movies/series/0/people/${item.id}`);
  }

  return <SearchView onSelectResult={onSelectResult} />;
}
