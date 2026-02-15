import { router } from "expo-router";
import { View } from "react-native";
import { NavBar, Text } from "@/features/movies/components";
import { getText } from "@/features/movies/localization";

export default function SeriesReviews() {
  function goBack() {
    router.back();
  }

  return (
    <View className="w-full h-full bg-background">
      <NavBar
        onPressLeading={goBack}
        onPressTrailing={goBack}
        title={getText("movie_details_reviews_title")}
      />
      <View className="flex-1 justify-center items-center p-lg">
        <Text color="foreground" fontSize={16}>
          Reviews for this series are not available yet.
        </Text>
      </View>
    </View>
  );
}
