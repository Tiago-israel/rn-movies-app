import { router } from "expo-router";
import { Box, NavBar, Text } from "@/features/movies/components";
import { getText } from "@/features/movies/localization";

export default function SeriesReviews() {
  function goBack() {
    router.back();
  }

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
      <NavBar
        onPressLeading={goBack}
        onPressTrailing={goBack}
        title={getText("movie_details_reviews_title")}
      />
      <Box flex={1} justifyContent="center" alignItems="center" p="lg">
        <Text color="onSurface" fontSize={16}>
          Reviews for this series are not available yet.
        </Text>
      </Box>
    </Box>
  );
}
