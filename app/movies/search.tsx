import { router } from "expo-router";
import { SearchView } from "@/features";

export default function Search() {
  function goToMovieDetails(movieId?: number) {
    router.navigate(`/movies/${movieId}`);
  }
  return <SearchView goToDetails={goToMovieDetails} />;
}
