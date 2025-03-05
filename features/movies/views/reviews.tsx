import { Image, List, StarRating } from "@/components";
import { useMovieReview } from "../controllers";
import { MovieReview } from "../interfaces";
import { ScrollViewProps } from "react-native";
import { NavBar, Box, Text, ViewMoreText } from "../components";

export type MovieReviewsViewProps = {
  movieId: number;
  goBack: () => void;
};

export type AvatarProps = {
  initials?: string;
  urlImage?: string;
};

function Avatar(props: AvatarProps) {
  if (props.urlImage) {
    return (
      <Image
        source={{ uri: props.urlImage }}
        style={{ width: 32, height: 32, borderRadius: 999 }}
      />
    );
  }

  return (
    <Box
      width={32}
      height={32}
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#e74c3c"
    >
      <Box as="Text" color="#fff">
        {props.initials}
      </Box>
    </Box>
  );
}

function CommentItem(info: { item: MovieReview; index: number }) {
  return (
    <Box
      width="100%"
      alignItems="flex-start"
      flexDirection="row"
      gap="xs"
      p="sm"
    >
      <Avatar
        urlImage={info.item.avatar}
        initials={info.item.userName.slice(0, 2)}
      />
      <Box flexDirection="column" flex={1}>
        <Box flexDirection="row" alignItems="center" gap={"xxs"}>
          <Text fontSize={14} color="onSurface" fontWeight={700}>
            {info.item.userName}
          </Text>
          <Text fontSize={14} as="Text" color="#7f8c8d">
            {info.item.createdAt}
          </Text>
        </Box>
        <Box py="xxs">
          <StarRating rating={info.item.rating} />
        </Box>
        <ViewMoreText fontSize={16} numberOfLines={3} color="onSurface">
          {info.item.content}
        </ViewMoreText>
      </Box>
    </Box>
  );
}

export function MovieReviewsView(props: MovieReviewsViewProps) {
  const { movieReviews } = useMovieReview(props.movieId);

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
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
          <Box width="100%" height={1} backgroundColor="#bdc3c7" />
        )}
      />
    </Box>
  );
}
