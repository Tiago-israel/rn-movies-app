import { useLocalSearchParams, router } from "expo-router";
import { PersonDetailsView } from "@/features";

export default function SeriesPersonDetails() {
  const { personId } = useLocalSearchParams<{ personId: string }>();

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
      personId={Number(personId)}
      goBack={goBack}
      goToMovie={goToMovie}
      goToSeries={goToSeries}
    />
  );
}
