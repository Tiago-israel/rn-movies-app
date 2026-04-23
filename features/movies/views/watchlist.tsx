import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { List } from "@/components";
import { useWatchlist } from "../controllers";
import { getText } from "../localization";
import type { WatchlistMediaType } from "../interfaces";
import { NavBar, TabsGroup, WatchlistRowItem, WatchlistFAB } from "../components";

export type WatchlistViewProps = {
  onBack: () => void;
  goToDetails: (
    id?: number,
    options?: { mediaType?: WatchlistMediaType }
  ) => void;
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
        {getText("watchlist_swipe_hint")}
      </Text>
      <Icon name="chevron-right" size={12} color="#7f8c8d" />
    </View>
  );
}

type EmptyTabProps = {
  tab: number;
  onSearch: () => void;
};

function EmptyTab({ tab, onSearch }: EmptyTabProps) {
  const keys = ["watchlist_empty_saved", "watchlist_empty_watched"] as const;
  const icons = ["bookmark-outline", "check-circle-outline"] as const;

  return (
    <View
      className="flex-1 items-center justify-center px-lg"
      style={{ paddingTop: 48 }}
    >
      <Icon name={icons[tab] as "bookmark-outline"} size={52} color="#7f8c8d" />
      <Text
        className="text-muted-foreground text-sm text-center"
        style={{ marginTop: 16, lineHeight: 22 }}
      >
        {getText(keys[tab])}
      </Text>
      <Pressable
        testID="watchlist-empty-search-cta"
        onPress={onSearch}
        className="mt-5 rounded-xl bg-foreground px-5 py-3 flex-row items-center"
        style={{ gap: 8 }}
      >
        <Icon name="magnify" size={18} color="#101218" />
        <Text className="text-background font-semibold text-sm">
          {getText("watchlist_empty_cta")}
        </Text>
      </Pressable>
    </View>
  );
}

export function WatchlistView({
  onBack,
  goToDetails,
  goToSearch,
}: WatchlistViewProps) {
  const insets = useSafeAreaInsets();
  const {
    filteredItems,
    activeTab,
    setActiveTab,
    counts,
    sortLabel,
    cycleSortOrder,
    updateWatchStatus,
    removeFromWatchlist,
  } = useWatchlist();

  const itemMedia = (item: { id?: number; mediaType?: WatchlistMediaType }) =>
    ({ mediaType: item.mediaType ?? "movie" } as const);

  const ListHeader = filteredItems.length > 0 ? <SwipeHint /> : null;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingBottom: insets.bottom }}
      testID="watchlist-screen"
      collapsable={false}
    >
      <NavBar
        title={getText("watchlist_title")}
        onPressLeading={onBack}
        trainlingIcon={[
          { name: "magnify", onPress: goToSearch },
          { name: "sort-variant", onPress: cycleSortOrder },
        ]}
      />

      <View className="px-sm pt-xxs pb-1">
        <TabsGroup
          items={[
            {
              title: `${getText("watchlist_tab_saved")} (${counts.saved})`,
              testID: "watchlist-tab-saved",
            },
            {
              title: `${getText("watchlist_tab_watched")} (${counts.watched})`,
              testID: "watchlist-tab-watched",
            },
          ]}
          selectedIndex={activeTab}
          onPress={setActiveTab}
        />
      </View>
      <Pressable
        onPress={cycleSortOrder}
        className="flex-row items-center justify-end px-sm pb-2"
        hitSlop={8}
      >
        <Icon name="sort-variant" size={14} color="#7f8c8d" />
        <Text className="text-muted-foreground ml-1" style={{ fontSize: 11 }}>
          {getText("watchlist_sort_label")}: {sortLabel}
        </Text>
      </Pressable>

      <View className="flex-1">
        <List
          data={filteredItems}
          estimatedItemSize={96}
          keyExtractor={(item) =>
            `${item.mediaType ?? "movie"}-${item.id}`
          }
          ListHeaderComponent={() => ListHeader}
          ListEmptyComponent={
            <EmptyTab tab={activeTab} onSearch={goToSearch} />
          }
          renderItem={({ item }) => (
            <WatchlistRowItem
              item={item}
              onPress={() => goToDetails(item.id, itemMedia(item))}
              onMarkWatched={() =>
                updateWatchStatus(
                  item.id!,
                  "watched",
                  100,
                  item.mediaType ?? "movie"
                )
              }
              onRemove={() =>
                removeFromWatchlist(item.id!, item.mediaType ?? "movie")
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <WatchlistFAB onPress={goToSearch} />
    </View>
  );
}
