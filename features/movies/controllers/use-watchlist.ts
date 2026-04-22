import { useMemo, useState } from "react";
import { useUserStore } from "../store";

type SortOrder = "date" | "title" | "rating";

export const WATCHLIST_TABS = [{ title: "Saved" }, { title: "Watched" }];

export function useWatchlist() {
  const watchlistItems = useUserStore((state) => state.watchlistItems);
  const updateWatchStatus = useUserStore((state) => state.updateWatchStatus);
  const removeFromWatchlist = useUserStore((state) => state.removeFromWatchlist);
  const addToWatchlist = useUserStore((state) => state.addToWatchlist);

  const [activeTab, setActiveTab] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("date");

  const filteredItems = useMemo(() => {
    let items =
      activeTab === 0
        ? watchlistItems.filter(
            (item) =>
              item.watchStatus === "saved" || item.watchStatus === "watching"
          )
        : watchlistItems.filter((item) => item.watchStatus === "watched");

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
