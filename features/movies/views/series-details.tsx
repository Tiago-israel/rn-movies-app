import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
import { haptics } from "@/lib/haptics";
import {
  BottomSheet,
  Image as ExpoImage,
  StarRating,
  SkeletonPlaceholder,
  List,
} from "@/components";
import {
  NavBar,
  Pill,
  MediaGallery,
  SeriesCarousel,
  TabsGroup,
  StatCard,
  AnimatedHero,
  CastList,
  Modal,
} from "../components";
import type { ModalRef } from "../components";
import { useSeriesDetails } from "../controllers";
import {
  watchlistEntryKey,
  watchlistItemFromSeriesDetails,
} from "../helpers/watchlist-storage";
import { getText } from "../localization";
import { useUserStore } from "../store";
import type { Cast, Episode, Provider } from "../interfaces";
import type { ListRenderItemInfo } from "@shopify/flash-list";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SeriesDetailsProps = {
  seriesId: number;
  goBack: () => void;
  onPressReview: (seriesId?: number) => void;
  onPressRecommendation: (seriesId?: number) => void;
  onPressCast: (seriesId?: number) => void;
  onShareSeries: (seriesName?: string) => void;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

const TAB_ITEMS = [
  { title: "Overview", testID: "series-tab-overview" },
  { title: "Episodes", testID: "series-tab-episodes" },
  { title: "Reviews", testID: "series-tab-reviews" },
];

// Scroll options
const SCROLL_TO_TOP_OPTIONS = { y: 0, animated: false as const };
const SCROLL_TO_TOP_ANIMATED_OPTIONS = { y: 0, animated: true as const };

// Content container styles
const SCROLL_CONTENT_STYLE = { paddingBottom: 80 };
const SEASON_LIST_CONTENT_STYLE = { paddingBottom: 60 };

// Loading skeleton styles
const LOADING_SCROLL_CONTENT_STYLE = { paddingHorizontal: 20, paddingBottom: 80 };
const LOADING_CONTENT_STYLE = { paddingTop: 8 };
const SKELETON_MB_8 = { marginBottom: 8 };
const SKELETON_MB_16 = { marginBottom: 16 };
const SKELETON_MB_24 = { marginBottom: 24 };
const SKELETON_MB_32 = { marginBottom: 32 };

// Icon colors
const ICON_WHITE = "#fff";
const ICON_RATING_COLOR = "#f1c40f";
const ICON_FAVORITE_COLOR = "#e74c3c";

// Episode item styles
const EPISODE_IMAGE_CONTAINER_STYLE = { width: 120, alignSelf: "stretch" as const };
const EPISODE_STILL_IMAGE_STYLE = {
  width: 120,
  flex: 1,
  backgroundColor: "#333",
};

// ---------------------------------------------------------------------------
// Animated Watch Provider (matching details.tsx pattern)
// ---------------------------------------------------------------------------

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
  }, [index, scaleAnim]);

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
        <ExpoImage
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
        />
      </Animated.View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Animated Episode Item
// ---------------------------------------------------------------------------

type EpisodeItemProps = {
  item: Episode;
  index: number;
  posterFallback?: string;
};

