import { router } from "expo-router";
import { HomeView } from "@/features";
import { ServiceType } from "@/features/movies/interfaces";

export default function MoviesHome() {
  function goToMovieDetails(movieId: number) {
    router.push(`/movies/${movieId}`);
  }

  function goToSeriesDetails(seriesId: number) {
    router.push(`/movies/series/${seriesId}`);
  }

  function goToViewMore(type: ServiceType, title: string) {
    return function () {
      router.push({ pathname: `/movies/view-more`, params: { type, title } });
    };
  }

  function goToSearch() {
    router.push("/movies/search");
  }

  function goToWatchlist() {
    router.push("/movies/watchlist");
  }

  function goToFavorites() {
    router.push("/movies/favorites");
  }

  function goToGenreDiscover(args: {
    catalog: "movie" | "tv";
    genreId: number;
    title: string;
  }) {
    const type: ServiceType =
      args.catalog === "movie" ? "movies.popular" : "tv.popular";
    router.push({
      pathname: "/movies/view-more",
      params: {
        type,
        title: args.title,
        genreIds: String(args.genreId),
      },
    });
  }

  return (
    <HomeView
      navigateToMovieDetails={goToMovieDetails}
      navigateToSeriesDetails={goToSeriesDetails}
      navigateToViewMore={goToViewMore}
      navigateToSearch={goToSearch}
      navigateToWatchlist={goToWatchlist}
      navigateToFavorites={goToFavorites}
      navigateToGenreDiscover={goToGenreDiscover}
    />
  );
}
