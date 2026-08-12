import { useLocalSearchParams, router } from "expo-router";
import { Share } from "react-native";
import { MovieDetails as MovieDetailsView, SeriesDetailsView as SeriesDetails, useMediaStore } from "@/features";
import { getText } from "@/features/movies/localization";

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

  function goToMoreRecommendations() {
    router.push({
      pathname: "/movies/view-more",
      params: {
        type: "movies.recommendations",
        title: getText("movie_details_you_also_may_like"),
        mediaId: String(id),
      },
    });
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
      onPressMoreRecommendations={goToMoreRecommendations}
      onShareMovie={onShareMovie}
    />)
  }

  return <SeriesDetails
    seriesId={Number(id)}
    goBack={goBack}
    onPressReview={goToReviews}
    onPressCast={goToCast}
    onPressRecommendation={goToRecommendation}
    onPressMoreRecommendations={() => {
      router.push({
        pathname: "/movies/view-more",
        params: {
          type: "tv.recommendations",
          title: getText("movie_details_you_also_may_like"),
          mediaId: String(id),
        },
      });
    }}
    onShareSeries={onShareMovie}
  />;
}
