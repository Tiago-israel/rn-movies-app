import { Box, HomeTitle, SeriesCarousel, Text } from "../components";
import { useTVSeriesHome } from "../controllers";
import { getText } from "../localization";

export type HomeSeriesProps = {
  navigateToMovieDetails: (movieId: number) => void;
};

export function HomeSeriesView(props: HomeSeriesProps) {
  const { airingToday, onTheAir, popular, topRated } = useTVSeriesHome();

  return (
    <Box as="ScrollView" contentContainerStyle={{ paddingBottom: 200 }}>
      <HomeTitle icon={{ name: "tv", color: "#2980b9" }}>
        {getText("tv_series_home_airing_today")}
      </HomeTitle>
      <SeriesCarousel
        data={airingToday}
        onPressItem={props.navigateToMovieDetails}
      />
      <HomeTitle icon={{ name: "tv", color: "#2980b9" }}>
        {getText("tv_series_home_on_the_air")}
      </HomeTitle>
      <SeriesCarousel
        data={onTheAir}
        onPressItem={props.navigateToMovieDetails}
      />
      <HomeTitle icon={{ name: "fire-flame-curved", color: "#d35400" }}>
        {getText("tv_series_home_popular")}
      </HomeTitle>
      <SeriesCarousel
        data={popular}
        onPressItem={props.navigateToMovieDetails}
      />
      <HomeTitle icon={{ name: "trophy", color: "#f1c40f" }}>
        {getText("tv_series_home_top_rated")}
      </HomeTitle>
      <SeriesCarousel
        data={topRated}
        onPressItem={props.navigateToMovieDetails}
      />
    </Box>
  );
}
