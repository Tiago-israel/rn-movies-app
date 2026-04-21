import { useMemo, useState } from "react";
import { useUserStore } from "../store";
import type { WatchStatus } from "../interfaces";

type SortOrder = "date" | "title" | "rating";

const STATUS_MAP: Record<number, WatchStatus> = {
  0: "watching",
  1: "saved",
  2: "watched",
};

export const WATCHLIST_TABS = [
  { title: "In Progress" },
  { title: "Saved" },
  { title: "Watched" },
];

export function useWatchlist() {
  const watchlistItems = useUserStore((state) => state.watchlistItems);
  const updateWatchStatus = useUserStore((state) => state.updateWatchStatus);
  const removeFromWatchlist = useUserStore((state) => state.removeFromWatchlist);
  const addToWatchlist = useUserStore((state) => state.addToWatchlist);

  const [activeTab, setActiveTab] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("date");

  const continueWatchingItem = useMemo(
    () => watchlistItems.find((item) => item.watchStatus === "watching"),
    [watchlistItems]
  );

  const filteredItems = useMemo(() => {
    const status = STATUS_MAP[activeTab];
    let items = watchlistItems.filter((item) => item.watchStatus === status);

    switch (sortOrder) {
      case "title":
        items = [...items].sort((a, b) =>
          (a.title ?? "").localeCompare(b.title ?? "")
        );
        break;
      case "rating":
        items = [...items].sort(
          (a, b) => (b.voteAverage ?? 0) - (a.voteAverage ?? 0)
        );
        break;
      case "date":
      default:
        items = [...items].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
        break;
    }
    return items;
  }, [watchlistItems, activeTab, sortOrder]);

  function cycleSortOrder() {
    setSortOrder((prev) => {
      if (prev === "date") return "title";
      if (prev === "title") return "rating";
      return "date";
    });
  }

  const sortLabel: Record<SortOrder, string> = {
    date: "Newest",
    title: "A–Z",
    rating: "Rating",
  };

  const counts = useMemo(
    () => ({
      watching: watchlistItems.filter((i) => i.watchStatus === "watching").length,
      saved: watchlistItems.filter((i) => i.watchStatus === "saved").length,
      watched: watchlistItems.filter((i) => i.watchStatus === "watched").length,
    }),
    [watchlistItems]
  );

  return {
    watchlistItems,
    filteredItems,
    continueWatchingItem,
    activeTab,
    setActiveTab,
    tabs: WATCHLIST_TABS,
    sortOrder,
    sortLabel: sortLabel[sortOrder],
    cycleSortOrder,
    counts,
    updateWatchStatus,
    removeFromWatchlist,
    addToWatchlist,
  };
}
