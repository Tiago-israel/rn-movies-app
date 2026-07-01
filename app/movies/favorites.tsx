import { router } from "expo-router";
import {
  FavoriteMoviesView,
  type FavoriteMediaType,
} from "@/features";

export default function FavoritesScreen() {
  function goToDetails(id: number, mediaType: FavoriteMediaType = "movie") {
    if (mediaType === "tv") {
      router.push(`/movies/series/${id}`);
    } else {
      router.push(`/movies/${id}`);
    }
  }

  return (
    <FavoriteMoviesView
      onBack={() => router.back()}
      goToDetails={goToDetails}
    />
  );
}
