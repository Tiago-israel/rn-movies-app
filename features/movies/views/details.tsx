import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Linking,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { haptics } from "@/lib/haptics";
import { Image, StarRating, SkeletonPlaceholder } from "@/components";
import {
  NavBar,
  Pill,
  MovieCarousel,
  MediaGallery,
  TabsGroup,
  Modal,
  StatCard,
  AnimatedHero,
  CastList,
} from "../components";
import { useMovieDetails } from "../controllers";
import {
  watchlistEntryKey,
  watchlistItemFromMovieDetails,
} from "../helpers/watchlist-storage";
import { getText } from "../localization";
import { useUserStore } from "../store";
import type { Provider } from "../interfaces";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

const TAB_ITEMS = [
  { title: "Overview", testID: "details-tab-overview" },
  { title: "Cast", testID: "details-tab-cast" },
  { title: "Reviews", testID: "details-tab-reviews" },
  // { title: "Media" },
  // { title: "Similar" },
];

type WatchProviderItemProps = {
  item: Provider;
  index: number;
};

function WatchProviderItem({ item, index }: WatchProviderItemProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <Pressable
      onPress={() => {
        haptics.medium();
        Linking.openURL(item.link);
      }}
    >
      <Animated.View
        className="w-14 h-14 rounded-full overflow-hidden border-2 border-border"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>
    </Pressable>
  );
}

type MovieDetailsProps = {
  movieId: number;
  goBack: () => void;
  onPressReview: (movieId?: number) => void;
  onPressRecommendation: (movieId?: number) => void;
  onPressCast: (movieId?: number) => void;
  onShareMovie: (movieName?: string) => void;
};

