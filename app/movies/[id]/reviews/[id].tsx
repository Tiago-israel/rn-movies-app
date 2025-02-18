import { useLocalSearchParams, router } from "expo-router";
import { MovieReviewsView } from "@/features";

export default function MovieReview() {
  const { id } = useLocalSearchParams<{ id: string }>();

  function goBack() {
    router.back();
  }

  return <MovieReviewsView movieId={Number(id)} goBack={goBack}/>;
}
