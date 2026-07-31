import { useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  ImageBackground,
  Linking,
  useWindowDimensions,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Image, SkeletonPlaceholder } from "@/components";
import { haptics } from "@/lib/haptics";
import {
  IconButton,
  NavBar,
  Pill,
  ViewMoreText,
} from "../components";
import { usePerson } from "../controllers";

export type PersonDetailsViewProps = {
  personId: number;
  goBack: () => void;
  goToMovie: (movieId: number) => void;
  goToSeries?: (seriesId: number) => void;
};

const NUM_COLUMNS = 3;
const GRID_GAP = 8;
const HORIZONTAL_PADDING = 20;

export function PersonDetailsView(props: PersonDetailsViewProps) {
  const viewMoreTextRef = useRef<any>(null);
  const { width: screenWidth } = useWindowDimensions();
  const { person, credits, externalMedias, isLoading } = usePerson(
    props.personId
  );

  const contentWidth = screenWidth - HORIZONTAL_PADDING * 2;
  const columnWidth =
    (contentWidth - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
  const posterHeight = columnWidth * 1.5;

  useEffect(() => {
    viewMoreTextRef.current?.hideText?.();
  }, [props.personId]);

  if (isLoading) {
    return (
      <View className="w-full h-full bg-background">
        <NavBar
          onPressLeading={props.goBack}
          trainlingIcon={[]}
        />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <SkeletonPlaceholder
            width={contentWidth}
            height={300}
            borderRadius={0}
            style={{ marginBottom: 0 }}
          />
          <View style={{ paddingTop: 16 }}>
            <SkeletonPlaceholder
              width={contentWidth * 0.7}
              height={36}
              style={{ marginBottom: 16 }}
            />
            <SkeletonPlaceholder
              width={contentWidth * 0.4}
              height={28}
              style={{ marginBottom: 24 }}
            />
            <SkeletonPlaceholder
              width={contentWidth}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <SkeletonPlaceholder
              width={contentWidth * 0.9}
              height={16}
              style={{ marginBottom: 8 }}
            />
            <SkeletonPlaceholder
              width={contentWidth * 0.6}
              height={16}
              style={{ marginBottom: 32 }}
            />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: GRID_GAP,
                marginTop: 24,
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonPlaceholder
                  key={i}
                  width={columnWidth}
                  height={posterHeight}
                  borderRadius={16}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="w-full h-full bg-background">
      <NavBar
        onPressLeading={props.goBack}
        onPressTrailing={props.goBack}
      />
      <ScrollView
        bounces={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: person?.profilePath }}
          style={{ width: "100%", height: 300 }}
        >
          <FlatList
            data={externalMedias}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={{
              gap: 8,
              position: "absolute",
              bottom: 50,
              right: 0,
              paddingHorizontal: 10,
            }}
            renderItem={({ item }) => (
              <IconButton
                onPress={() => {
                  if (item.path) {
                    Linking.openURL(item.path);
                  }
                }}
              >
                <Icon
                  name={`logo-${item.media}` as any}
                  size={24}
                  color="#fff"
                />
              </IconButton>
            )}
          />
        </ImageBackground>
        <View
          className="pt-sm w-full bg-background rounded-tl-xl rounded-tr-xl -mt-[30px]"
        >
          <View className="w-full px-sm flex-row items-center justify-between">
            <Text className="text-foreground flex-1 text-3xl font-bold">
              {person?.name}
            </Text>
          </View>
          <View className="flex-row pt-xs gap-xxs px-sm">
            <Pill icon="star">{person?.birthday}</Pill>
            {person?.deathday ? (
              <Pill icon="cross">{person?.deathday}</Pill>
            ) : null}
          </View>
          <View className="py-5">
            {person?.biography ? (
              <ViewMoreText
                ref={viewMoreTextRef}
                className="text-palette-asbestos"
                fontSize={16}
                fontWeight={700}
                numberOfLines={4}
                containerStyle={{ py: "md", px: "sm" }}
              >
                {person?.biography}
              </ViewMoreText>
            ) : null}
          </View>

          {credits.length > 0 ? (
            <View
              style={{
                paddingHorizontal: HORIZONTAL_PADDING,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: GRID_GAP,
              }}
            >
              {credits.map((credit) => {
                const badgeLabel = credit.mediaType === "tv" ? "TV" : "Movie";
                return (
                  <Pressable
                    key={`${credit.mediaType}-${credit.id}`}
                    style={{ width: columnWidth }}
                    onPress={() => {
                      haptics.light();
                      if (credit.mediaType === "tv") {
                        props.goToSeries?.(credit.id);
                      } else {
                        props.goToMovie?.(credit.id);
                      }
                    }}
                    accessibilityLabel={
                      credit.title
                        ? `View ${credit.title} (${badgeLabel})`
                        : `View ${badgeLabel}`
                    }
                    accessibilityRole="button"
                  >
                    <View style={{ position: "relative" }}>
                      <Image
                        source={{ uri: credit.posterPath }}
                        style={{
                          width: columnWidth,
                          height: posterHeight,
                          borderRadius: 16,
                        }}
                      />
                      <View
                        className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded ${
                          credit.mediaType === "tv"
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      >
                        <Text className="text-foreground text-[10px] font-bold">
                          {badgeLabel}
                        </Text>
                      </View>
                    </View>
                    {credit.title ? (
                      <Text
                        className="text-muted-foreground text-xs mt-1.5"
                        numberOfLines={2}
                      >
                        {credit.title}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
