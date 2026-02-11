import { useEffect, useRef, useState } from "react";
import { FlatListProps, type ScrollViewProps, Linking, Pressable, StyleSheet, View, FlatList } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheet, Image, StarRating } from "@/components";
import {
  NavBar,
  Pill,
  Box,
  MediaGallery,
  ViewMoreText,
  Text,
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
  } = useSeriesDetails(props.seriesId, selectedSeason);

  const numberOfSeasons = series?.numberOfSeasons ?? 0;
  const seasonOptions = Array.from({ length: numberOfSeasons }, (_, i) => ({
    value: i + 1,
    label: `Temp. ${i + 1}`,
  }));

  useEffect(() => {
    scrollViewRef.current?.scrollToOffset?.(0);
    setSelectedSeason(1);
  }, [props.seriesId]);

  return (
    <Box height={"100%"} backgroundColor="surface">
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
      <Box<ScrollViewProps>
        innerRef={scrollViewRef}
        as="ScrollView"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Box
          as="Text"
          fontSize={28}
          color="onSurface"
          fontWeight={700}
          p="sm"
          numberOfLines={2}
        >
          {series?.name}
        </Box>
        <Box<ScrollViewProps>
          as="ScrollView"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            paddingHorizontal: 20,
          }}
          flexDirection="row"
          pb={24}
          gap={8}
        >
          <Pill children={`${series?.genre}`} />
          <Pill children={`${series?.firstAirDate}`} />
          {series?.numberOfSeasons != null && (
            <Pill
              icon="television"
              children={`${series.numberOfSeasons} ${series.numberOfSeasons === 1 ? "Season" : "Seasons"}`}
            />
          )}
          {series?.numberOfEpisodes != null && (
            <Pill icon="film" children={`${series.numberOfEpisodes} Episodes`} />
          )}
          <Pill icon="thumbs-up" children={series?.voteCount} />
        </Box>
        <Box px={"sm"}>
          <Box
            borderColor="onSurfaceBorder"
            borderWidth={1}
            borderTopRightRadius={"xl"}
            borderTopLeftRadius="xl"
            borderBottomEndRadius="lg"
            borderBottomStartRadius="lg"
            position="relative"
          >
            <Box
              width={48}
              height={48}
              position="absolute"
              borderRadius="full"
              top={-24}
              right={48}
              backgroundColor="surface"
              alignItems="center"
              justifyContent="center"
              zIndex={999}
            >
              <Box
                width={24}
                height={4}
                backgroundColor="alternates.primary"
                borderRadius="full"
              />
            </Box>

            <Image
              source={{
                uri: series?.backdropPath,
              }}
              style={{ width: "100%", height: 200, borderRadius: 32 }}
            />
            <ViewMoreText
              fontSize={16}
              color="onSurface"
              numberOfLines={5}
              containerStyle={{ p: "sm" }}
            >
              {series?.overview}
            </ViewMoreText>
          </Box>
          <Box gap={"xs"} flexDirection="row" pt={"sm"}>
            <Box
              as="Pressable"
              flex={1}
              height={100}
              borderRadius="lg"
              p="xs"
              backgroundColor="surfaceVariant"
              justifyContent="space-between"
              overflow="hidden"
              onPress={props.onPressReview}
            >
              <Box flexDirection="row" justifyContent="space-between">
                <Box as="Text" color="onSurfaceVariant" fontSize={14}>
                  {getText("movie_details_reviews_title")}
                </Box>
                <Box
                  width={24}
                  height={24}
                  borderRadius="full"
                  backgroundColor="primary"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size={16} name="arrow-top-right" color={"#fff"} />
                </Box>
              </Box>

              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box as="Text" color="onSurface" fontSize={24}>
                  {series?.voteAverageStr}
                </Box>
                <StarRating
                  rating={series?.voteAverage}
                  color="#f1c40f"
                  size={16}
                />
              </Box>
            </Box>

            <Box
              as="Pressable"
              flex={1}
              height={100}
              backgroundColor="surfaceVariant"
              borderRadius="lg"
              p="xs"
              justifyContent="space-between"
              onPress={props.onPressCast}
            >
              <Box flexDirection="row" justifyContent="space-between">
                <Box as="Text" color="onSurfaceVariant" fontSize={14}>
                  {getText("movie_details_cast_title")}
                </Box>
                <Box
                  width={24}
                  height={24}
                  borderRadius="full"
                  backgroundColor="primary"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size={16} name="arrow-top-right" color={"#fff"} />
                </Box>
              </Box>

              <Box flexDirection="row" gap={"xxs"} alignItems="center">
                <Box flexDirection="row">
                  {cast.slice(0, 4).map((member, index) => (
                    <Box
                      width={36}
                      height={36}
                      borderRadius="full"
                      borderColor="#34495e"
                      borderWidth={1}
                      key={member.id}
                      marginLeft={index !== 0 ? -10 : 0}
                      zIndex={999}
                      backgroundColor="white"
                      overflow="hidden"
                    >
                      <Box
                        as="Image"
                        source={{
                          uri: member.profilePath,
                        }}
                        width={36}
                        height={36}
                        borderRadius="full"
                        resizeMode="contain"
                      />
                    </Box>
                  ))}
                </Box>
                {cast.length > 4 && (
                  <Box as="Text" fontSize={14} color="onSurface">
                    +{cast.length - 4}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        {numberOfSeasons > 0 && (
          <Box pt="md" pb="sm" width={"100%"}>
            <Box
              width={"100%"}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              px="sm"
              pb="sm"
            >
              <Text
                color="onSurface"
                fontSize={24}
                fontWeight={700}
                numberOfLines={2}
              >
                Episódios
              </Text>
              <Box
                as="Pressable"
                onPress={() => setEpisodesSheetVisible(true)}
                backgroundColor="primary"
                borderRadius="full"
                px="sm"
                py="xxs"
                flexDirection="row"
                alignItems="center"
                gap="xs"
              >
                <Text color="onPrimary" fontSize={14} fontWeight={600}>
                  Temp. {selectedSeason}
                </Text>
                <Icon
                  name={episodesSheetVisible ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#fff"
                />
              </Box>
            </Box>
            <BottomSheet
              visible={episodesSheetVisible}
              onClose={() => setEpisodesSheetVisible(false)}
              title="Escolher temporada"
              heightRatio={0.6}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                data={seasonOptions}  
                contentContainerStyle={{ paddingBottom: 60}}
                renderItem={({item}) => {
                  const isSelected = selectedSeason === item.value;
                  return ( <Pressable
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
                      {isSelected && <View style={seasonListStyles.radioInner} />}
                    </View>
                    <Text style={seasonListStyles.label}>{item.label}</Text>
                  </Pressable>)
                }}
              />
            </BottomSheet>
            <Box<FlatListProps<Episode>>
              as="FlatList"
              data={episodes}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={episodeListStyles.listContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Box
                  flexDirection="row"
                  borderRadius="lg"
                  overflow="hidden"
                  backgroundColor="surfaceVariant"
                  mx="sm"
                  mb="xs"
                >
                  <Box
                    as="Image"
                    source={{ uri: item.stillPath || series?.posterPath }}
                    width={120}
                    height={"100%"}
                    style={{ backgroundColor: "#333" }}
                    resizeMode="cover"
                  />
                  <Box flex={1} p="xs" justifyContent="center" minWidth={0}>
                    <Text
                      color="onSurface"
                      fontSize={14}
                      fontWeight={600}
                      numberOfLines={2}
                    >
                      E{item.episodeNumber} · {item.name}
                    </Text>
                    {item.airDate ? (
                      <Text color="onSurfaceVariant" fontSize={12} pt="xxs">
                        {item.airDate}
                      </Text>
                    ) : null}
                  </Box>
                </Box>
              )}
            />
          </Box>
        )}
        {watchProviders.length > 0 && (
          <Text
            color="onSurface"
            paddingHorizontal={"sm"}
            paddingVertical={"sm"}
            fontWeight={700}
            fontSize={24}
          >
            {getText("movie_details_watch_providers_title")}
          </Text>
        )}
        <Box<FlatListProps<Provider>>
          as="FlatList"
          horizontal
          data={watchProviders}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <Box
                as="Pressable"
                width={72}
                height={72}
                borderRadius="full"
                overflow="hidden"
                borderColor="#ccc"
                borderWidth={2}
                onPress={() => {
                  Linking.openURL(item.link);
                }}
              >
                <Box
                  as="Image"
                  width={"100%"}
                  height={"100%"}
                  source={{ uri: item.image }}
                />
              </Box>
            );
          }}
        />
        <Box
          as="Text"
          fontSize={24}
          color="onSurface"
          fontWeight={700}
          pt={40}
          px="sm"
          pb="sm"
          numberOfLines={2}
        >
          {getText("movie_details_companies_galeria_title")}
        </Box>
        <MediaGallery images={images} videoKey={series?.videoKey} />
        <Box
          as="Text"
          fontSize={24}
          color="onSurface"
          fontWeight={700}
          p="sm"
          numberOfLines={2}
        >
          {getText("movie_details_you_also_may_like")}
        </Box>
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
      </Box>
    </Box>
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
  scroll: {
    flexGrow: 1,
    paddingBottom: 100
  },
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
