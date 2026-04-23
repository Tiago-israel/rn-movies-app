import { useMemo, useCallback } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import * as Haptics from "expo-haptics";
import {
  NavBar,
  SearchField,
  SearchResults,
  SearchIdleContent,
} from "../components";
import { useSearchMovies } from "../controllers";
import type { SearchResultItem } from "../interfaces";
import { getText } from "../localization";
import { useUserStore } from "../store";
import {
  watchlistEntryKey,
  watchlistItemFromSearchResult,
  watchlistKeyFromSearchResult,
} from "../helpers/watchlist-storage";

export type SearchViewProps = {
  onBack: () => void;
  onSelectResult: (item: SearchResultItem) => void;
};

/** Spacing under the search field, inside scroll areas (aligns with other tab screens). */
const LIST_INSET_TOP = 8;

export function SearchView(props: SearchViewProps) {

  const {
    searchText,
    setSearchText,
    clearList,
    status,
    committedQuery,
    errorKey,
    retry,
    items,
    displayedItems,
    loadMore,
    loadingMore,
    hasMore,
    mediaFilter,
    setMediaFilter,
    genreOptions,
    selectedGenreIds,
    toggleGenre,
    trendingItems,
    trendingLoading,
    recentQueries,
    removeRecentQuery,
    selectRecentQuery,
    showIdleHome,
    awaitingDebounce,
  } = useSearchMovies();

  const watchlistItems = useUserStore((s) => s.watchlistItems);
  const addToWatchlist = useUserStore((s) => s.addToWatchlist);
  const watchlistKeys = useMemo(
    () => new Set(watchlistItems.map(watchlistEntryKey)),
    [watchlistItems]
  );

  const handleAddToWatchlist = useCallback(
    (item: SearchResultItem) => {
      const row = watchlistItemFromSearchResult(item);
      if (!row) return;
      const key = watchlistEntryKey(row);
      if (watchlistKeys.has(key)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }
      addToWatchlist(row);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [addToWatchlist, watchlistKeys]
  );

  const isInWatchlist = useCallback(
    (item: SearchResultItem) => {
      const key = watchlistKeyFromSearchResult(item);
      if (!key) return false;
      return watchlistKeys.has(key);
    },
    [watchlistKeys]
  );

  return (
    <KeyboardAvoidingView
      testID="search-screen"
      className="flex-1 w-full h-full bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 w-full">
        <NavBar
          title={getText("search_title")}
          onPressLeading={props.onBack}
          trainlingIcon={[]}
        />
        <View className="w-full bg-background px-sm pt-xs pb-xs">
          <SearchField
            placeholder={getText("search_idle_hint")}
            value={searchText}
            onChangeText={setSearchText}
            onClear={clearList}
            autoFocus
          />
        </View>
        {showIdleHome ? (
          <SearchIdleContent
            recentQueries={recentQueries}
            trendingItems={trendingItems}
            trendingLoading={trendingLoading}
            onSelectRecent={selectRecentQuery}
            onRemoveRecent={removeRecentQuery}
            onSelectResult={props.onSelectResult}
            onAddToWatchlist={handleAddToWatchlist}
            isInWatchlist={isInWatchlist}
            watchlistVersion={watchlistItems.length}
            contentTopPadding={LIST_INSET_TOP}
          />
        ) : (
          <SearchResults
            displayedItems={displayedItems}
            rawCount={items.length}
            status={status}
            awaitingDebounce={awaitingDebounce}
            committedQuery={committedQuery}
            errorKey={errorKey}
            onRetry={retry}
            onPress={props.onSelectResult}
            loadMore={loadMore}
            loadingMore={loadingMore}
            hasMore={hasMore}
            mediaFilter={mediaFilter}
            onMediaFilterChange={setMediaFilter}
            genreOptions={genreOptions}
            selectedGenreIds={selectedGenreIds}
            onToggleGenre={toggleGenre}
            onAddToWatchlist={handleAddToWatchlist}
            isInWatchlist={isInWatchlist}
            watchlistVersion={watchlistItems.length}
            contentTopPadding={LIST_INSET_TOP}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
