import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  Text,
  Dimensions,
  RefreshControl,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQueryClient } from "@tanstack/react-query";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import {
  HomeTitle,
  HeroCarousel,
  MovieCarousel,
  SeriesCarousel,
  HomeGenreChips,
  TrendingHomeRow,
} from "../components";
import { SkeletonPlaceholder } from "@/components";
import {
  useMovieHome,
  useTVSeriesHome,
  useTrendingHome,
  TRENDING_HOME_QUERY_KEY,
  useHomeGenres,
} from "../controllers";
import { getText } from "../localization";
import { useUserStore } from "../store";
import type { ServiceType, Genre, SearchResultItem } from "../interfaces";

// ── Constants ──────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

// ── Props ──────────────────────────────────────────────────────────
export type HomeProps = {
  navigateToMovieDetails: (movieId: number) => void;
  navigateToSeriesDetails: (seriesId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => () => void;
  navigateToSearch: () => void;
  navigateToGenreDiscover: (args: {
    catalog: "movie" | "tv";
    genreId: number;
    title: string;
  }) => void;
};

// ── Animated section wrapper ───────────────────────────────────────
function AnimatedSection({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      {children}
    </Animated.View>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────
function HomeSkeleton() {
  return (
    <ScrollView
      bounces
      contentContainerStyle={{ paddingBottom: 200 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero placeholder */}
      <SkeletonPlaceholder
        width={CONTENT_WIDTH}
        height={200}
        borderRadius={16}
        style={{ marginHorizontal: 20, marginBottom: 24 }}
      />
      {/* Section placeholder */}
      <SkeletonPlaceholder
        width={140}
        height={22}
        style={{ marginHorizontal: 20, marginBottom: 16 }}
      />
      <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <SkeletonPlaceholder
            key={i}
            width={110}
            height={165}
            borderRadius={12}
          />
        ))}
      </View>
      {/* Second section placeholder */}
      <SkeletonPlaceholder
        width={140}
        height={22}
        style={{ marginHorizontal: 20, marginTop: 24, marginBottom: 16 }}
      />
      <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <SkeletonPlaceholder
            key={i}
            width={110}
            height={165}
            borderRadius={12}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// ── Main component ─────────────────────────────────────────────────
export function HomeView(props: HomeProps) {
  const language = useUserStore((s) => s.language);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // ── Data: Movies ──
  const {
    nowPlayingMovies = [],
    popularMovies = [],
    topRatedMovies = [],
    upcomingMovies = [],
    isLoading: isMoviesLoading,
  } = useMovieHome();

  // ── Data: Series ──
  const {
    onTheAir = [],
    popular: popularSeries = [],
    topRated: topRatedSeries = [],
    isLoading: isSeriesLoading,
  } = useTVSeriesHome();

  // ── Data: Shared ──
  const { trendingItems, trendingLoading } = useTrendingHome();
  const { data: movieGenres = [] } = useHomeGenres("movie");

  const isLoading = isMoviesLoading && isSeriesLoading;

  // ── Pull-to-refresh ──
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["nowPlayingMovies"] }),
        queryClient.invalidateQueries({ queryKey: ["popularMovies"] }),
        queryClient.invalidateQueries({ queryKey: ["topRatedMovies"] }),
        queryClient.invalidateQueries({ queryKey: ["upcomingMovies"] }),
        queryClient.invalidateQueries({ queryKey: ["airingToday"] }),
        queryClient.invalidateQueries({ queryKey: ["onTheAir"] }),
        queryClient.invalidateQueries({ queryKey: ["popular"] }),
        queryClient.invalidateQueries({ queryKey: ["topRated"] }),
        queryClient.invalidateQueries({ queryKey: TRENDING_HOME_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: ["homeGenres", "movie", language],
        }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, language]);

  // ── Navigation callbacks ──
  const onTrendingPress = useCallback(
    (item: SearchResultItem) => {
      if (item.mediaType === "movie") {
        props.navigateToMovieDetails(item.id);
      } else {
        props.navigateToSeriesDetails(item.id);
      }
    },
    [props.navigateToMovieDetails, props.navigateToSeriesDetails]
  );

  const onGenrePress = useCallback(
    (genre: Genre) => {
      props.navigateToGenreDiscover({
        catalog: "movie",
        genreId: genre.id,
        title: genre.name,
      });
    },
    [props.navigateToGenreDiscover]
  );

  // ── Loading state ──
  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <View className="px-sm pt-xs pb-xxs">
          <Text className="text-3xl font-extrabold text-foreground tracking-tight">
            {getText("home_header_title")}
          </Text>
        </View>
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ── */}
      <View className="px-sm pt-xs pb-xxs">
        <Text
          className="text-3xl font-extrabold text-foreground tracking-tight"
          accessibilityRole="header"
        >
          {getText("home_header_title")}
        </Text>
      </View>

      {/* ── Search bar ── */}
      <Pressable
        className="mx-sm mb-xs flex-row items-center gap-2 rounded-lg bg-secondary px-xs py-2.5"
        onPress={props.navigateToSearch}
        accessibilityRole="search"
        accessibilityLabel="Search movies and series"
      >
        <Icon name="magnify" size={20} color="#95a5a6" />
        <Text className="text-sm text-palette-concrete flex-1">
          {getText("search_idle_hint")}
        </Text>
      </Pressable>

      {/* ── Scrollable content ── */}
      <ScrollView
        bounces
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — Now Playing Movies */}
        <AnimatedSection delay={0}>
          <HeroCarousel
            data={nowPlayingMovies}
            onPressItem={props.navigateToMovieDetails}
          />
        </AnimatedSection>

        {/* Trending (mixed movies + series) */}
        <AnimatedSection delay={80}>
          <HomeTitle icon={{ name: "trending-up", color: "#e74c3c" }}>
            {getText("home_trending_title")}
          </HomeTitle>
          <TrendingHomeRow
            items={trendingItems}
            loading={trendingLoading}
            onSelectItem={onTrendingPress}
          />
        </AnimatedSection>

        {/* Genre chips (movies) */}
        <AnimatedSection delay={160}>
          <HomeTitle icon={{ name: "shape-outline", color: "#9b59b6" }}>
            {getText("home_genre_highlights")}
          </HomeTitle>
          <HomeGenreChips genres={movieGenres} onSelectGenre={onGenrePress} />
        </AnimatedSection>

        {/* Popular Movies */}
        <AnimatedSection delay={240}>
          <HomeTitle icon={{ name: "fire", color: "#d35400" }}>
            {getText("movie_home_popular")}
          </HomeTitle>
          <MovieCarousel
            data={popularMovies}
            onPressItem={props.navigateToMovieDetails}
            onPressMoreOptions={props.navigateToViewMore(
              "movies.popular",
              getText("movie_home_popular")
            )}
          />
        </AnimatedSection>

        {/* On The Air — Series */}
        <AnimatedSection delay={320}>
          <HomeTitle icon={{ name: "television-play", color: "#1abc9c" }}>
            {getText("tv_series_home_on_the_air")}
          </HomeTitle>
          <SeriesCarousel
            data={onTheAir}
            onPressItem={props.navigateToSeriesDetails}
            onPressMoreOptions={props.navigateToViewMore(
              "tv.on_the_air",
              getText("tv_series_home_on_the_air")
            )}
          />
        </AnimatedSection>

        {/* Top Rated Movies */}
        <AnimatedSection delay={400}>
          <HomeTitle icon={{ name: "trophy-outline", color: "#f1c40f" }}>
            {getText("movie_home_top_rated")}
          </HomeTitle>
          <MovieCarousel
            data={topRatedMovies}
            onPressItem={props.navigateToMovieDetails}
            onPressMoreOptions={props.navigateToViewMore(
              "movies.top_rated",
              getText("movie_home_top_rated")
            )}
          />
        </AnimatedSection>

        {/* Popular Series */}
        <AnimatedSection delay={480}>
          <HomeTitle icon={{ name: "star-circle-outline", color: "#1abc9c" }}>
            {getText("tv_series_home_popular")}
          </HomeTitle>
          <SeriesCarousel
            data={popularSeries}
            onPressItem={props.navigateToSeriesDetails}
            onPressMoreOptions={props.navigateToViewMore(
              "tv.popular",
              getText("tv_series_home_popular")
            )}
          />
        </AnimatedSection>

        {/* Upcoming Movies */}
        <AnimatedSection delay={560}>
          <HomeTitle icon={{ name: "calendar-clock", color: "#2980b9" }}>
            {getText("movie_home_upcoming")}
          </HomeTitle>
          <MovieCarousel
            data={upcomingMovies}
            onPressItem={props.navigateToMovieDetails}
            onPressMoreOptions={props.navigateToViewMore(
              "movies.upcoming",
              getText("movie_home_upcoming")
            )}
          />
        </AnimatedSection>

        {/* Top Rated Series */}
        <AnimatedSection delay={640}>
          <HomeTitle icon={{ name: "trophy-outline", color: "#1abc9c" }}>
            {getText("tv_series_home_top_rated")}
          </HomeTitle>
          <SeriesCarousel
            data={topRatedSeries}
            onPressItem={props.navigateToSeriesDetails}
            onPressMoreOptions={props.navigateToViewMore(
              "tv.top_rated",
              getText("tv_series_home_top_rated")
            )}
          />
        </AnimatedSection>
      </ScrollView>
    </View>
  );
}
