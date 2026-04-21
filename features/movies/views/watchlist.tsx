import { Text, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { List } from "@/components";
import { useWatchlist } from "../controllers";
import {
  NavBar,
  TabsGroup,
  ContinueWatchingHero,
  WatchlistRowItem,
  WatchlistFAB,
} from "../components";

export type WatchlistViewProps = {
  goToDetails: (movieId?: number) => void;
  goToSearch: () => void;
};

function SwipeHint() {
  return (
    <View
      className="flex-row items-center justify-center py-1 px-sm"
      style={{ gap: 4 }}
    >
      <Icon name="chevron-left" size={12} color="#7f8c8d" />
      <Text className="text-muted-foreground" style={{ fontSize: 10 }}>
        Swipe left · mark watched &nbsp;·&nbsp; Swipe right · remove
      </Text>
      <Icon name="chevron-right" size={12} color="#7f8c8d" />
    </View>
  );
}

function EmptyTab({ tab }: { tab: number }) {
  const config = [
    {
      icon: "play-circle-outline",
      text: "Nothing in progress.\nStart watching from your saved list!",
    },
    {
      icon: "bookmark-outline",
      text: "Your saved list is empty.\nTap + to search and save movies.",
    },
    {
      icon: "check-circle-outline",
      text: "No movies watched yet.\nTrack everything you've seen here.",
    },
  ][tab];

  return (
    <View
      className="flex-1 items-center justify-center px-lg"
      style={{ paddingTop: 60 }}
    >
      <Icon name={config.icon as any} size={52} color="#7f8c8d" />
      <Text
        className="text-muted-foreground text-sm text-center"
        style={{ marginTop: 16, lineHeight: 22 }}
      >
        {config.text}
      </Text>
    </View>
  );
}

export function WatchlistView({ goToDetails, goToSearch }: WatchlistViewProps) {
  const {
    filteredItems,
    continueWatchingItem,
    activeTab,
    setActiveTab,
    counts,
    sortLabel,
    cycleSortOrder,
    updateWatchStatus,
    removeFromWatchlist,
  } = useWatchlist();

  const showHero =
    activeTab === 0 && continueWatchingItem != null;

  const ListHeader = (
    <View>
      {showHero && (
        <ContinueWatchingHero
          item={continueWatchingItem!}
          onResume={() => goToDetails(continueWatchingItem!.id)}
          onMarkWatched={() =>
            updateWatchStatus(continueWatchingItem!.id!, "watched", 100)
          }
        />
      )}
      {filteredItems.length > 0 && <SwipeHint />}
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      {/* NavBar */}
      <NavBar
        title="Watchlist"
        trainlingIcon={[
          { name: "magnify", onPress: goToSearch },
          { name: "sort-variant", onPress: cycleSortOrder },
          { name: "dots-vertical" },
        ]}
      />

      {/* Fixed tabs + sort row */}
      <View className="px-sm pt-xxs pb-1">
        <TabsGroup
          items={[
            { title: `In Progress (${counts.watching})` },
            { title: `Saved (${counts.saved})` },
            { title: `Watched (${counts.watched})` },
          ]}
          selectedIndex={activeTab}
          onPress={setActiveTab}
        />
      </View>
      <View className="flex-row items-center justify-end px-sm pb-1">
        <Text className="text-muted-foreground" style={{ fontSize: 10 }}>
          Sort: {sortLabel}
        </Text>
      </View>

      {/* Scrollable list */}
      <View className="flex-1">
        <List
          data={filteredItems}
          estimatedItemSize={96}
          keyExtractor={(item) => `${item.id}`}
          ListHeaderComponent={() => ListHeader}
          ListEmptyComponent={<EmptyTab tab={activeTab} />}
          renderItem={({ item }) => (
            <WatchlistRowItem
              item={item}
              onPress={() => goToDetails(item.id)}
              onMarkWatched={() =>
                updateWatchStatus(item.id!, "watched", 100)
              }
              onRemove={() => removeFromWatchlist(item.id!)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* FAB */}
      <WatchlistFAB onPress={goToSearch} />
    </View>
  );
}
