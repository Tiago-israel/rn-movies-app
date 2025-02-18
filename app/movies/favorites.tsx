import { router } from "expo-router";
import { FavoriteMoviesView } from "@/features";

export default function Favorites() {
  function goToMovieDetails(movieId?: number) {
    router.navigate(`/movies/${movieId}`);
  }
  return <FavoriteMoviesView goToDetails={goToMovieDetails} />;
}
