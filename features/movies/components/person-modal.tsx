import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  useWindowDimensions,
} from "react-native";
import { haptics } from "@/lib/haptics";
import {
  Image,
  SkeletonPlaceholder,
  BottomSheet,
  BottomSheetScrollView,
} from "@/components";
import { IconButton } from "./Icon-button";
import { Pill } from "./pill";
import { ViewMoreText } from "./view-more-text";
import { usePerson, type PersonCredit } from "../controllers";
import type { MediaItem } from "../interfaces";

const NUM_COLUMNS = 3;
const GRID_GAP = 8;
/** Matches `BottomSheet` `sheetInner.paddingHorizontal`. */
const HORIZONTAL_PADDING = 16;
const MAX_CREDITS = 21;

// Map external media names to MaterialCommunityIcons names
const SOCIAL_ICON_MAP: Record<string, string> = {
  facebook: "facebook",
  instagram: "instagram",
  twitter: "twitter",
  tiktok: "music-note",
  youtube: "youtube",
  imdb: "movie-open",
};

export type PersonModalProps = {
  personId: number | null;
  onClose?: () => void;
  onPressMovie?: (movieId: number) => void;
  onPressSeries?: (seriesId: number) => void;
};

export type PersonModalRef = {
  open: () => void;
  close: () => void;
};

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function PersonModalSkeleton({
  columnWidth,
  posterHeight,
}: {
  columnWidth: number;
  posterHeight: number;
}) {
  const contentWidth = columnWidth * NUM_COLUMNS + GRID_GAP * (NUM_COLUMNS - 1);

  return (
    <View className="items-center pt-2 pb-4">
      <SkeletonPlaceholder
        width={120}
        height={120}
        borderRadius={60}
        style={{ marginBottom: 12 }}
      />
      <SkeletonPlaceholder
        width={contentWidth * 0.55}
        height={28}
        borderRadius={4}
        style={{ marginBottom: 12 }}
      />
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <SkeletonPlaceholder width={120} height={36} borderRadius={999} />
        <SkeletonPlaceholder width={90} height={36} borderRadius={999} />
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        <SkeletonPlaceholder width={40} height={40} borderRadius={20} />
        <SkeletonPlaceholder width={40} height={40} borderRadius={20} />
        <SkeletonPlaceholder width={40} height={40} borderRadius={20} />
      </View>
      <View style={{ width: "100%", marginBottom: 20 }}>
        <SkeletonPlaceholder
          width={contentWidth}
          height={14}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />
        <SkeletonPlaceholder
          width={contentWidth * 0.95}
          height={14}
          borderRadius={4}
          style={{ marginBottom: 8 }}
        />
        <SkeletonPlaceholder
          width={contentWidth * 0.7}
          height={14}
          borderRadius={4}
        />
      </View>
      <View style={{ width: "100%" }}>
        <SkeletonPlaceholder
          width={100}
          height={18}
          borderRadius={4}
          style={{ marginBottom: 12 }}
        />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: GRID_GAP,
          }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonPlaceholder
              key={`credit-skel-${i}`}
              width={columnWidth}
              height={posterHeight}
              borderRadius={12}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Social Link Button
// ---------------------------------------------------------------------------

function SocialLinkButton({ item }: { item: MediaItem }) {
  const iconName = SOCIAL_ICON_MAP[item.media] ?? "link";

  const handlePress = useCallback(() => {
    if (item.path) {
      haptics.light();
      Linking.openURL(item.path);
    }
  }, [item.path]);

  return (
    <IconButton
      icon={iconName}
      onPress={handlePress}
      accessibilityLabel={`Open ${item.media} profile`}
    />
  );
}

// ---------------------------------------------------------------------------
// Credit Card
// ---------------------------------------------------------------------------

type CreditCardProps = {
  credit: PersonCredit;
  width: number;
  height: number;
  onPressMovie?: (movieId: number) => void;
  onPressSeries?: (seriesId: number) => void;
};

function CreditCard({
  credit,
  width,
  height,
  onPressMovie,
  onPressSeries,
}: CreditCardProps) {
  const handlePress = useCallback(() => {
    haptics.light();
    if (credit.mediaType === "tv") {
      onPressSeries?.(credit.id);
    } else {
      onPressMovie?.(credit.id);
    }
  }, [credit.id, credit.mediaType, onPressMovie, onPressSeries]);

  const badgeLabel = credit.mediaType === "tv" ? "TV" : "Movie";

  return (
    <Pressable
      onPress={handlePress}
      style={{ width }}
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
            width,
            height,
            borderRadius: 12,
          }}
          contentFit="cover"
        />
        <View
          className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded ${
            credit.mediaType === "tv" ? "bg-primary" : "bg-secondary"
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
}

// ---------------------------------------------------------------------------
// PersonModalContent
// ---------------------------------------------------------------------------

type PersonModalContentProps = {
  isLoading: boolean;
  person: ReturnType<typeof usePerson>["person"];
  credits: ReturnType<typeof usePerson>["credits"];
  externalMedias: ReturnType<typeof usePerson>["externalMedias"];
  viewMoreRef: React.RefObject<any>;
  onPressMovie?: (movieId: number) => void;
  onPressSeries?: (seriesId: number) => void;
};

function PersonModalContent({
  isLoading,
  person,
  credits,
  externalMedias,
  viewMoreRef,
  onPressMovie,
  onPressSeries,
}: PersonModalContentProps) {
  const { width: screenWidth } = useWindowDimensions();
  const columnWidth = useMemo(
    () =>
      (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
      NUM_COLUMNS,
    [screenWidth]
  );
  const posterHeight = columnWidth * 1.5;

  return (
    <BottomSheetScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {isLoading ? (
        <PersonModalSkeleton
          columnWidth={columnWidth}
          posterHeight={posterHeight}
        />
      ) : (
        <View className="pt-2 pb-4">
          <View className="items-center mb-4">
            <View className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-border mb-3">
              <Image
                source={{ uri: person?.profilePath }}
                style={{ width: 120, height: 120 }}
                contentFit="cover"
              />
            </View>

            {person?.name ? (
              <Text className="text-foreground text-2xl font-bold text-center px-2 mb-3">
                {person.name}
              </Text>
            ) : null}

            {person?.birthday || person?.deathday ? (
              <View className="flex-row gap-2 flex-wrap justify-center mb-3">
                {person?.birthday ? (
                  <Pill icon="star">{`Born ${person.birthday}`}</Pill>
                ) : null}
                {person?.deathday ? (
                  <Pill icon="cross">{`Died ${person.deathday}`}</Pill>
                ) : null}
              </View>
            ) : null}

            {externalMedias.length > 0 ? (
              <View className="flex-row gap-2 justify-center">
                {externalMedias.map((item, idx) => (
                  <SocialLinkButton key={`${item.media}-${idx}`} item={item} />
                ))}
              </View>
            ) : null}
          </View>

          {/* Biography */}
          {person?.biography ? (
            <View className="mb-4">
              <ViewMoreText
                ref={viewMoreRef}
                className="text-muted-foreground"
                fontSize={14}
                fontWeight={400}
                numberOfLines={4}
              >
                {person.biography}
              </ViewMoreText>
            </View>
          ) : null}

          {/* Known For (Combined Movie & TV Credits) */}
          {credits.length > 0 ? (
            <View>
              <Text className="text-foreground font-bold text-base mb-3">
                Known For
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: GRID_GAP,
                }}
              >
                {credits.slice(0, MAX_CREDITS).map((credit) => (
                  <CreditCard
                    key={`${credit.mediaType}-${credit.id}`}
                    credit={credit}
                    width={columnWidth}
                    height={posterHeight}
                    onPressMovie={onPressMovie}
                    onPressSeries={onPressSeries}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      )}
    </BottomSheetScrollView>
  );
}

// ---------------------------------------------------------------------------
// PersonModal
// ---------------------------------------------------------------------------

export function PersonModal({
  personId,
  onClose,
  onPressMovie,
  onPressSeries,
}: PersonModalProps) {
  const [visible, setVisible] = useState(false);
  const viewMoreRef = useRef<any>(null);

  const enabled = personId != null && personId > 0;
  const { person, credits, externalMedias, isLoading } = usePerson(
    enabled ? personId : 0,
  );

  // Open sheet when personId is set
  useEffect(() => {
    if (enabled) {
      viewMoreRef.current?.hideText?.();
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [personId, enabled]);

  const handleClose = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

  const handlePressMovie = useCallback(
    (movieId: number) => {
      setVisible(false);
      onPressMovie?.(movieId);
    },
    [onPressMovie],
  );

  const handlePressSeries = useCallback(
    (seriesId: number) => {
      setVisible(false);
      onPressSeries?.(seriesId);
    },
    [onPressSeries],
  );

  if (!enabled) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      heightRatio={0.82}
      enableContentDrag
    >
      <PersonModalContent
        isLoading={isLoading}
        person={person}
        credits={credits}
        externalMedias={externalMedias}
        viewMoreRef={viewMoreRef}
        onPressMovie={handlePressMovie}
        onPressSeries={handlePressSeries}
      />
    </BottomSheet>
  );
}
