import React, { useEffect, useRef, useState, useCallback, } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  Linking,
  Dimensions,
  ListRenderItemInfo as ReactListRenderItemInfo
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheet,
  Image as ExpoImage,
  StarRating,
  SkeletonPlaceholder,
  List
} from "@/components";
import {
  NavBar,
  Pill,
  MediaGallery,
  ViewMoreText,
  SeriesCarousel,
} from "../components";
import { useSeriesDetails } from "../controllers";
import { getText } from "../localization";
import { Cast, Episode, Provider, TVSeriesListItem } from "../interfaces";
import { ListRenderItemInfo } from "@shopify/flash-list";

type SeriesDetailsProps = {
  seriesId: number;
  goBack: () => void;
  onPressReview: (seriesId?: number) => void;
  onPressRecommendation: (seriesId?: number) => void;
  onPressCast: (seriesId?: number) => void;
  onShareSeries: (seriesName?: string) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTENT_WIDTH = SCREEN_WIDTH - 40;

// Episode item styles
const EPISODE_IMAGE_CONTAINER_STYLE = { width: 120, alignSelf: "stretch" as const };
const EPISODE_STILL_IMAGE_STYLE = {
  width: 120,
  flex: 1,
  backgroundColor: "#333",
};

// Cast item styles
const CAST_AVATAR_STYLE = { width: 36, height: 36 };
const CAST_AVATAR_MARGIN = (index: number) => ({ marginLeft: index !== 0 ? -10 : 0 });

// Watch provider styles
const WATCH_PROVIDER_IMAGE_STYLE = { width: "100%" as const, height: "100%" as const };

// Loading skeleton styles
const LOADING_SCROLL_CONTENT_STYLE = { paddingHorizontal: 20, paddingBottom: 80 };
const LOADING_CONTENT_STYLE = { paddingTop: 8 };
const SKELETON_MB_16 = { marginBottom: 16 };
const SKELETON_MB_24 = { marginBottom: 24 };
const SKELETON_MB_8 = { marginBottom: 8 };
const SKELETON_MB_32 = { marginBottom: 32 };

// Scroll options
const SCROLL_TO_TOP_OPTIONS = { y: 0, animated: false as const };
const SCROLL_TO_TOP_ANIMATED_OPTIONS = { y: 0, animated: true as const };

// Content container styles
const SCROLL_CONTENT_STYLE = { paddingBottom: 80 };
const PILLS_CONTENT_STYLE = { gap: 8, paddingHorizontal: 20 };
const SEASON_LIST_CONTENT_STYLE = { paddingBottom: 60 };

// Backdrop image style
const BACKDROP_IMAGE_STYLE = {
  width: "100%" as const,
  height: 200,
  borderRadius: 32,
};

// ViewMoreText container
const VIEW_MORE_CONTAINER_STYLE = { p: "sm" as const };

// Icon colors
const ICON_WHITE = "#fff";
const ICON_RATING_COLOR = "#f1c40f";
const ICON_FAVORITE_COLOR = "#e74c3c";

// Key extractors
const episodeKeyExtractor = (item: Episode) => String(item.id);
const watchProviderKeyExtractor = (item: Provider, index: number) => `${item.id}-${index}`;

// Handler factories
const createOpenProviderHandler = (link: string) => () => Linking.openURL(link);
const noop = () => { };

export function SeriesDetailsView(props: SeriesDetailsProps) {
  const scrollViewRef = useRef<any>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodesSheetVisible, setEpisodesSheetVisible] = useState(false);
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

  const numberOfSeasons = series?.numberOfSeasons ?? 0;
  const seasonOptions = Array.from({ length: numberOfSeasons }, (_, i) => ({
    value: i + 1,
    label: `Temp. ${i + 1}`,
  }));

  const scrollToTop = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo?.(SCROLL_TO_TOP_OPTIONS);
    });
  }, []);

  const renderEpisodeItem = useCallback(({ item }: any) => {
    return (
      <View className="flex-row rounded-lg overflow-hidden bg-card mx-sm mb-xs min-h-[100px]">
        <View style={EPISODE_IMAGE_CONTAINER_STYLE}>
          <ExpoImage
            source={{ uri: item.stillPath || series?.posterPath }}
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
            <Text
              className="text-card-foreground text-xs"
            >
              {item.airDate}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }, [series?.posterPath]);

  const renderCastItem = useCallback(({ item, index }: ListRenderItemInfo<Cast>) => {
    return (
      <View
        key={item.id}
        className="w-9 h-9 rounded-full border border-palette-wet-asphalt overflow-hidden z-[999] bg-white"
        style={CAST_AVATAR_MARGIN(index)}
      >
        <ExpoImage
          source={{ uri: item.profilePath }}
          style={CAST_AVATAR_STYLE}
          contentFit="cover"
        />
      </View>
    )
  }, [])

  const renderWatchProviderItem = useCallback(({ item }: ReactListRenderItemInfo<Provider>) => {
    return (
      <Pressable
        className="w-[72] h-[72] rounded-full overflow-hidden border-2 border-border"
        onPress={createOpenProviderHandler(item.link)}
      >
        <ExpoImage
          source={{ uri: item.image }}
          style={WATCH_PROVIDER_IMAGE_STYLE}
        />
      </Pressable>
    )
  }, [])

  const handlePressReview = useCallback(() => props.onPressReview(), [props.onPressReview]);
  const handlePressCast = useCallback(() => props.onPressCast(), [props.onPressCast]);
  const handleOpenEpisodesSheet = useCallback(() => setEpisodesSheetVisible(true), []);
  const handleCloseEpisodesSheet = useCallback(() => setEpisodesSheetVisible(false), []);
  const handlePressMoreOptions = useCallback(noop, []);
  const handleShareSeries = useCallback(() => props.onShareSeries(series?.videoUrl), [props.onShareSeries, series?.videoUrl]);

  const handleSelectSeason = useCallback((seasonValue: number) => {
    setSelectedSeason(seasonValue);
    setEpisodesSheetVisible(false);
  }, []);

  const createSelectSeasonHandler = useCallback((seasonValue: number) => () => {
    handleSelectSeason(seasonValue);
  }, [handleSelectSeason]);

  const handlePressRecommendation = useCallback((recommendationSeriesId?: number) => {
    props.onPressRecommendation?.(recommendationSeriesId);
    scrollViewRef.current?.scrollTo?.(SCROLL_TO_TOP_ANIMATED_OPTIONS);
  }, [props.onPressRecommendation]);

  const renderSeasonOptionItem = useCallback(({ item }: ListRenderItemInfo<{ value: number; label: string }>) => {
    const isSelected = selectedSeason === item.value;
    return (
      <Pressable
        key={item.value}
        className={`flex-row items-center gap-3 py-3.5 px-3 mb-2 rounded-sm bg-white/[0.08] ${isSelected ? "bg-white/[0.14]" : ""}`}
        onPress={createSelectSeasonHandler(item.value)}
      >
        <View className="w-[22px] h-[22px] rounded-[11px] border-2 border-white/50 items-center justify-center">
          {isSelected && (
            <View className="w-3 h-3 rounded-full bg-white" />
          )}
        </View>
        <Text className="text-base font-semibold text-foreground">
          {item.label}
        </Text>
      </Pressable>
    );
  }, [selectedSeason, createSelectSeasonHandler]);

  const getEpisodeItemLayout = (_: any, index: number) => ({
    length: 100,
    offset: 100 * index,
    index
  })

  useFocusEffect(
    React.useCallback(() => {
      scrollToTop();
    }, [scrollToTop])
  );

  useEffect(() => {
    setSelectedSeason(1);
    scrollToTop();
  }, [props.seriesId, scrollToTop]);

  useEffect(() => {
    if (!isLoading) scrollToTop();
  }, [isLoading, scrollToTop]);

  if (isLoading) {
    return (
      <View className="h-full bg-background">
        <NavBar
          onPressLeading={props.goBack}
          trainlingIcon={[]}
        />
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
            <SkeletonPlaceholder
              width={180}
              height={28}
              style={SKELETON_MB_16}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={120}
              style={SKELETON_MB_24}
            />
            <SkeletonPlaceholder
              width={200}
              height={28}
              style={SKELETON_MB_16}
            />
            <SkeletonPlaceholder width={CONTENT_WIDTH} height={150} />
          </View>
        </ScrollView>
      </View>
    );
  }

  const navBarTrailingIcons = [
    {
      name: "share-variant" as const,
      onPress: handleShareSeries,
    },
    {
      name: isFavorite ? "heart" : "heart-outline",
      color: ICON_FAVORITE_COLOR,
      onPress: onFavoriteSeries,
    },
  ];

  return (
    <View className="h-full bg-background">
      <NavBar
        trainlingIcon={navBarTrailingIcons}
        onPressLeading={props.goBack}
      />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={SCROLL_CONTENT_STYLE}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="text-foreground text-3xl font-bold p-sm"
          numberOfLines={2}
        >
          {series?.name}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={PILLS_CONTENT_STYLE}
          className="pb-6 flex-row gap-2"
        >
          <Pill>{`${series?.genre}`}</Pill>
          <Pill>{`${series?.firstAirDate}`}</Pill>
          {series?.numberOfSeasons != null && (
            <Pill
              icon="television"
            >{`${series.numberOfSeasons} ${series.numberOfSeasons === 1 ? "Season" : "Seasons"}`}</Pill>
          )}
          {series?.numberOfEpisodes != null && (
            <Pill icon="film">{`${series.numberOfEpisodes} Episodes`}</Pill>
          )}
          <Pill icon="thumbs-up">{series?.voteCount}</Pill>
        </ScrollView>
        <View className="px-sm">
          <View className="border border-border rounded-t-xl rounded-bl-lg rounded-br-lg relative">
            <View className="w-12 h-12 absolute rounded-full -top-6 right-12 bg-background items-center justify-center z-[999]">
              <View className="w-6 h-1 bg-accent rounded-full" />
            </View>
            <ExpoImage
              source={{ uri: series?.backdropPath }}
              style={BACKDROP_IMAGE_STYLE}
            />
            <ViewMoreText
              fontSize={16}
              color="foreground"
              numberOfLines={5}
              containerStyle={VIEW_MORE_CONTAINER_STYLE}
            >
              {series?.overview}
            </ViewMoreText>
          </View>
          <View className="gap-xs flex-row pt-sm">
            <Pressable
              className="flex-1 h-[100] rounded-lg p-xs bg-card justify-between overflow-hidden"
              onPress={handlePressReview}
            >
              <View className="flex-row justify-between">
                <Text className="text-card-foreground text-sm">
                  {getText("movie_details_reviews_title")}
                </Text>
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Icon size={16} name="arrow-top-right" color={ICON_WHITE} />
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-foreground text-2xl">
                  {series?.voteAverageStr}
                </Text>
                <StarRating
                  rating={series?.voteAverage}
                  color={ICON_RATING_COLOR}
                  size={16}
                />
              </View>
            </Pressable>
            <Pressable
              className="flex-1 h-[100] bg-card rounded-lg p-xs justify-between"
              onPress={handlePressCast}
            >
              <View className="flex-row justify-between">
                <Text className="text-card-foreground text-sm">
                  {getText("movie_details_cast_title")}
                </Text>
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Icon size={16} name="arrow-top-right" color={ICON_WHITE} />
                </View>
              </View>
              <View className="h-[36] flex-row gap-xxs items-center">
                <List scrollEnabled={false} horizontal data={cast} renderItem={renderCastItem} />
                <Text className="text-sm text-foreground">
                  {restCast}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        {numberOfSeasons > 0 && (
          <View className="pt-md pb-sm w-full">
            <View className="w-full flex-row items-center justify-between px-sm pb-sm">
              <Text
                className="text-foreground text-2xl font-bold"
                numberOfLines={2}
              >
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
            <FlatList
              data={episodes}
              scrollEnabled={false}
              removeClippedSubviews
              getItemLayout={getEpisodeItemLayout}
              keyExtractor={episodeKeyExtractor}
              initialNumToRender={20}
              showsVerticalScrollIndicator={false}
              className="gap-xs"
              renderItem={renderEpisodeItem}
            />
          </View>
        )}
        {watchProviders.length > 0 && (
          <Text
            className="text-foreground font-bold text-2xl px-sm py-sm"
          >
            {getText("movie_details_watch_providers_title")}
          </Text>
        )}
        <FlatList
          horizontal
          data={watchProviders}
          className="px-sm"
          contentContainerClassName="gap-3"
          keyExtractor={watchProviderKeyExtractor}
          showsHorizontalScrollIndicator={false}
          renderItem={renderWatchProviderItem}
        />
        <Text
          className="text-foreground font-bold text-2xl pt-10 px-sm pb-sm"
          numberOfLines={2}
        >
          {getText("movie_details_companies_galeria_title")}
        </Text>
        <MediaGallery images={images} videoKey={series?.videoKey} />
        <Text
          className="text-foreground font-bold text-2xl p-sm"
          numberOfLines={2}
        >
          {getText("movie_details_you_also_may_like")}
        </Text>
        <SeriesCarousel
          itemWidth={100}
          itemHeight={150}
          data={recommendations}
          onPressItem={handlePressRecommendation}
          onPressMoreOptions={handlePressMoreOptions}
        />
      </ScrollView>
    </View>
  );
}