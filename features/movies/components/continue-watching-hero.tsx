import { Pressable, Text, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { AnimatedHero } from "./animated-hero";
import { ProgressBar } from "./progress-bar";
import type { WatchlistItem } from "../interfaces";

export type ContinueWatchingHeroProps = {
  item: WatchlistItem;
  onResume: () => void;
  onMarkWatched: () => void;
};

export function ContinueWatchingHero({
  item,
  onResume,
  onMarkWatched,
}: ContinueWatchingHeroProps) {
  const metaLine = item.isSeries
    ? `Ep ${item.currentEpisode ?? 1} of ${item.totalEpisodes ?? "?"} · ${item.genre ?? "Series"}`
    : `${item.genre ?? "Movie"}${item.runtime ? " · " + item.runtime : ""}`;

  const remaining = item.isSeries
    ? `${(item.totalEpisodes ?? 0) - (item.currentEpisode ?? 0)} ep left`
    : `${100 - item.progress}% remaining`;

  return (
    <View className="px-sm pt-xs pb-xxs">
      <View className="flex-row items-center mb-xxs" style={{ gap: 6 }}>
        <Icon name="play-circle-outline" size={13} color="#7f8c8d" />
        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
          Continue Watching
        </Text>
      </View>

      <View className="bg-card rounded-xl overflow-hidden">
        {/* Animated backdrop with title overlay */}
        <AnimatedHero
          imageUri={item.backdropPath ?? item.posterPath}
          height={148}
        >
          <View
            className="bg-overlay rounded-lg px-xs py-xxs"
            style={{ margin: 12 }}
          >
            <Text
              className="text-foreground font-bold text-sm"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-muted-foreground text-xs mt-1">
              {metaLine}
            </Text>
          </View>
        </AnimatedHero>

        {/* Progress bar */}
        <View className="bg-card px-xs pt-xxs">
          <View className="flex-row justify-between mb-1">
            <Text className="text-muted-foreground text-xs">
              {item.progress}% watched
            </Text>
            <Text className="text-muted-foreground text-xs">{remaining}</Text>
          </View>
          <ProgressBar progress={item.progress} height={5} />
        </View>

        {/* Action buttons */}
        <View
          className="flex-row bg-card px-xs pb-xs pt-xxs"
          style={{ gap: 10 }}
        >
          <Pressable
            onPress={onResume}
            className="flex-1 h-11 rounded-lg bg-foreground items-center justify-center flex-row"
            style={{ gap: 6 }}
          >
            <Icon name="play" size={16} color="#101218" />
            <Text className="text-background font-bold text-sm">Resume</Text>
          </Pressable>

          <Pressable
            onPress={onMarkWatched}
            className="flex-1 h-11 rounded-lg bg-secondary border border-border items-center justify-center flex-row"
            style={{ gap: 6 }}
          >
            <Icon name="check" size={16} color="#fff" />
            <Text className="text-foreground font-bold text-sm">
              Mark Watched
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
