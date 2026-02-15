import { ScrollView, View, Dimensions } from "react-native";
import { useMovieHome } from "../controllers";
import { HomeTitle, HeroCarousel, MovieCarousel } from "../components";
import { SkeletonPlaceholder } from "@/components";
import { getText } from "../localization";
import { ServiceType } from "../interfaces";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

export type HomeMoviesProps = {
  navigateToMovieDetails: (movieId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => () => void;
};

export function HomeMoviesView(props: HomeMoviesProps) {
  const {
    nowPlayingMovies = [],
    popularMovies = [],
    topRatedMovies = [],
    upcomingMovies = [],
    isLoading,
  } = useMovieHome();

  if (isLoading) {
    return (
      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        <SkeletonPlaceholder
          width={CONTENT_WIDTH}
          height={200}
          borderRadius={16}
          style={{ marginHorizontal: 20, marginBottom: 24 }}
        />
        <SkeletonPlaceholder
          width={120}
          height={24}
          style={{ marginHorizontal: 20, marginBottom: 16 }}
        />
        <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonPlaceholder
              key={i}
              width={100}
              height={150}
              borderRadius={12}
            />
          ))}
        </View>
        <SkeletonPlaceholder
          width={120}
          height={24}
          style={{ marginHorizontal: 20, marginTop: 24, marginBottom: 16 }}
        />
        <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonPlaceholder
              key={i}
              width={100}
              height={150}
              borderRadius={12}
            />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      <HeroCarousel
        data={nowPlayingMovies}
        onPressItem={props.navigateToMovieDetails}
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
    </ScrollView>
  );
}
