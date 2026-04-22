import { router } from "expo-router";
import { WatchlistView } from "@/features";
import type { WatchlistMediaType } from "@/features/movies/interfaces";

export default function WatchlistScreen() {
  function goToDetails(
    id?: number,
    options?: { mediaType?: WatchlistMediaType }
  ) {
    if (id == null) return;
    if (options?.mediaType === "tv") {
      router.navigate(`/movies/series/${id}`);
      return;
    }
    router.navigate(`/movies/${id}`);
  }

  function goToSearch() {
    router.navigate("/movies/search");
  }

  return (
    <WatchlistView
      onBack={() => router.back()}
      goToDetails={goToDetails}
      goToSearch={goToSearch}
    />
  );
}
