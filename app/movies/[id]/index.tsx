import { useLocalSearchParams, router } from "expo-router";
import { Share } from "react-native";
import { MovieDetails as MovieDetailsView, SeriesDetailsView as SeriesDetails, useMediaStore } from "@/features";

export default function MovieDetails() {
  const { isMovie } = useMediaStore();
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

  function onShareMovie(videoUrl = "") {
    Share.share({
      message: videoUrl,
    });
  }

  if (isMovie) {
    return (<MovieDetailsView
      movieId={Number(id)}
      goBack={goBack}
      onPressReview={goToReviews}
      onPressCast={goToCast}
      onPressRecommendation={goToRecommendation}
      onShareMovie={onShareMovie}
    />)
  }

  return <SeriesDetails
    seriesId={Number(id)}
    goBack={goBack}
    onPressReview={goToReviews}
    onPressCast={goToCast}
    onPressRecommendation={goToRecommendation}
    onShareSeries={onShareMovie}
  />;
}
