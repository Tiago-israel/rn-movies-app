import { useLocalSearchParams, router } from "expo-router";
import { Share } from "react-native";
import { MovieDetails as MovieDetailsView } from "@/features";

export default function MovieDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  function goBack() {
    router.back();
  }

  function goToReviews() {
    router.navigate(`/movies/${id}/reviews/${id}`);
  }

  function goToCast() {
    router.navigate(`/movies/${id}/cast/${id}`);
  }

  function goToRecommendation(id?: number) {
    router.setParams({ id: id });
  }

  async function onShareMovie(videoUrl: string) {
    Share.share({
      message: videoUrl,
    });
  }

  return (
    <MovieDetailsView
      movieId={Number(id)}
      goBack={goBack}
      onPressReview={goToReviews}
      onPressCast={goToCast}
      onPressRecommendation={goToRecommendation}
      onShareMovie={onShareMovie}
    />
  );
}
