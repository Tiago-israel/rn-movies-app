import { router } from "expo-router";
import { HomeView } from "@/features";

export default function MoviesHome() {
  function goToMovieDetails(movieId: number) {
    router.push(`/movies/${movieId}`);
  }

  return <HomeView navigateToMovieDetails={goToMovieDetails} />;
}
