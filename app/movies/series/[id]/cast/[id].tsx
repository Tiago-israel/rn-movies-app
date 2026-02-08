import { useLocalSearchParams, router } from "expo-router";
import { SeriesCastView } from "@/features";

export default function SeriesCast() {
  const { id } = useLocalSearchParams<{ id: string }>();

  function goBack() {
    router.back();
  }

  function goToPerson(personId: number) {
    router.navigate(`/movies/series/${id}/people/${personId}`);
  }

  return (
    <SeriesCastView
      seriesId={Number(id)}
      goBack={goBack}
      goToPerson={goToPerson}
    />
  );
}
