import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENT = 10;

type SearchRecentState = {
  recentQueries: string[];
  addRecentQuery: (query: string) => void;
  removeRecentQuery: (query: string) => void;
};

export const useSearchRecentStore = create<SearchRecentState>()(
  persist(
    (set, get) => ({
      recentQueries: [],
      addRecentQuery: (query: string) => {
        const t = query.trim();
        if (!t) return;
        const lower = t.toLowerCase();
        const prev = get().recentQueries.filter((q) => q.toLowerCase() !== lower);
        set({ recentQueries: [t, ...prev].slice(0, MAX_RECENT) });
      },
      removeRecentQuery: (query: string) => {
        set({
          recentQueries: get().recentQueries.filter(
            (q) => q.toLowerCase() !== query.toLowerCase()
          ),
        });
      },
    }),
    {
      name: "movies-search-recent",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
