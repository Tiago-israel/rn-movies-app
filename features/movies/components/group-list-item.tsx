import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Text } from "./text";
import { ItemPoster } from "./item-poster";
import type { FavoriteGroup } from "../store/user";

export type GroupItemEntry = {
  rankingKey: string;
  id: number;
  title: string;
  posterPath?: string;
  mediaType: "movie" | "tv";
  meta: string;
  rating?: string;
};

type GroupListItemProps = {
  group: FavoriteGroup;
  items: GroupItemEntry[];
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRemoveItem: (itemKey: string) => void;
  onPressItem: (id: number, mediaType: "movie" | "tv") => void;
};

export function GroupListItem({
  group,
  items,
  expanded,
  onToggle,
  onDelete,
  onRemoveItem,
  onPressItem,
}: GroupListItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <View style={styles.container}>
      {/* Group header */}
      <Pressable
        style={styles.header}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${group.name}, ${items.length} items`}
      >
        <View style={styles.headerLeft}>
          <Icon
            name={expanded ? "chevron-down" : "chevron-right"}
            size={20}
            color="#ffffff"
          />
          <Icon name="folder-outline" size={20} color="#3498db" />
          <Text
            className="text-foreground font-semibold text-sm"
            numberOfLines={1}
            style={styles.groupName}
          >
            {group.name}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.countBadge}>
            <Text className="text-muted-foreground text-xs">
              {items.length}
            </Text>
          </View>
          {!confirmDelete ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                setConfirmDelete(true);
              }}
              hitSlop={8}
              accessibilityLabel="Delete group"
            >
              <Icon name="delete-outline" size={18} color="#7f8c8d" />
            </Pressable>
          ) : (
            <View style={styles.confirmRow}>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onDelete();
                  setConfirmDelete(false);
                }}
                style={styles.confirmDeleteBtn}
              >
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  setConfirmDelete(false);
                }}
                hitSlop={8}
              >
                <Icon name="close" size={16} color="#7f8c8d" />
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>

      {/* Expanded items */}
      {expanded && (
        <View style={styles.itemsContainer}>
          {items.length === 0 ? (
            <View style={styles.emptyGroup}>
              <Icon name="folder-open-outline" size={24} color="#7f8c8d" />
              <Text className="text-muted-foreground text-xs" style={styles.emptyText}>
                No items in this group
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <Pressable
                key={item.rankingKey}
                style={styles.itemRow}
                onPress={() => onPressItem(item.id, item.mediaType)}
              >
                <ItemPoster
                  width={40}
                  height={58}
                  posterUrl={item.posterPath}
                  borderRadius="lg"
                />
                <View style={styles.itemInfo}>
                  <Text
                    className="text-foreground font-bold text-xs"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="text-muted-foreground text-xs"
                    numberOfLines={1}
                  >
                    {item.meta ||
                      (item.mediaType === "movie" ? "Movie" : "TV Series")}
                  </Text>
                </View>
                <Pressable
                  onPress={() => onRemoveItem(item.rankingKey)}
                  hitSlop={8}
                  accessibilityLabel={`Remove ${item.title} from group`}
                >
                  <Icon name="close-circle-outline" size={18} color="#7f8c8d" />
                </Pressable>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  groupName: {
    flexShrink: 1,
  },
  countBadge: {
    backgroundColor: "#272727",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmDeleteBtn: {
    backgroundColor: "#e74c3c",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  confirmDeleteText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  itemsContainer: {
    paddingLeft: 48,
    paddingRight: 20,
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  emptyGroup: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 6,
  },
  emptyText: {
    marginTop: 2,
  },
});
