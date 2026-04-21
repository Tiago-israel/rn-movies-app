import { router } from "expo-router";
import { WatchlistView } from "@/features";

export default function Favorites() {
  function goToMovieDetails(movieId?: number) {
    router.navigate(`/movies/${movieId}`);
  }

  function goToSearch() {
    router.navigate("/movies/search");
  }

  return (
    <WatchlistView goToDetails={goToMovieDetails} goToSearch={goToSearch} />
  );
}
