import { useMovieHome } from "../controllers";
import { HomeTitle, MovieCarousel, Box } from "../components";
import { getText } from "../localization";

export type HomeMoviesProps = {
  navigateToMovieDetails: (movieId: number) => void;
};

export function HomeMoviesView(props: HomeMoviesProps) {
  const { nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies } =
    useMovieHome();

  return (
    <Box as="ScrollView" contentContainerStyle={{ paddingBottom: 200 }}>
      <HomeTitle icon={{ name: "film", color: "#2980b9" }}>
        {getText("movie_home_now_playing")}
      </HomeTitle>
      <MovieCarousel
        data={nowPlayingMovies}
        onPressItem={props.navigateToMovieDetails}
      />
      <HomeTitle icon={{ name: "fire-flame-curved", color: "#d35400" }}>
        {getText("movie_home_popular")}
      </HomeTitle>
      <MovieCarousel
        data={popularMovies}
        onPressItem={props.navigateToMovieDetails}
      />
      <HomeTitle icon={{ name: "trophy", color: "#f1c40f" }}>
        {getText("movie_home_top_rated")}
      </HomeTitle>
      <MovieCarousel
        data={topRatedMovies}
        onPressItem={props.navigateToMovieDetails}
      />
      <HomeTitle icon={{ name: "clock", color: "#2980b9" }}>
        {getText("movie_home_upcoming")}
      </HomeTitle>
      <MovieCarousel
        data={upcomingMovies}
        onPressItem={props.navigateToMovieDetails}
      />
    </Box>
  );
}
