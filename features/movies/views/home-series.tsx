import { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Dimensions,
  RefreshControl,
  Text,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import {
  HomeTitle,
  HeroCarousel,
  SeriesCarousel,
  HomeGenreChips,
  TrendingHomeRow,
} from "../components";
import {
  useTVSeriesHome,
  useTrendingHome,
  TRENDING_HOME_QUERY_KEY,
  useHomeGenres,
} from "../controllers";
import { SkeletonPlaceholder } from "@/components";
import { getText } from "../localization";
import { ServiceType, type Genre, type SearchResultItem } from "../interfaces";
import { useUserStore } from "../store";
import { getHomeStatusA11yLabel, HOME_STATUS_A11Y_ROLE } from "../constants/home-status-a11y";
import { getHomeStatusMessage } from "../constants/home-status-messages";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

export type HomeSeriesProps = {
  navigateToSeriesDetails: (seriesId: number) => void;
  navigateToMovieDetails: (movieId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => () => void;
  navigateToSearch?: () => void;
  navigateToGenreDiscover: (args: {
    catalog: "movie" | "tv";
    genreId: number;
    title: string;
  }) => void;
};

export function HomeSeriesView(props: HomeSeriesProps) {
  const language = useUserStore((s) => s.language);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { airingToday, onTheAir, popular, topRated, isLoading } =
    useTVSeriesHome();

  const { trendingItems, trendingLoading, trendingError, refetchTrending } =
    useTrendingHome();
  const { data: homeGenres = [] } = useHomeGenres("tv");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["airingToday"] }),
        queryClient.invalidateQueries({ queryKey: ["onTheAir"] }),
        queryClient.invalidateQueries({ queryKey: ["popular"] }),
        queryClient.invalidateQueries({ queryKey: ["topRated"] }),
        queryClient.invalidateQueries({ queryKey: TRENDING_HOME_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["homeGenres", "tv", language] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, language]);

  const onTrendingPress = useCallback(
    (item: SearchResultItem) => {
      if (item.mediaType === "movie") {
        props.navigateToMovieDetails(item.id);
      } else {
        props.navigateToSeriesDetails(item.id);
      }
    },
    [props]
  );

  const onGenrePress = useCallback(
    (genre: Genre) => {
      props.navigateToGenreDiscover({
        catalog: "tv",
        genreId: genre.id,
        title: genre.name,
      });
    },
    [props]
  );

  if (isLoading) {
    return (
      <ScrollView
        bounces
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
      bounces
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      <HeroCarousel
        data={airingToday}
        onPressItem={props.navigateToSeriesDetails}
      />
      <HomeTitle icon={{ name: "shape-outline", color: "#9b59b6" }}>
        {getText("home_genre_highlights")}
      </HomeTitle>
      <HomeGenreChips genres={homeGenres} onSelectGenre={onGenrePress} />
      <HomeTitle icon={{ name: "chart-line-variant", color: "#e74c3c" }}>
        {getText("home_trending_title")}
      </HomeTitle>
      <TrendingHomeRow
        items={trendingItems}
        loading={trendingLoading}
        error={trendingError}
        onRetry={() => {
          void refetchTrending();
        }}
        onSelectItem={onTrendingPress}
      />
      {!trendingLoading && !trendingItems.length && !trendingError ? (
        <Text
          className="px-5 pb-4 text-muted-foreground"
          accessibilityRole={HOME_STATUS_A11Y_ROLE}
        >
          {getHomeStatusA11yLabel("empty")}
        </Text>
      ) : null}
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
      {!onTheAir.length && !popular.length && !topRated.length ? (
        <Text className="px-5 text-muted-foreground pb-10">
          {getHomeStatusMessage("empty")}
        </Text>
      ) : null}
    </ScrollView>
  );
}
