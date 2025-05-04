import { router } from "expo-router";
import { HomeView } from "@/features";
import { ServiceType } from "@/features/movies/interfaces";

export default function MoviesHome() {
  function goToMovieDetails(movieId: number) {
    router.push(`/movies/${movieId}`);
  }

  function goToViewMore(type: ServiceType, title: string) {
    return function () {
      router.push({ pathname: `/movies/view-more`, params: { type, title } });
    };
  }

  return (
    <HomeView
      navigateToMovieDetails={goToMovieDetails}
      navigateToViewMore={goToViewMore}
    />
  );
}
