import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SearchField,
  SearchResults,
  SearchIdleContent,
} from "../components";
import { useSearchMovies } from "../controllers";
import type { SearchResultItem } from "../interfaces";

export type SearchViewProps = {
  onSelectResult: (item: SearchResultItem) => void;
};

export function SearchView(props: SearchViewProps) {
  const insets = useSafeAreaInsets();
  const headerPad = insets.top + 8;
  const contentTopPadding = headerPad + 48 + 12;

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

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full h-full bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 w-full">
        <View
          className="w-full z-[999] absolute top-0 left-0 right-0 px-sm pt-sm bg-overlay"
          style={{ paddingTop: headerPad }}
        >
          <SearchField
            placeholder="Movies, TV shows, or people"
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
            contentTopPadding={contentTopPadding}
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
            contentTopPadding={contentTopPadding}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
