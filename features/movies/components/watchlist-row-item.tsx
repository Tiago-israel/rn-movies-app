import { memo, useCallback, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { haptics } from "@/lib/haptics";
import { Image } from "@/components";
import { posterUrlFromTmdbPath } from "../helpers/watchlist-storage";
import { ProgressBar } from "./progress-bar";
import type { WatchlistItem, WatchStatus } from "../interfaces";

const STATUS_CONFIG: Record<
  WatchStatus,
  { label: string; icon: string; color: string }
> = {
  watching: { label: "Watching", icon: "play-circle-outline", color: "#3498db" },
  saved: { label: "Saved", icon: "bookmark-outline", color: "#7f8c8d" },
  watched: { label: "Watched", icon: "check-circle-outline", color: "#2ecc71" },
};

export type WatchlistRowItemProps = {
  item: WatchlistItem;
  onPress: () => void;
  onMarkWatched: () => void;
  onRemove: () => void;
};

export const WatchlistRowItem = memo(
  ({ item, onPress, onMarkWatched, onRemove }: WatchlistRowItemProps) => {
    const swipeRef = useRef<Swipeable>(null);
    const status = STATUS_CONFIG[item.watchStatus];

    const handleMarkWatched = useCallback(() => {
      haptics.success();
      swipeRef.current?.close();
      onMarkWatched();
    }, [onMarkWatched]);

    const handleRemove = useCallback(() => {
      haptics.warning();
      swipeRef.current?.close();
      onRemove();
    }, [onRemove]);

    const renderRightActions = useCallback(
      () => (
        <Pressable
          onPress={handleMarkWatched}
          className="w-24 items-center justify-center"
          style={{ backgroundColor: "#2ecc71" }}
        >
          <Icon name="check-circle-outline" size={24} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 11, marginTop: 4, fontWeight: "bold" }}>
            Watched
          </Text>
        </Pressable>
      ),
      [handleMarkWatched]
    );

    const renderLeftActions = useCallback(
      () => (
        <Pressable
          onPress={handleRemove}
          className="w-24 items-center justify-center"
          style={{ backgroundColor: "#e74c3c" }}
        >
          <Icon name="delete-outline" size={24} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 11, marginTop: 4, fontWeight: "bold" }}>
            Remove
          </Text>
        </Pressable>
      ),
      [handleRemove]
    );

    const metaText = item.isSeries
      ? `Ep ${item.currentEpisode ?? 1}/${item.totalEpisodes ?? "?"} · ${item.genre ?? "Series"}`
      : [item.genre, item.runtime ?? item.releaseDate].filter(Boolean).join(" · ");

    const posterUri =
      item.posterPath ?? posterUrlFromTmdbPath(item.posterImageId);

    return (
      <Swipeable
        ref={swipeRef}
        friction={2}
        leftThreshold={40}
        rightThreshold={40}
        renderRightActions={
          item.watchStatus !== "watched" ? renderRightActions : undefined
        }
        renderLeftActions={renderLeftActions}
      >
        <Pressable
          onPress={() => {
            haptics.light();
            onPress();
          }}
          className="flex-row items-center bg-background border-b border-border px-sm"
          style={{ paddingVertical: 10 }}
        >
          {/* Poster thumbnail */}
          <View
            className="rounded-lg overflow-hidden"
            style={{ width: 52, height: 76, marginRight: 12 }}
          >
            {posterUri ? (
              <Image
                source={{ uri: posterUri }}
                style={{ width: 52, height: 76 }}
                contentFit="cover"
              />
            ) : (
              <View
                className="bg-secondary items-center justify-center"
                style={{ width: 52, height: 76 }}
              >
                <Icon name="image-off-outline" size={22} color="#7f8c8d" />
              </View>
            )}
          </View>

          {/* Info column */}
          <View className="flex-1" style={{ marginRight: 10 }}>
            <Text
              className="text-foreground font-bold text-sm"
              numberOfLines={2}
              style={{ marginBottom: 2 }}
            >
              {item.title}
            </Text>
            <Text
              className="text-muted-foreground text-xs"
              numberOfLines={1}
              style={{ marginBottom: 4 }}
            >
              {metaText}
            </Text>

            {/* Progress bar for watching items */}
            {item.watchStatus === "watching" && (
              <View>
                <ProgressBar progress={item.progress} height={4} />
                <Text className="text-muted-foreground text-xs" style={{ marginTop: 3 }}>
                  {item.progress}% complete
                </Text>
              </View>
            )}

            {/* User rating for watched items */}
            {item.watchStatus === "watched" && item.userRating && (
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <Icon name="star" size={11} color="#f1c40f" />
                <Text className="text-muted-foreground text-xs">
                  Your rating: {item.userRating}/10
                </Text>
              </View>
            )}

            {/* Vote average for saved items */}
            {item.watchStatus === "saved" && item.voteAverage && (
              <View className="flex-row items-center" style={{ gap: 4 }}>
                <Icon name="star-outline" size={11} color="#7f8c8d" />
                <Text className="text-muted-foreground text-xs">
                  {item.voteAverageStr}/10
                </Text>
              </View>
            )}
          </View>

          {/* Status chip */}
          <View className="items-end" style={{ gap: 6 }}>
            <View
              className="flex-row items-center border border-border rounded-full"
              style={{ paddingHorizontal: 8, paddingVertical: 3, gap: 4 }}
            >
              <Icon
                name={status.icon as any}
                size={11}
                color={status.color}
              />
              <Text className="text-muted-foreground text-xs">
                {status.label}
              </Text>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    );
  }
);
