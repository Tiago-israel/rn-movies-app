import { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  Linking,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, StarRating } from "@/components";
import {
  NavBar,
  Pill,
  MovieCarousel,
  MediaGallery,
  ViewMoreText,
} from "../components";
import { useMovieDetails } from "../controllers";
import { Provider, type MovieDetails } from "../interfaces";
import { getText } from "../localization";

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
  const {
    movie,
    isFavorite,
    recommendations,
    images,
    cast,
    watchProviders,
    onFavoriteMovie,
  } = useMovieDetails(props.movieId);

  useEffect(() => {
    scrollViewRef.current?.scrollToOffset?.(0);
  }, [props.movieId]);

  return (
    <View className="h-full bg-background">
      <NavBar
        trainlingIcon={[
          {
            name: "share-variant",
            onPress() {
              props.onShareMovie(movie.videoUrl);
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
        <Text
          className="text-foreground text-3xl font-bold p-sm"
          numberOfLines={2}
        >
          {movie?.title}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
          className="pb-6 flex-row gap-2"
        >
          <Pill>{`${movie?.genre}`}</Pill>
          <Pill>{`${movie?.releaseDate}`}</Pill>
          <Pill icon="clock">{movie?.runtime}</Pill>
          <Pill icon="thumbs-up">{movie?.voteCount}</Pill>
        </ScrollView>
        <View className="px-sm">
          <View className="border border-border rounded-t-xl rounded-bl-lg rounded-br-lg relative">
            <View className="w-12 h-12 absolute rounded-full -top-6 right-12 bg-background items-center justify-center z-[999]">
              <View className="w-6 h-1 bg-accent rounded-full" />
            </View>
            <Image
              source={{ uri: movie?.backdropPath }}
              style={{ width: "100%", height: 200, borderRadius: 32 }}
            />
            <ViewMoreText
              fontSize={16}
              color="foreground"
              numberOfLines={5}
              containerStyle={{ p: "sm" }}
            >
              {movie?.overview}
            </ViewMoreText>
          </View>
          <View className="gap-xs flex-row pt-sm">
            <Pressable
              className="flex-1 h-[100] rounded-lg p-xs bg-card justify-between overflow-hidden"
              onPress={() => props.onPressReview?.()}
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
                  {movie?.voteAverageStr}
                </Text>
                <StarRating
                  rating={movie?.voteAverage}
                  color="#f1c40f"
                  size={16}
                />
              </View>
            </Pressable>
            <Pressable
              className="flex-1 h-[100] bg-card rounded-lg p-xs justify-between"
              onPress={() => props.onPressCast?.()}
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
                  {cast.slice(0, 4).map((c, index) => (
                    <View
                      key={index}
                      className="w-9 h-9 rounded-full border border-palette-wet-asphalt overflow-hidden z-[999] bg-white"
                      style={{ marginLeft: index !== 0 ? -10 : 0 }}
                    >
                      <Image
                        source={{ uri: c.profilePath }}
                        style={{ width: 36, height: 36 }}
                        contentFit="contain"
                      />
                    </View>
                  ))}
                </View>
                <Text className="text-sm text-foreground">
                  +{cast.length - 4}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
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
              <Image
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
        <MediaGallery images={images} videoKey={movie.videoKey} />
        <Text
          className="text-foreground font-bold text-2xl p-sm"
          numberOfLines={2}
        >
          {getText("movie_details_you_also_may_like")}
        </Text>
        <MovieCarousel
          itemWidth={100}
          itemHeight={150}
          data={recommendations}
          onPressItem={(recommendationMovieId) => {
            props.onPressRecommendation?.(recommendationMovieId);
            scrollViewRef.current?.scrollTo?.({
              y: 0,
              animated: true,
            });
          }}
          onPressMoreOptions={() => {}}
        />
      </ScrollView>
    </View>
  );
}