export function MovieDetails(props: MovieDetailsProps) {
  const scrollViewRef = useRef<any>(null);
  const modalRef = useRef<any>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const {
    movie,
    isFavorite,
    recommendations,
    images,
    cast,
    watchProviders,
    onFavoriteMovie,
    isLoading,
  } = useMovieDetails(props.movieId);

  const watchlistItems = useUserStore((s) => s.watchlistItems);
  const addToWatchlist = useUserStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useUserStore((s) => s.removeFromWatchlist);

  const inWatchlist = useMemo(() => {
    const key = watchlistEntryKey({
      id: props.movieId,
      mediaType: "movie",
    });
    return watchlistItems.some((i) => watchlistEntryKey(i) === key);
  }, [watchlistItems, props.movieId]);

  const onToggleWatchlist = useCallback(() => {
    if (!movie?.id) return;
    haptics.medium();
    if (inWatchlist) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      const item = watchlistItemFromMovieDetails(movie);
      if (item) addToWatchlist(item);
    }
  }, [movie, inWatchlist, addToWatchlist, removeFromWatchlist]);

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo?.({ y: 0, animated: false });
    });
  }, []);

  const resetToFirstTab = useCallback(() => {
    setSelectedTab(0);
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  }, [fadeAnim, slideAnim]);

  useFocusEffect(
    useCallback(() => {
      resetToFirstTab();
      scrollToTop();
    }, [resetToFirstTab, scrollToTop])
  );

  useEffect(() => {
    resetToFirstTab();
    scrollToTop();
  }, [props.movieId, resetToFirstTab, scrollToTop]);

  useEffect(() => {
    if (!isLoading) scrollToTop();
  }, [isLoading, scrollToTop]);

  const animateTabChange = useCallback(
    (newIndex: number) => {
      haptics.light();
      console.log("animateTabChange", newIndex);
      // Fade out, slide, then fade in
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 20,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setSelectedTab(newIndex);
    },
    [fadeAnim, slideAnim]
  );

  const handleTabChange = useCallback(
    (index: number) => {
      console.log("handleTabChange", index);
      animateTabChange(index);
    },
    [animateTabChange]
  );

  if (isLoading) {
    return (
      <View className="h-full bg-background" testID="movie-details-screen">
        <NavBar onPressLeading={props.goBack} trainlingIcon={[]} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero placeholder (matches AnimatedHero 240px) */}
          <View
            className="relative border-b-2 border-border overflow-hidden"
            style={{ height: 240 }}
          >
            <SkeletonPlaceholder
              width={SCREEN_WIDTH}
              height={240}
              borderRadius={0}
            />
            {/* Title overlay card at bottom of hero */}
            <View className="absolute bottom-0 left-0 right-0 p-sm">
              <View className="bg-card/90 p-3 rounded-xl border-2 border-border">
                <SkeletonPlaceholder
                  width={CONTENT_WIDTH * 0.7}
                  height={22}
                  borderRadius={4}
                  style={{ marginBottom: 10 }}
                />
                <View className="flex-row gap-2">
                  <SkeletonPlaceholder width={70} height={26} borderRadius={999} />
                  <SkeletonPlaceholder width={85} height={26} borderRadius={999} />
                  <SkeletonPlaceholder width={75} height={26} borderRadius={999} />
                </View>
              </View>
            </View>
          </View>

          {/* Tabs placeholder (matches TabsGroup 32px rounded-full) */}
          <View className="px-sm py-4">
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={32}
              borderRadius={999}
            />
          </View>

          {/* Overview tab content skeleton */}
          <View>
            {/* Synopsis text lines */}
            <View className="px-5 mb-6">
              <SkeletonPlaceholder
                width={CONTENT_WIDTH}
                height={14}
                borderRadius={4}
                style={{ marginBottom: 10 }}
              />
              <SkeletonPlaceholder
                width={CONTENT_WIDTH}
                height={14}
                borderRadius={4}
                style={{ marginBottom: 10 }}
              />
              <SkeletonPlaceholder
                width={CONTENT_WIDTH * 0.9}
                height={14}
                borderRadius={4}
                style={{ marginBottom: 10 }}
              />
              <SkeletonPlaceholder
                width={CONTENT_WIDTH * 0.6}
                height={14}
                borderRadius={4}
              />
            </View>

            {/* Stats grid (2 cards side by side) */}
            <View className="flex-row w-full gap-3 mb-6 px-5">
              <View className="flex-1">
                <SkeletonPlaceholder
                  width="100%"
                  height={110}
                  borderRadius={8}
                />
              </View>
              <View className="flex-1">
                <SkeletonPlaceholder
                  width="100%"
                  height={110}
                  borderRadius={8}
                />
              </View>
            </View>

            {/* Watch providers section */}
            <View className="mb-6 px-5">
              <SkeletonPlaceholder
                width={160}
                height={18}
                borderRadius={4}
                style={{ marginBottom: 12 }}
              />
              <View className="flex-row gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <SkeletonPlaceholder
                    key={`provider-${i}`}
                    width={56}
                    height={56}
                    borderRadius={999}
                  />
                ))}
              </View>
            </View>

            {/* Media gallery section */}
            <View className="mb-4 px-5">
              <SkeletonPlaceholder
                width={120}
                height={18}
                borderRadius={4}
                style={{ marginBottom: 12 }}
              />
              <SkeletonPlaceholder
                width={CONTENT_WIDTH}
                height={180}
                borderRadius={16}
              />
            </View>

            {/* Recommendations carousel */}
            <View className="py-4">
              <SkeletonPlaceholder
                width={180}
                height={18}
                borderRadius={4}
                style={{ marginBottom: 12, marginLeft: 20 }}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <SkeletonPlaceholder
                    key={`rec-${i}`}
                    width={120}
                    height={180}
                    borderRadius={16}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const renderOverviewTab = () => (
    <View>
      <Text className="text-foreground text-base leading-7 mb-6 px-5">
        {movie?.overview}
      </Text>

      {/* Stats Grid */}
      <View className="flex-row w-full gap-3 mb-6 px-5">
        <StatCard
          title={getText("movie_details_reviews_title")}
          value={parseFloat(movie?.voteAverageStr || "0")}
          onPress={() => props.onPressReview?.()}
          animated
        >
          <View className="mt-2">
            <StarRating rating={movie?.voteAverage} color="#f1c40f" size={14} />
          </View>
        </StatCard>

        <StatCard title="Votes" value={movie?.voteCount || 0} animated>
          <Text className="text-xs text-muted-foreground mt-1">👍 Popular</Text>
        </StatCard>
      </View>

      {/* Where to Watch */}
      {watchProviders.length > 0 && (
        <View className="mb-6 px-5">
          <Text className="text-foreground font-bold text-lg mb-3">
            {getText("movie_details_watch_providers_title")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            {watchProviders.map((item, index) => (
              <WatchProviderItem
                key={`${item.id}-${index}`}
                item={item}
                index={index}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* CTA Button */}
      <View className="relative">
        <Text className="text-foreground font-bold text-lg mb-3 px-5">
          {getText("movie_details_companies_galeria_title")}
        </Text>
        <MediaGallery images={images} videoKey={movie.videoKey} />
      </View>

      <View className="py-4">
        <Text className="text-foreground font-bold text-lg mb-3 px-5">{getText("movie_details_you_also_may_like")}</Text>
        <MovieCarousel
          itemWidth={120}
          itemHeight={180}
          data={recommendations}
          onPressItem={(recommendationMovieId) => {
            props.onPressRecommendation?.(recommendationMovieId);
            scrollViewRef.current?.scrollTo?.({ y: 0, animated: true });
          }}
          onPressMoreOptions={() => { }}
        />
      </View>
    </View>
  );

  const renderCastTab = () => (
    <View className="px-5">
      <CastList
        cast={cast}
        onPressCast={(castId: number) => {
          modalRef.current?.open();
        }}
      />
    </View>
  );

  const renderReviewsTab = () => (
    <View className="px-5">
      <Pressable
        onPress={() => props.onPressReview?.()}
        className="border-2 border-border rounded-lg p-4 mb-4"
      >
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-foreground font-bold text-lg">
            {movie?.voteAverageStr}
          </Text>
          <StarRating rating={movie?.voteAverage} color="#f1c40f" size={18} />
        </View>
        <Text className="text-muted-foreground text-sm">
          Based on {movie?.voteCount?.toLocaleString()} reviews
        </Text>
        <View className="flex-row items-center mt-3">
          <Text className="text-foreground text-sm">View all reviews</Text>
          <Icon name="chevron-right" size={20} color="#666" />
        </View>
      </Pressable>
    </View>
  );

  const renderSimilarTab = () => (
    <View>
      <MovieCarousel
        itemWidth={120}
        itemHeight={180}
        data={recommendations}
        onPressItem={(recommendationMovieId) => {
          props.onPressRecommendation?.(recommendationMovieId);
          scrollViewRef.current?.scrollTo?.({ y: 0, animated: true });
        }}
        onPressMoreOptions={() => { }}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return renderOverviewTab();
      case 1:
        return renderCastTab();
      case 2:
        return renderReviewsTab();
      case 4:
        return renderSimilarTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <View className="h-full bg-background" testID="movie-details-screen">
      <NavBar
        trainlingIcon={[
          {
            name: "share-variant",
            onPress() {
              haptics.light();
              props.onShareMovie(movie?.videoUrl);
            },
          },
          {
            name: inWatchlist ? "bookmark" : "bookmark-outline",
            color: inWatchlist ? "#f1c40f" : undefined,
            onPress: onToggleWatchlist,
          },
          {
            name: isFavorite ? "heart" : "heart-outline",
            color: "#e74c3c",
            onPress: onFavoriteMovie,
          },
        ]}
        onPressLeading={props.goBack}
      />

      <ScrollView
        ref={scrollViewRef}
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero with Ken Burns Effect */}
        <AnimatedHero imageUri={movie?.backdropPath} height={240}>
          <View className="bg-background/90 p-3 rounded-xl border-2 border-border">
            <Text
              className="text-foreground text-lg font-bold mb-2"
              numberOfLines={2}
            >
              {movie?.title}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Pill>{`${movie?.genre}`}</Pill>
              <Pill>{`${movie?.releaseDate}`}</Pill>
              <Pill icon="clock">{movie?.runtime}</Pill>
            </View>
          </View>
        </AnimatedHero>

        {/* Tabs */}
        <View className="px-sm py-4">
          <TabsGroup
            items={TAB_ITEMS}
            selectedIndex={selectedTab}
            onPress={handleTabChange}
          />
        </View>

        {/* Tab Content with Animation */}
        <Animated.View
          //className="px-sm"
          style={{
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {renderTabContent()}
        </Animated.View>


      </ScrollView>

      {/* Modal for Cast Details */}
      <Modal ref={modalRef}>
        <View className="py-4">
          <Text className="text-foreground font-bold text-xl mb-4">
            Cast Member Details
          </Text>
          <Text className="text-muted-foreground">
            Detailed information about the cast member would appear here...
          </Text>
        </View>
      </Modal>
    </View>
  );
}
