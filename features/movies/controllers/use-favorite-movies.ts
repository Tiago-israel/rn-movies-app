import { useCallback, useRef, useState } from "react";
import { useUserStore } from "../store";
import { ModalRef } from "../components";

export type ActiveTab = "ungrouped" | "groups";
export type FavoriteSortOrder = "custom" | "rating";

export function useFavoriteMovies() {
  const createGroupModalRef = useRef<ModalRef>(null);
  const assignGroupModalRef = useRef<ModalRef>(null);

  const favoriteMovies = useUserStore((state) => state.favoriteMovies);
  const favoriteSeries = useUserStore((state) => state.favoriteSeries);
  const favoriteRanking = useUserStore((state) => state.favoriteRanking);
  const favoriteItems = useUserStore((state) => state.favoriteItems);
  const favoriteGroups = useUserStore((state) => state.favoriteGroups);
  const setFavoriteRanking = useUserStore((state) => state.setFavoriteRanking);
  const addFavoriteGroup = useUserStore((state) => state.addFavoriteGroup);
  const removeFavoriteGroup = useUserStore(
    (state) => state.removeFavoriteGroup
  );
  const renameFavoriteGroup = useUserStore(
    (state) => state.renameFavoriteGroup
  );
  const addItemToGroup = useUserStore((state) => state.addItemToGroup);
  const removeItemFromGroup = useUserStore(
    (state) => state.removeItemFromGroup
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("ungrouped");
  const [sortOrder, setSortOrder] = useState<FavoriteSortOrder>("custom");
  const [newGroupName, setNewGroupName] = useState("");
  const [assigningItemKey, setAssigningItemKey] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const cycleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "custom" ? "rating" : "custom"));
  }, []);

  const handleCreateGroup = useCallback(() => {
    if (newGroupName.trim()) {
      addFavoriteGroup(newGroupName.trim());
      setNewGroupName("");
      createGroupModalRef.current?.close();
    }
  }, [newGroupName, addFavoriteGroup]);

  const handleOpenAssignModal = useCallback((itemKey: string) => {
    setAssigningItemKey(itemKey);
    assignGroupModalRef.current?.open();
  }, []);

  const handleAssignToGroup = useCallback(
    (groupId: string) => {
      if (assigningItemKey) {
        addItemToGroup(groupId, assigningItemKey);
        setAssigningItemKey(null);
        assignGroupModalRef.current?.close();
      }
    },
    [assigningItemKey, addItemToGroup]
  );

  const handleToggleGroup = useCallback(
    (groupId: string) => {
      setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
    },
    []
  );

  return {
    createGroupModalRef,
    assignGroupModalRef,
    favoriteMovies,
    favoriteSeries,
    favoriteRanking,
    favoriteItems,
    favoriteGroups,
    activeTab,
    sortOrder,
    newGroupName,
    assigningItemKey,
    expandedGroupId,
    setFavoriteRanking,
    setActiveTab,
    setNewGroupName,
    cycleSortOrder,
    addFavoriteGroup,
    removeFavoriteGroup,
    renameFavoriteGroup,
    addItemToGroup,
    removeItemFromGroup,
    handleCreateGroup,
    handleOpenAssignModal,
    handleAssignToGroup,
    handleToggleGroup,
  };
}