function EpisodeItem({ item, index, posterFallback }: EpisodeItemProps) {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const staggerIndex = Math.min(index, 15);
    const delay = staggerIndex * 50;
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <Animated.View
      className="flex-row rounded-lg overflow-hidden bg-card mx-5 mb-3 min-h-[100px] border border-border"
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <View style={EPISODE_IMAGE_CONTAINER_STYLE}>
        <ExpoImage
          source={{ uri: item.stillPath || posterFallback }}
          style={EPISODE_STILL_IMAGE_STYLE}
          contentFit="cover"
        />
      </View>
      <View className="flex-1 p-xs justify-between min-w-0 gap-2">
        <Text
          numberOfLines={2}
          className="text-foreground text-sm font-bold"
        >
          E{item.episodeNumber} · {item.name}
        </Text>
        {item.airDate ? (
          <Text className="text-card-foreground text-xs">{item.airDate}</Text>
        ) : null}
        {item.voteAverage > 0 && (
          <View className="flex-row items-center gap-1">
            <Icon name="star" size={12} color={ICON_RATING_COLOR} />
            <Text className="text-card-foreground text-xs">
              {item.voteAverage.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Key extractors
// ---------------------------------------------------------------------------

const episodeKeyExtractor = (item: Episode) => String(item.id);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SeriesDetailsView(props: SeriesDetailsProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const modalRef = useRef<ModalRef>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [episodesSheetVisible, setEpisodesSheetVisible] = useState(false);

  // Tab content animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const {
    series,
    isFavorite,
    recommendations,
    images,
    cast,
    restCast,
    watchProviders,
    episodes,
    onFavoriteSeries,
    isLoading,
  } = useSeriesDetails(props.seriesId, selectedSeason);

  const watchlistItems = useUserStore((s) => s.watchlistItems);
  const addToWatchlist = useUserStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useUserStore((s) => s.removeFromWatchlist);

  // -----------------------------------------------------------------------
  // Watchlist
  // -----------------------------------------------------------------------

  const inWatchlist = useMemo(() => {
    const key = watchlistEntryKey({ id: props.seriesId, mediaType: "tv" });
    return watchlistItems.some((i) => watchlistEntryKey(i) === key);
  }, [watchlistItems, props.seriesId]);

  const onToggleWatchlist = useCallback(() => {
    if (!series?.id) return;
    haptics.medium();
    if (inWatchlist) {
      removeFromWatchlist(series.id, "tv");
    } else {
      const item = watchlistItemFromSeriesDetails(series);
      if (item) addToWatchlist(item);
    }
  }, [series, inWatchlist, addToWatchlist, removeFromWatchlist]);

  // -----------------------------------------------------------------------
  // Season handling
  // -----------------------------------------------------------------------

  const numberOfSeasons = series?.numberOfSeasons ?? 0;
  const seasonOptions = useMemo(
    () =>
      Array.from({ length: numberOfSeasons }, (_, i) => ({
        value: i + 1,
        label: `Temp. ${i + 1}`,
      })),
    [numberOfSeasons],
  );

  const handleSelectSeason = useCallback((seasonValue: number) => {
    setSelectedSeason(seasonValue);
    setEpisodesSheetVisible(false);
  }, []);

  const createSelectSeasonHandler = useCallback(
    (seasonValue: number) => () => handleSelectSeason(seasonValue),
    [handleSelectSeason],
  );

  // -----------------------------------------------------------------------
  // Scroll helpers
  // -----------------------------------------------------------------------

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo?.(SCROLL_TO_TOP_OPTIONS);
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
    }, [resetToFirstTab, scrollToTop]),
  );

  useEffect(() => {
    setSelectedSeason(1);
    resetToFirstTab();
    scrollToTop();
  }, [props.seriesId, resetToFirstTab, scrollToTop]);

  useEffect(() => {
    if (!isLoading) scrollToTop();
  }, [isLoading, scrollToTop]);

  // -----------------------------------------------------------------------
  // Tab animation (matching details.tsx)
  // -----------------------------------------------------------------------

  const animateTabChange = useCallback(
    (newIndex: number) => {
      haptics.light();
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
    [fadeAnim, slideAnim],
  );

  const handleTabChange = useCallback(
    (index: number) => animateTabChange(index),
    [animateTabChange],
  );

  // -----------------------------------------------------------------------
  // Event handlers
  // -----------------------------------------------------------------------

  const handleOpenEpisodesSheet = useCallback(() => setEpisodesSheetVisible(true), []);
  const handleCloseEpisodesSheet = useCallback(() => setEpisodesSheetVisible(false), []);
  const handleShareSeries = useCallback(
    () => props.onShareSeries(series?.videoUrl),
    [props.onShareSeries, series?.videoUrl],
  );

  const handlePressRecommendation = useCallback(
    (recommendationSeriesId?: number) => {
      props.onPressRecommendation?.(recommendationSeriesId);
      scrollViewRef.current?.scrollTo?.(SCROLL_TO_TOP_ANIMATED_OPTIONS);
    },
    [props.onPressRecommendation],
  );

  // -----------------------------------------------------------------------
  // NavBar icons
  // -----------------------------------------------------------------------

  const navBarTrailingIcons = useMemo(
    () => [
      {
        name: "share-variant" as const,
        onPress: handleShareSeries,
      },
      {
        name: inWatchlist ? ("bookmark" as const) : ("bookmark-outline" as const),
        color: inWatchlist ? ICON_RATING_COLOR : undefined,
        onPress: onToggleWatchlist,
      },
      {
        name: isFavorite ? ("heart" as const) : ("heart-outline" as const),
        color: ICON_FAVORITE_COLOR,
        onPress: onFavoriteSeries,
      },
    ],
    [handleShareSeries, inWatchlist, onToggleWatchlist, isFavorite, onFavoriteSeries],
  );

  // -----------------------------------------------------------------------
  // Episode list renderer
  // -----------------------------------------------------------------------

  const renderEpisodeItem = useCallback(
    ({ item, index }: { item: Episode; index: number }) => (
      <EpisodeItem
        item={item}
        index={index}
        posterFallback={series?.posterPath}
      />
    ),
    [series?.posterPath],
  );

  // -----------------------------------------------------------------------
  // Season option renderer
  // -----------------------------------------------------------------------

  const renderSeasonOptionItem = useCallback(
    ({ item }: ListRenderItemInfo<{ value: number; label: string }>) => {
      const isSelected = selectedSeason === item.value;
      return (
        <Pressable
          key={item.value}
          className={`flex-row items-center gap-3 py-3.5 px-3 mb-2 rounded-sm bg-white/[0.08] ${isSelected ? "bg-white/[0.14]" : ""}`}
          onPress={createSelectSeasonHandler(item.value)}
        >
          <View className="w-[22px] h-[22px] rounded-[11px] border-2 border-white/50 items-center justify-center">
            {isSelected && <View className="w-3 h-3 rounded-full bg-white" />}
          </View>
          <Text className="text-base font-semibold text-foreground">
            {item.label}
          </Text>
        </Pressable>
      );
    },
    [selectedSeason, createSelectSeasonHandler],
  );

  // -----------------------------------------------------------------------
  // Tab content renderers
  // -----------------------------------------------------------------------

  const renderOverviewTab = () => (
    <View>
      {/* Synopsis */}
      <Text className="text-foreground text-base leading-7 mb-6 px-5">
        {series?.overview}
      </Text>

      {/* Stats Grid */}
      <View className="flex-row w-full gap-3 mb-6 px-5">
        <StatCard
          title={getText("movie_details_reviews_title")}
          value={parseFloat(series?.voteAverageStr || "0")}
          onPress={() => props.onPressReview?.()}
          animated
        >
          <View className="mt-2">
            <StarRating
              rating={series?.voteAverage}
              color={ICON_RATING_COLOR}
              size={14}
            />
          </View>
        </StatCard>

        <StatCard title="Votes" value={series?.voteCount || 0} animated>
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

      {/* Media Gallery */}
      <View className="relative">
        <Text className="text-foreground font-bold text-lg mb-3 px-5">
          {getText("movie_details_companies_galeria_title")}
        </Text>
        <MediaGallery images={images} videoKey={series?.videoKey} />
      </View>

      {/* Recommendations */}
      <View className="py-4">
        <Text className="text-foreground font-bold text-lg mb-3 px-5">
          {getText("movie_details_you_also_may_like")}
        </Text>
        <SeriesCarousel
          itemWidth={120}
          itemHeight={180}
          data={recommendations}
          onPressItem={handlePressRecommendation}
          onPressMoreOptions={() => {}}
        />
      </View>
    </View>
  );

  const renderEpisodesTab = () => (
    <View>
      {numberOfSeasons > 0 && (
        <>
          {/* Season Picker */}
          <View className="w-full flex-row items-center justify-between px-5 pb-4">
            <Text className="text-foreground text-lg font-bold" numberOfLines={1}>
              Episódios
            </Text>
            <Pressable
              onPress={handleOpenEpisodesSheet}
              className="bg-primary rounded-full px-sm py-xxs flex-row items-center gap-xs"
            >
              <Text className="text-foreground text-sm font-bold">
                Temp. {selectedSeason}
              </Text>
              <Icon
                name={episodesSheetVisible ? "chevron-up" : "chevron-down"}
                size={18}
                color={ICON_WHITE}
              />
            </Pressable>
          </View>

          {/* Season Bottom Sheet */}
          <BottomSheet
            visible={episodesSheetVisible}
            onClose={handleCloseEpisodesSheet}
            title="Escolher temporada"
            heightRatio={0.6}
          >
            <List
              showsVerticalScrollIndicator={false}
              data={seasonOptions}
              contentContainerStyle={SEASON_LIST_CONTENT_STYLE}
              renderItem={renderSeasonOptionItem}
            />
          </BottomSheet>

          {/* Episodes List */}
          <FlatList
            data={episodes}
            scrollEnabled={false}
            removeClippedSubviews
            keyExtractor={episodeKeyExtractor}
            initialNumToRender={20}
            showsVerticalScrollIndicator={false}
            renderItem={renderEpisodeItem}
          />
        </>
      )}
    </View>
  );

  const renderReviewsTab = () => (
    <View>
      {/* Review Card */}
      <View className="px-5 mb-6">
        <Pressable
          onPress={() => props.onPressReview?.()}
          className="border-2 border-border rounded-lg p-4 mb-4"
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-foreground font-bold text-lg">
              {series?.voteAverageStr}
            </Text>
            <StarRating rating={series?.voteAverage} color={ICON_RATING_COLOR} size={18} />
          </View>
          <Text className="text-muted-foreground text-sm">
            Based on {series?.voteCount?.toLocaleString()} reviews
          </Text>
          <View className="flex-row items-center mt-3">
            <Text className="text-foreground text-sm">View all reviews</Text>
            <Icon name="chevron-right" size={20} color="#666" />
          </View>
        </Pressable>
      </View>

      {/* Cast Section */}
      <View className="px-5">
        <Text className="text-foreground font-bold text-lg mb-3">
          {getText("movie_details_cast_title")}
        </Text>
        <CastList
          cast={cast as any}
          onPressCast={() => {
            modalRef.current?.open();
          }}
        />
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return renderOverviewTab();
      case 1:
        return renderEpisodesTab();
      case 2:
        return renderReviewsTab();
      default:
        return renderOverviewTab();
    }
  };

  // -----------------------------------------------------------------------
  // Loading State
  // -----------------------------------------------------------------------

  if (isLoading) {
    return (
      <View className="h-full bg-background" testID="series-details-screen">
        <NavBar onPressLeading={props.goBack} trainlingIcon={[]} />
        <ScrollView
          contentContainerStyle={LOADING_SCROLL_CONTENT_STYLE}
          showsVerticalScrollIndicator={false}
        >
          <View style={LOADING_CONTENT_STYLE}>
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.85}
              height={36}
              style={SKELETON_MB_16}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.6}
              height={28}
              style={SKELETON_MB_24}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={200}
              borderRadius={16}
              style={SKELETON_MB_16}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={16}
              style={SKELETON_MB_8}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.95}
              height={16}
              style={SKELETON_MB_8}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.7}
              height={16}
              style={SKELETON_MB_24}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={100}
              style={SKELETON_MB_32}
            />
            <SkeletonPlaceholder
              width={120}
              height={28}
              style={SKELETON_MB_16}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={72}
              style={SKELETON_MB_24}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // -----------------------------------------------------------------------
  // Main Render
  // -----------------------------------------------------------------------

  return (
    <View className="h-full bg-background" testID="series-details-screen">
      <NavBar
        trainlingIcon={navBarTrailingIcons}
        onPressLeading={props.goBack}
      />

      <ScrollView
        ref={scrollViewRef}
        nestedScrollEnabled
        contentContainerStyle={SCROLL_CONTENT_STYLE}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero with Ken Burns Effect */}
        <AnimatedHero imageUri={series?.backdropPath} height={240}>
          <View className="bg-background/90 p-3 rounded-xl border-2 border-border">
            <Text
              className="text-foreground text-lg font-bold mb-2"
              numberOfLines={2}
            >
              {series?.name}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Pill>{`${series?.genre}`}</Pill>
              <Pill>{`${series?.firstAirDate}`}</Pill>
              {series?.numberOfSeasons != null && (
                <Pill icon="television">
                  {`${series.numberOfSeasons} ${series.numberOfSeasons === 1 ? "Season" : "Seasons"}`}
                </Pill>
              )}
              {series?.numberOfEpisodes != null && (
                <Pill icon="film">{`${series.numberOfEpisodes} Episodes`}</Pill>
              )}
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
