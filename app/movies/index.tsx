import { useCallback } from "react";
import { router } from "expo-router";
import { HomeView } from "@/features";
import { ServiceType } from "@/features/movies/interfaces";

/**
 * Navegacao com callbacks estaveis: limita re-renders do HomeView na volta de detalhes
 * (cache do React Query + offset de scroll em `useHomeScrollPosition` preserva continuidade).
 */
export default function MoviesHome() {
  const goToMovieDetails = useCallback((movieId: number) => {
    router.push(`/movies/${movieId}`);
  }, []);

  const goToSeriesDetails = useCallback((seriesId: number) => {
    router.push(`/movies/series/${seriesId}`);
  }, []);

  const goToViewMore = useCallback((type: ServiceType, title: string) => {
    return function goToList() {
      router.push({ pathname: `/movies/view-more`, params: { type, title } });
    };
  }, []);

  const goToSearch = useCallback(() => {
    router.push("/movies/search");
  }, []);

  const goToWatchlist = useCallback(() => {
    router.push("/movies/watchlist");
  }, []);

  const goToFavorites = useCallback(() => {
    router.push("/movies/favorites");
  }, []);

  const goToGenreDiscover = useCallback(
    (args: { catalog: "movie" | "tv"; genreId: number; title: string }) => {
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
    },
    []
  );

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
