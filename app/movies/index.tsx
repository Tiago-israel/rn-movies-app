import { router } from "expo-router";
import { HomeMoviesView } from "@/features";

export default function MoviesHome() {
  function goToMovieDetails(movieId: number) {
    router.navigate(`/movies/${movieId}`);
  }

  return <HomeMoviesView navigateToMovieDetails={goToMovieDetails} />;
}
