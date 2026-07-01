import { useLocalSearchParams, router } from "expo-router";
import { Share } from "react-native";
import { SeriesDetailsView } from "@/features";

export default function SeriesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  function goBack() {
    router.back();
  }

  function goToReviews() {
    router.navigate(`/movies/series/${id}/reviews/${id}`);
  }

  function goToCast() {
    router.navigate(`/movies/series/${id}/cast/${id}`);
  }

  function goToRecommendation(seriesId?: number) {
    if (seriesId != null) {
      router.setParams({ id: String(seriesId) });
    }
  }

  async function onShareSeries(videoUrl?: string) {
    if (videoUrl) {
      Share.share({ message: videoUrl });
    }
  }

  return (
    <SeriesDetailsView
      seriesId={Number(id)}
      goBack={goBack}
      onPressReview={goToReviews}
      onPressCast={goToCast}
      onPressRecommendation={goToRecommendation}
      onShareSeries={onShareSeries}
    />
  );
}
