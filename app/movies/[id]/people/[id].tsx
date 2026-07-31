import { useLocalSearchParams, router } from "expo-router";
import { PersonDetailsView } from "@/features";

export default function MovieReview() {
  const { id } = useLocalSearchParams<{ id: string }>();

  function goBack() {
    router.back();
  }

  function goToMovie(movieId: number) {
    router.push(`/movies/${movieId}`);
  }

  function goToSeries(seriesId: number) {
    router.push(`/movies/series/${seriesId}`);
  }

  return (
    <PersonDetailsView
      personId={Number(id)}
      goBack={goBack}
      goToMovie={goToMovie}
      goToSeries={goToSeries}
    />
  );
}
