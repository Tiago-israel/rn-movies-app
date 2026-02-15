import { Image, List, StarRating, SkeletonPlaceholder } from "@/components";
import { useMovieReview } from "../controllers";
import { MovieReview } from "../interfaces";
import { NavBar, Text, ViewMoreText } from "../components";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";
import { useMemo } from "react";
import { View, ScrollView } from "react-native";

export type MovieReviewsViewProps = {
  movieId: number;
  goBack: () => void;
};

export type AvatarProps = {
  initials?: string;
  urlImage?: string;
};

function Avatar(props: AvatarProps) {
  const theme = useTheme<MovieTheme>();

  const randomColor = useMemo(() => {
    const colors = Object.values(theme.colors.palette);
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }, [theme.colors.palette]);

  if (props.urlImage) {
    return (
      <Image
        source={{ uri: props.urlImage }}
        style={{ width: 32, height: 32, borderRadius: 999 }}
      />
    );
  }

  return (
    <View
      className="w-8 h-8 rounded-full items-center justify-center"
      style={{ backgroundColor: randomColor }}
    >
      <Text className="text-white">{props.initials?.toUpperCase() ?? ""}</Text>
    </View>
  );
}

function CommentItem(info: { item: MovieReview; index: number }) {
  return (
    <View className="w-full items-start flex-row gap-xs p-sm">
      <Avatar
        urlImage={info.item.avatar}
        initials={info.item.userName.slice(0, 2)}
      />
      <View className="flex-col flex-1">
        <View className="flex-row items-center gap-xxs">
          <Text fontSize={14} color="foreground" fontWeight={700}>
            {info.item.userName}
          </Text>
          <Text fontSize={14} className="text-palette-asbestos">
            {info.item.createdAt}
          </Text>
        </View>
        <View className="py-xxs">
          <StarRating rating={info.item.rating} />
        </View>
        <ViewMoreText fontSize={16} numberOfLines={3} color="foreground">
          {info.item.content}
        </ViewMoreText>
      </View>
    </View>
  );
}

export function MovieReviewsView(props: MovieReviewsViewProps) {
  const { movieReviews, isLoading } = useMovieReview(props.movieId);

  if (isLoading) {
    return (
      <View className="w-full h-full bg-background">
        <NavBar
          onPressLeading={props.goBack}
          onPressTrailing={props.goBack}
          title="comments"
        />
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                <SkeletonPlaceholder width={32} height={32} borderRadius={999} />
                <View style={{ flex: 1 }}>
                  <SkeletonPlaceholder
                    width="80%"
                    height={16}
                    style={{ marginBottom: 8 }}
                  />
                  <SkeletonPlaceholder width={120} height={14} />
                </View>
              </View>
              <SkeletonPlaceholder
                width="100%"
                height={40}
                style={{ marginBottom: 8 }}
              />
              <SkeletonPlaceholder width="70%" height={16} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="w-full h-full bg-background">
      <NavBar
        onPressLeading={props.goBack}
        onPressTrailing={props.goBack}
        title={`comments (${movieReviews.length})`}
      />

      <List
        data={movieReviews}
        keyExtractor={(item, index) => `${item.userName}-${index}`}
        estimatedItemSize={70}
        renderItem={CommentItem}
        ItemSeparatorComponent={() => (
          <View className="w-full h-px bg-separator" />
        )}
      />
    </View>
  );
}
