import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheet,
  Image as ExpoImage,
  StarRating,
  SkeletonPlaceholder,
} from "@/components";
import {
  NavBar,
  Pill,
  MediaGallery,
  ViewMoreText,
  SeriesCarousel,
} from "../components";
import { useSeriesDetails } from "../controllers";
import type { Episode, Provider } from "../interfaces";
import { getText } from "../localization";

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

  const scrollToTop = React.useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo?.({ y: 0, animated: false });
    });
  }, []);

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
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={16}
              style={{ marginBottom: 8 }}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.95}
              height={16}
              style={{ marginBottom: 8 }}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH * 0.7}
              height={16}
              style={{ marginBottom: 24 }}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={100}
              style={{ marginBottom: 32 }}
            />
            <SkeletonPlaceholder
              width={120}
              height={28}
              style={{ marginBottom: 16 }}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={72}
              style={{ marginBottom: 24 }}
            />
            <SkeletonPlaceholder
              width={180}
              height={28}
              style={{ marginBottom: 16 }}
            />
            <SkeletonPlaceholder
              width={CONTENT_WIDTH}
              height={120}
              style={{ marginBottom: 24 }}
            />
            <SkeletonPlaceholder
              width={200}
              height={28}
              style={{ marginBottom: 16 }}
            />
            <SkeletonPlaceholder width={CONTENT_WIDTH} height={150} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="h-full bg-background">
      <NavBar
        trainlingIcon={[
          {
            name: "share-variant",
            onPress() {
              props.onShareSeries(series?.videoUrl);
            },
          },
          {
            name: isFavorite ? "heart" : "heart-outline",
            color: "#e74c3c",
            onPress: onFavoriteSeries,
          },
        ]}
        onPressLeading={props.goBack}
      />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 80 }}
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
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
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
              style={{ width: "100%", height: 200, borderRadius: 32 }}
            />
            <ViewMoreText
              fontSize={16}
              color="foreground"
              numberOfLines={5}
              containerStyle={{ p: "sm" }}
            >
              {series?.overview}
            </ViewMoreText>
          </View>
          <View className="gap-xs flex-row pt-sm">
            <Pressable
              className="flex-1 h-[100] rounded-lg p-xs bg-card justify-between overflow-hidden"
              onPress={props.onPressReview}
            >
              <View className="flex-row justify-between">
                <Text className="text-card-foreground text-sm">
                  {getText("movie_details_reviews_title")}
                </Text>
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Icon size={16} name="arrow-top-right" color="#fff" />
                </View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-foreground text-2xl">
                  {series?.voteAverageStr}
                </Text>
                <StarRating
                  rating={series?.voteAverage}
                  color="#f1c40f"
                  size={16}
                />
              </View>
            </Pressable>
            <Pressable
              className="flex-1 h-[100] bg-card rounded-lg p-xs justify-between"
              onPress={props.onPressCast}
            >
              <View className="flex-row justify-between">
                <Text className="text-card-foreground text-sm">
                  {getText("movie_details_cast_title")}
                </Text>
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Icon size={16} name="arrow-top-right" color="#fff" />
                </View>
              </View>
              <View className="flex-row gap-xxs items-center">
                <View className="flex-row">
                  {cast.slice(0, 4).map((member, index) => (
                    <View
                      key={member.id}
                      className="w-9 h-9 rounded-full border border-palette-wet-asphalt overflow-hidden z-[999] bg-white"
                      style={{
                        marginLeft: index !== 0 ? -10 : 0,
                      }}
                    >
                      <ExpoImage
                        source={{ uri: member.profilePath }}
                        style={{ width: 36, height: 36 }}
                        contentFit="cover"
                      />
                    </View>
                  ))}
                </View>
                {cast.length > 4 && (
                  <Text className="text-sm text-foreground">
                    +{cast.length - 4}
                  </Text>
                )}
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
                onPress={() => setEpisodesSheetVisible(true)}
                className="bg-primary rounded-full px-sm py-xxs flex-row items-center gap-xs"
              >
                <Text className="text-foreground text-sm font-bold">
                  Temp. {selectedSeason}
                </Text>
                <Icon
                  name={episodesSheetVisible ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#fff"
                />
              </Pressable>
            </View>
            <BottomSheet
              visible={episodesSheetVisible}
              onClose={() => setEpisodesSheetVisible(false)}
              title="Escolher temporada"
              heightRatio={0.6}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                data={seasonOptions}
                contentContainerStyle={{ paddingBottom: 60 }}
                renderItem={({ item }) => {
                  const isSelected = selectedSeason === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      style={[
                        seasonListStyles.row,
                        isSelected && seasonListStyles.rowSelected,
                      ]}
                      onPress={() => {
                        setSelectedSeason(item.value);
                        setEpisodesSheetVisible(false);
                      }}
                    >
                      <View style={seasonListStyles.radioOuter}>
                        {isSelected && (
                          <View style={seasonListStyles.radioInner} />
                        )}
                      </View>
                      <Text style={seasonListStyles.label}>{item.label}</Text>
                    </Pressable>
                  );
                }}
              />
            </BottomSheet>
            <FlatList
              data={episodes}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={episodeListStyles.listContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="flex-row rounded-lg overflow-hidden bg-card mx-sm mb-xs min-h-[100px]">
                  <View style={{ width: 120, alignSelf: "stretch" }}>
                    <ExpoImage
                      source={{ uri: item.stillPath || series?.posterPath }}
                      style={{
                        width: 120,
                        flex: 1,
                        backgroundColor: "#333",
                      }}
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
              )}
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
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              className="w-[72] h-[72] rounded-full overflow-hidden border-2 border-border"
              onPress={() => Linking.openURL(item.link)}
            >
              <ExpoImage
                source={{ uri: item.image }}
                style={{ width: "100%", height: "100%" }}
              />
            </Pressable>
          )}
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
          onPressItem={(recommendationSeriesId) => {
            props.onPressRecommendation?.(recommendationSeriesId);
            scrollViewRef.current?.scrollTo?.({
              y: 0,
              animated: true,
            });
          }}
          onPressMoreOptions={() => { }}
        />
      </ScrollView>
    </View>
  );
}

const episodeListStyles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 24,
    gap: 0,
  },
});

const seasonListStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  rowSelected: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
