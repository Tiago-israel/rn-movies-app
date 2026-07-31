import { useCallback, useMemo, useState } from "react";
import { useUserStore } from "../store";
import type { WatchlistItem } from "../interfaces";

type SortOrder = "date" | "title" | "rating";

export const WATCHLIST_TABS = [{ title: "Saved" }, { title: "Watched" }];

function itemRating(item: WatchlistItem): number {
  if (typeof item.voteAverage === "number" && !Number.isNaN(item.voteAverage)) {
    return item.voteAverage;
  }
  if (item.voteAverageStr) {
    const parsed = Number.parseFloat(item.voteAverageStr);
    if (!Number.isNaN(parsed)) return parsed;
  }
  if (typeof item.userRating === "number") {
    return item.userRating;
  }
  return 0;
}

function itemAddedAt(item: WatchlistItem): string {
  return item.addedAt ?? "";
}

export function useWatchlist() {
  const watchlistItems = useUserStore((state) => state.watchlistItems);
  const updateWatchStatus = useUserStore((state) => state.updateWatchStatus);
  const removeFromWatchlist = useUserStore((state) => state.removeFromWatchlist);
  const addToWatchlist = useUserStore((state) => state.addToWatchlist);

  const [activeTab, setActiveTab] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("date");

  const filteredItems = useMemo(() => {
    const items =
      activeTab === 0
        ? watchlistItems.filter(
            (item) =>
              item.watchStatus === "saved" || item.watchStatus === "watching"
          )
        : watchlistItems.filter((item) => item.watchStatus === "watched");

    switch (sortOrder) {
      case "title":
        return [...items].sort((a, b) =>
          (a.title ?? "").localeCompare(b.title ?? "")
        );
      case "rating":
        return [...items].sort((a, b) => itemRating(b) - itemRating(a));
      case "date":
      default:
        return [...items].sort((a, b) =>
          itemAddedAt(b).localeCompare(itemAddedAt(a))
        );
    }
  }, [watchlistItems, activeTab, sortOrder]);

  const cycleSortOrder = useCallback(() => {
    setSortOrder((prev) => {
      if (prev === "date") return "title";
      if (prev === "title") return "rating";
      return "date";
    });
  }, []);

  const sortLabel: Record<SortOrder, string> = {
    date: "Newest",
    title: "A–Z",
    rating: "Rating",
  };

  const counts = useMemo(
    () => ({
      saved: watchlistItems.filter(
        (i) => i.watchStatus === "saved" || i.watchStatus === "watching"
      ).length,
      watched: watchlistItems.filter((i) => i.watchStatus === "watched").length,
    }),
    [watchlistItems]
  );

  return {
    watchlistItems,
    filteredItems,
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
