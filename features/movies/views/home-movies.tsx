import { useMovieHome } from "../controllers";
import { HomeTitle, MovieCarousel, Box } from "../components";
import { getText } from "../localization";
import { ServiceType } from "../interfaces";

export type HomeMoviesProps = {
  navigateToMovieDetails: (movieId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => () => void;
};

export function HomeMoviesView(props: HomeMoviesProps) {
  const { nowPlayingMovies = [], popularMovies = [], topRatedMovies = [], upcomingMovies = [] } =
    useMovieHome();

  return (
    <Box as="ScrollView" contentContainerStyle={{ paddingBottom: 200 }}>
      <HomeTitle icon={{ name: "film", color: "#2980b9" }}>
        {getText("movie_home_now_playing")}
      </HomeTitle>
      <MovieCarousel
        data={nowPlayingMovies}
        onPressItem={props.navigateToMovieDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "movies.now_playing",
          getText("movie_home_now_playing")
        )}
      />

      <HomeTitle icon={{ name: "trophy", color: "#f1c40f" }}>
        {getText("movie_home_top_rated")}
      </HomeTitle>
      <MovieCarousel
        data={topRatedMovies}
        onPressItem={props.navigateToMovieDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "movies.top_rated",
          getText("movie_home_top_rated")
        )}
      />
      <HomeTitle icon={{ name: "fire-flame-curved", color: "#d35400" }}>
        {getText("movie_home_popular")}
      </HomeTitle>
      <MovieCarousel
        data={popularMovies}
        onPressItem={props.navigateToMovieDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "movies.popular",
          getText("movie_home_popular")
        )}
      />
      <HomeTitle icon={{ name: "clock", color: "#2980b9" }}>
        {getText("movie_home_upcoming")}
      </HomeTitle>
      <MovieCarousel
        data={upcomingMovies}
        onPressItem={props.navigateToMovieDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "movies.upcoming",
          getText("movie_home_upcoming")
        )}
      />
    </Box>
  );
}
