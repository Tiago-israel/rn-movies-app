import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  Linking,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
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
import { getText } from "../localization";
import type { Provider } from "../interfaces";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

const TAB_ITEMS = [
  { title: "Overview" },
  { title: "Cast" },
  { title: "Reviews" },
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo?.({ y: 0, animated: false });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollToTop();
    }, [scrollToTop])
  );

  useEffect(() => {
    scrollToTop();
  }, [props.movieId, scrollToTop]);

  useEffect(() => {
    if (!isLoading) scrollToTop();
  }, [isLoading, scrollToTop]);

  const animateTabChange = useCallback(
    (newIndex: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      <View className="h-full bg-background">
        <NavBar onPressLeading={props.goBack} trainlingIcon={[]} />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingTop: 8 }}>
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.85}
              height={36}
              style={{ marginBottom: 16 }}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.6}
              height={28}
              style={{ marginBottom: 24 }}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={200}
              borderRadius={16}
              style={{ marginBottom: 16 }}
            />
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
          <FlatList
            horizontal
            data={watchProviders}
            contentContainerStyle={{ gap: 12 }}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <WatchProviderItem item={item} index={index} />
            )}
          />
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
    <View className="h-full bg-background">
      <NavBar
        trainlingIcon={[
          {
            name: "share-variant",
            onPress() {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              props.onShareMovie(movie?.videoUrl);
            },
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
