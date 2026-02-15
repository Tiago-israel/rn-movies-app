import { ScrollView, View, Dimensions } from "react-native";
import { HomeTitle, HeroCarousel, SeriesCarousel } from "../components";
import { useTVSeriesHome } from "../controllers";
import { SkeletonPlaceholder } from "@/components";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;
import { ServiceType } from "../interfaces";
import { getText } from "../localization";

export type HomeSeriesProps = {
  navigateToSeriesDetails: (seriesId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => () => void;
};

export function HomeSeriesView(props: HomeSeriesProps) {
  const { airingToday, onTheAir, popular, topRated, isLoading } =
    useTVSeriesHome();

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
        data={airingToday}
        onPressItem={props.navigateToSeriesDetails}
      />
      <HomeTitle icon={{ name: "tv", color: "#2980b9" }}>
        {getText("tv_series_home_on_the_air")}
      </HomeTitle>
      <SeriesCarousel
        data={onTheAir}
        onPressItem={props.navigateToSeriesDetails}
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
        onPressItem={props.navigateToSeriesDetails}
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
        onPressItem={props.navigateToSeriesDetails}
        onPressMoreOptions={props.navigateToViewMore?.(
          "tv.top_rated",
          getText("tv_series_home_top_rated")
        )}
      />
    </ScrollView>
  );
}
