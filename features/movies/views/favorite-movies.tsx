import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { haptics } from "@/lib/haptics";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useFavoriteMovies } from "../controllers";
import { getText } from "../localization";
import {
  NavBar,
  Drawer,
  Text,
  Input,
  Button,
  ItemPoster,
  TabsGroup,
  Modal,
  GroupListItem,
} from "../components";
import type { GroupItemEntry } from "../components/group-list-item";

export type FavoriteMediaType = "movie" | "tv";

export type FavoriteMoviesViewProps = {
  onBack: () => void;
  goToDetails: (id: number, mediaType?: FavoriteMediaType) => void;
};

type FavoriteEntry = {
  rankingKey: string;
  id: number;
  title: string;
  posterPath?: string;
  mediaType: FavoriteMediaType;
  meta: string;
  rating?: string;
};

const TAB_ITEMS = [{ title: "Ungrouped" }, { title: "Groups" }];

export function FavoriteMoviesView(props: FavoriteMoviesViewProps) {
  const insets = useSafeAreaInsets();
  const {
    drawerRef,
    createGroupModalRef,
    assignGroupModalRef,
    favoriteMovies,
    favoriteSeries,
    favoriteRanking,
    favoriteGroups,
    name,
    description,
    activeTab,
    newGroupName,
    assigningItemKey,
    expandedGroupId,
    setDescription,
    setName,
    setFavoriteRanking,
    setActiveTab,
    setNewGroupName,
    removeFavoriteGroup,
    removeItemFromGroup,
    subimtFavoriteItem,
    handleCreateGroup,
    handleOpenAssignModal,
    handleAssignToGroup,
    handleToggleGroup,
  } = useFavoriteMovies();

  // Build all favorite entries
  const allEntries = useMemo<FavoriteEntry[]>(() => {
    const rankingOrder = new Map(
      favoriteRanking.map((key, index) => [key, index] as const)
    );
    return [
      ...favoriteMovies
        .filter((m) => m.id != null)
        .map((m) => ({
          rankingKey: `movie-${m.id}`,
          id: m.id as number,
          title: m.title ?? "Untitled",
          posterPath: m.posterPath,
          mediaType: "movie" as const,
          meta: [m.genre, m.runtime ?? m.releaseDate].filter(Boolean).join(" · "),
          rating: m.voteAverageStr,
        })),
      ...favoriteSeries
        .filter((s) => s.id != null)
        .map((s) => ({
          rankingKey: `tv-${s.id}`,
          id: s.id as number,
          title: s.name ?? "Untitled",
          posterPath: s.posterPath,
          mediaType: "tv" as const,
          meta: [s.genre, s.firstAirDate].filter(Boolean).join(" · "),
          rating: s.voteAverageStr,
        })),
    ].sort((a, b) => {
      const aPos = rankingOrder.get(a.rankingKey);
      const bPos = rankingOrder.get(b.rankingKey);
      if (aPos == null && bPos == null) return 0;
      if (aPos == null) return 1;
      if (bPos == null) return -1;
      return aPos - bPos;
    });
  }, [favoriteMovies, favoriteSeries, favoriteRanking]);

  // Compute grouped item keys set
  const groupedKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const group of favoriteGroups) {
      for (const key of group.itemKeys) {
        keys.add(key);
      }
    }
    return keys;
  }, [favoriteGroups]);

  // Ungrouped entries (not in any group)
  const ungroupedEntries = useMemo(
    () => allEntries.filter((e) => !groupedKeys.has(e.rankingKey)),
    [allEntries, groupedKeys]
  );

  // Map for quick lookup of entries by rankingKey
  const entryMap = useMemo(() => {
    const map = new Map<string, FavoriteEntry>();
    for (const entry of allEntries) {
      map.set(entry.rankingKey, entry);
    }
    return map;
  }, [allEntries]);

  const selectedTabIndex = activeTab === "ungrouped" ? 0 : 1;

  return (
    <View
      className="w-full h-full bg-background"
      testID="favorites-screen"
      collapsable={false}
    >
      <NavBar
        title={getText("favorites_title")}
        onPressLeading={props.onBack}
        trainlingIcon={[
          { name: "plus", onPress: () => drawerRef.current?.open() },
        ]}
      />

      {/* Tab bar */}
      <View style={styles.tabContainer}>
        <TabsGroup
          items={TAB_ITEMS}
          selectedIndex={selectedTabIndex}
          onPress={(index) => setActiveTab(index === 0 ? "ungrouped" : "groups")}
        />
      </View>

      {/* Ungrouped tab */}
      {activeTab === "ungrouped" && (
        <DraggableFlatList
          data={ungroupedEntries}
          keyExtractor={(item) => item.rankingKey}
          onDragEnd={({ data }) => {
            // Preserve ranking of grouped items, update ungrouped order
            const groupedRanking = favoriteRanking.filter((k) =>
              groupedKeys.has(k)
            );
            const ungroupedRanking = data.map((entry) => entry.rankingKey);
            setFavoriteRanking([...ungroupedRanking, ...groupedRanking]);
          }}
          renderItem={({ item, drag, isActive }) => (
            <Pressable
              onPress={() => {
                haptics.light();
                props.goToDetails(item.id, item.mediaType);
              }}
              onLongPress={() => {
                haptics.medium();
                drag();
              }}
              disabled={isActive}
              style={[
                styles.itemRow,
                { opacity: isActive ? 0.95 : 1 },
              ]}
            >
              <View style={styles.dragHandle}>
                <Icon name="drag-vertical" size={18} color="#7f8c8d" />
              </View>
              <ItemPoster
                width={52}
                height={76}
                posterUrl={item.posterPath}
                borderRadius="lg"
              />
              <View className="flex-1" style={styles.itemContent}>
                <Text
                  className="text-foreground font-bold text-sm"
                  numberOfLines={2}
                  style={styles.itemTitle}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-muted-foreground text-xs"
                  numberOfLines={1}
                  style={styles.itemMeta}
                >
                  {item.meta ||
                    (item.mediaType === "movie" ? "Movie" : "TV Series")}
                </Text>
                {item.rating && (
                  <View style={styles.ratingRow}>
                    <Icon name="star-outline" size={11} color="#7f8c8d" />
                    <Text className="text-muted-foreground text-xs">
                      {item.rating}/10
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.itemActions}>
                <Pressable
                  onPress={() => handleOpenAssignModal(item.rankingKey)}
                  hitSlop={8}
                  accessibilityLabel="Add to group"
                  style={styles.addToGroupBtn}
                >
                  <Icon
                    name="folder-plus-outline"
                    size={16}
                    color="#3498db"
                  />
                </Pressable>
                <View style={styles.mediaTypeBadge}>
                  <Icon
                    name={
                      item.mediaType === "movie"
                        ? "movie-outline"
                        : "television-classic"
                    }
                    size={11}
                    color="#7f8c8d"
                  />
                  <Text className="text-muted-foreground text-xs">
                    {item.mediaType === "movie" ? "Movie" : "TV"}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="star-check-outline" size={48} color="#7f8c8d" />
              <Text className="text-muted-foreground text-sm" style={styles.emptyTitle}>
                No ungrouped items
              </Text>
              <Text className="text-muted-foreground text-xs" style={styles.emptySubtitle}>
                All favorites are organized into groups
              </Text>
            </View>
          }
        />
      )}

      {/* Groups tab */}
      {activeTab === "groups" && (
        <FlatList
          data={favoriteGroups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Pressable
              style={styles.createGroupBtn}
              onPress={() => createGroupModalRef.current?.open()}
              accessibilityLabel="Create new group"
            >
              <Icon name="plus-circle-outline" size={20} color="#3498db" />
              <Text className="text-foreground font-semibold text-sm">
                Create Group
              </Text>
            </Pressable>
          }
          renderItem={({ item: group }) => {
            const groupItems: GroupItemEntry[] = group.itemKeys
              .map((key) => entryMap.get(key))
              .filter(Boolean) as GroupItemEntry[];

            return (
              <GroupListItem
                group={group}
                items={groupItems}
                expanded={expandedGroupId === group.id}
                onToggle={() => handleToggleGroup(group.id)}
                onDelete={() => removeFavoriteGroup(group.id)}
                onRemoveItem={(itemKey) =>
                  removeItemFromGroup(group.id, itemKey)
                }
                onPressItem={(id, mediaType) =>
                  props.goToDetails(id, mediaType)
                }
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="folder-multiple-outline" size={48} color="#7f8c8d" />
              <Text className="text-muted-foreground text-sm" style={styles.emptyTitle}>
                No groups yet
              </Text>
              <Text className="text-muted-foreground text-xs" style={styles.emptySubtitle}>
                Create your first group to organize favorites
              </Text>
            </View>
          }
        />
      )}

      {/* Existing add-favorite drawer */}
      <Drawer ref={drawerRef} direction="right">
        <View className="px-sm gap-sm">
          <View className="flex-col gap-xxs">
            <Text color="secondary-foreground">Name*</Text>
            <Input placeholder="name" value={name} onChangeText={setName} />
          </View>
          <View className="flex-col gap-xxs">
            <Text color="secondary-foreground">Description</Text>
            <Input
              multiline
              numberOfLines={10}
              textAlign="left"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <Button
            variant="primary"
            disabled={name === ""}
            onPress={subimtFavoriteItem}
          >
            Save
          </Button>
        </View>
      </Drawer>

      {/* Create Group modal */}
      <Modal ref={createGroupModalRef} title="Create Group">
        <View style={styles.modalContent}>
          <Text className="text-muted-foreground text-xs" style={styles.modalLabel}>
            Group Name
          </Text>
          <Input
            placeholder="Enter group name..."
            value={newGroupName}
            onChangeText={setNewGroupName}
          />
          <Button
            variant="primary"
            disabled={newGroupName.trim() === ""}
            onPress={handleCreateGroup}
          >
            Create Group
          </Button>
        </View>
      </Modal>

      {/* Assign to Group modal */}
      <Modal ref={assignGroupModalRef} title="Add to Group">
        <View style={styles.modalContent}>
          {favoriteGroups.length === 0 ? (
            <View style={styles.noGroupsHint}>
              <Icon name="information-outline" size={20} color="#7f8c8d" />
              <Text className="text-muted-foreground text-xs" style={styles.noGroupsText}>
                No groups available. Switch to the Groups tab and create one first.
              </Text>
            </View>
          ) : (
            favoriteGroups.map((group) => (
              <Pressable
                key={group.id}
                style={styles.assignGroupRow}
                onPress={() => handleAssignToGroup(group.id)}
              >
                <Icon name="folder-outline" size={20} color="#3498db" />
                <Text
                  className="text-foreground text-sm"
                  numberOfLines={1}
                  style={styles.assignGroupName}
                >
                  {group.name}
                </Text>
                <Text className="text-muted-foreground text-xs">
                  {group.itemKeys.length} items
                </Text>
                <Icon name="chevron-right" size={18} color="#7f8c8d" />
              </Pressable>
            ))
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101218",
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dragHandle: {
    marginRight: 10,
  },
  itemContent: {
    marginLeft: 12,
  },
  itemTitle: {
    marginBottom: 2,
  },
  itemMeta: {
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  addToGroupBtn: {
    padding: 4,
  },
  mediaTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#272727",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  createGroupBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    marginTop: 4,
  },
  emptySubtitle: {
    textAlign: "center",
    maxWidth: 240,
  },
  modalContent: {
    gap: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  modalLabel: {
    marginBottom: -8,
  },
  assignGroupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
  },
  assignGroupName: {
    flex: 1,
  },
  noGroupsHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  noGroupsText: {
    flex: 1,
  },
});
