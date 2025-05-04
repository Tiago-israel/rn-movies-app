import { Box, HomeTitle, SeriesCarousel, Text } from "../components";
import { useTVSeriesHome } from "../controllers";
import { ServiceType } from "../interfaces";
import { getText } from "../localization";

export type HomeSeriesProps = {
  navigateToMovieDetails: (movieId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => () => void;
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
        onPressMoreOptions={props.navigateToViewMore?.(
          "tv.airing_today",
          getText("tv_series_home_airing_today")
        )}
      />
      <HomeTitle icon={{ name: "tv", color: "#2980b9" }}>
        {getText("tv_series_home_on_the_air")}
      </HomeTitle>
      <SeriesCarousel
        data={onTheAir}
        onPressItem={props.navigateToMovieDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "tv.on_the_air",
          getText("tv_series_home_on_the_air")
        )}
      />
      <HomeTitle icon={{ name: "fire-flame-curved", color: "#d35400" }}>
        {getText("tv_series_home_popular")}
      </HomeTitle>
      <SeriesCarousel
        data={popular}
        onPressItem={props.navigateToMovieDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "tv.popular",
          getText("tv_series_home_popular")
        )}
      />
      <HomeTitle icon={{ name: "trophy", color: "#f1c40f" }}>
        {getText("tv_series_home_top_rated")}
      </HomeTitle>
      <SeriesCarousel
        data={topRated}
        onPressItem={props.navigateToMovieDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "tv.top_rated",
          getText("tv_series_home_top_rated")
        )}
      />
    </Box>
  );
}
