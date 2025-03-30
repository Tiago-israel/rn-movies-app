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

  return (
    <PersonDetailsView personId={Number(id)} goBack={goBack} goToMovie={goToMovie} />
  );
}
