import { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMovieHome,
  useTrendingHome,
  TRENDING_HOME_QUERY_KEY,
  useHomeGenres,
} from "../controllers";
import {
  HomeTitle,
  HeroCarousel,
  MovieCarousel,
  HomeGenreChips,
  TrendingHomeRow,
} from "../components";
import { SkeletonPlaceholder } from "@/components";
import { getText } from "../localization";
import { ServiceType } from "../interfaces";
import type { Genre } from "../interfaces";
import type { SearchResultItem } from "../interfaces";
import { useUserStore } from "../store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

export type HomeMoviesProps = {
  navigateToMovieDetails: (movieId: number) => void;
  navigateToSeriesDetails: (seriesId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => () => void;
  navigateToSearch?: () => void;
  navigateToGenreDiscover: (args: {
    catalog: "movie" | "tv";
    genreId: number;
    title: string;
  }) => void;
};

export function HomeMoviesView(props: HomeMoviesProps) {
  const language = useUserStore((s) => s.language);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    nowPlayingMovies = [],
    popularMovies = [],
    topRatedMovies = [],
    upcomingMovies = [],
    isLoading,
  } = useMovieHome();

  const { trendingItems, trendingLoading } = useTrendingHome();
  const { data: homeGenres = [] } = useHomeGenres("movie");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["nowPlayingMovies"] }),
        queryClient.invalidateQueries({ queryKey: ["popularMovies"] }),
        queryClient.invalidateQueries({ queryKey: ["topRatedMovies"] }),
        queryClient.invalidateQueries({ queryKey: ["upcomingMovies"] }),
        queryClient.invalidateQueries({ queryKey: TRENDING_HOME_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["homeGenres", "movie", language] }),
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
        catalog: "movie",
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
      nestedScrollEnabled
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      <HeroCarousel
        data={nowPlayingMovies}
        onPressItem={props.navigateToMovieDetails}
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
        onSelectItem={onTrendingPress}
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
