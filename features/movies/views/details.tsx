import { ReactNode, useRef } from "react";
import { useWindowDimensions, type ScrollViewProps } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { Image, StarRating } from "@/components";
import { NavBar, Pill, MovieCarousel, Box, MediaGallery } from "../components";
import { useMovieDetails } from "../controllers";
import { type MovieDetails } from "../interfaces";
import { getText } from "../localization";

type MovieDetailsProps = {
  movieId: number;
  goBack: () => void;
  onPressReview: (movieId?: number) => void;
  onPressRecommendation: (movieId?: number) => void;
  onShareMovie: (movieName: string) => void;
};

type MovieDetailsLoadingProps = {
  children?: ReactNode;
};

export function MovieDetailsLoading(props: MovieDetailsLoadingProps) {
  const { width, height } = useWindowDimensions();
  return (
    <Box width={width} height={height} backgroundColor="surface" px="sm">
      <ContentLoader
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <Rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
        <Rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
        <Rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
        <Rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
        <Rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
        <Circle cx="20" cy="20" r="20" />
      </ContentLoader>
    </Box>
  );
}

export function MovieDetails(props: MovieDetailsProps) {
  const scrollViewRef = useRef();
  const { movie, isFavorite, recommendations, images, onFavoriteMovie } =
    useMovieDetails(props.movieId);

  if (true) {
    return <MovieDetailsLoading />;
  }

  return (
    <Box height={"100%"} backgroundColor="surface">
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
      <Box<ScrollViewProps>
        innerRef={scrollViewRef}
        as="ScrollView"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Box
          as="Text"
          fontSize={48}
          color="onSurface"
          fontWeight={700}
          p="sm"
          numberOfLines={2}
        >
          {movie?.title}
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
          <Pill children={`${movie?.genre}`} />
          <Pill children={`${movie?.releaseDate}`} />
          <Pill icon="clock-o" children={movie?.runtime} />
          <Pill icon="thumbs-up" children={movie?.voteCount} />
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
                uri: movie?.backdropPath,
              }}
              style={{ width: "100%", height: 200, borderRadius: 32 }}
            />
            <Box p={"sm"}>
              <Box as="Text" fontSize={16} color="onSurface" numberOfLines={5}>
                {movie?.overview}
              </Box>
            </Box>
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
                  {movie?.voteAverageStr}
                </Box>
                <StarRating
                  rating={movie?.voteAverage}
                  color="#f1c40f"
                  size={16}
                />
              </Box>
            </Box>

            <Box
              flex={1}
              height={100}
              backgroundColor="surfaceVariant"
              borderRadius="lg"
              p="xs"
              justifyContent="space-between"
            >
              <Box as="Text" color="onSurfaceVariant" fontSize={14}>
                {getText("movie_details_companies_title")}
              </Box>
              <Box flexDirection="row" gap={"xxs"} alignItems="center">
                <Box flexDirection="row">
                  {movie?.companies?.slice(0, 4).map((companyImg, index) => (
                    <Box
                      width={36}
                      height={36}
                      borderRadius="full"
                      borderColor="#34495e"
                      borderWidth={1}
                      key={index}
                      marginLeft={index !== 0 ? -10 : 0}
                      zIndex={999}
                      backgroundColor="white"
                      overflow="hidden"
                    >
                      <Box
                        as="Image"
                        source={{
                          uri: companyImg,
                        }}
                        width={36}
                        height={36}
                        borderRadius="full"
                        resizeMode="contain"
                      />
                    </Box>
                  ))}
                </Box>
                <Box as="Text" fontSize={14} color="onSurface">
                  {movie?.restCompanies}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
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
        <MediaGallery images={images} videoKey={movie.videoKey} />
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
        />
      </Box>
    </Box>
  );
}
