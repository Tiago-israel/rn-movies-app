import { useCallback, useMemo, useRef, useState } from "react";
import {
  useWindowDimensions,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Animated as RNAnimated,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/lib/theme-provider";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { List, SkeletonPlaceholder } from "@/components";
import {
  ItemPoster,
  NavBar,
  Modal,
  SearchFilterChips,
  Button,
} from "../components";
import type { ModalRef } from "../components";
import { useViewMore } from "../controllers";
import { GenericItem, ServiceType } from "../interfaces";
import { MovieTheme } from "../theme";

/* ─── constants ─────────────────────────────────────────── */
const NUM_COLUMNS = 3;
const POSTER_HEIGHT = 210;
const GRID_GAP = 10;
const HORIZONTAL_PADDING = 16;
const SKELETON_COUNT = 12;
const POSTER_BORDER_RADIUS = 14;

/* ─── types ─────────────────────────────────────────────── */
export type ViewMoreProps = {
  type: ServiceType;
  title: string;
  goBack: () => void;
  onPressItem: (item: GenericItem) => void;
};

/* ─── animated poster card ──────────────────────────────── */
function PosterCard({
  item,
  width,
  onPress,
  cardBg,
  shadowColor,
}: {
  item: GenericItem;
  width: number;
  onPress: () => void;
  cardBg: string;
  shadowColor: string;
}) {
  const scale = useRef(new RNAnimated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    RNAnimated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    RNAnimated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [scale]);

  return (
    <RNAnimated.View
      style={[
        styles.posterCard,
        {
          width,
          backgroundColor: cardBg,
          shadowColor,
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.posterPressable}
      >
        <ItemPoster
          width={width}
          height={POSTER_HEIGHT}
          posterUrl={item.posterPath}
          borderRadius="none"
          recyclingKey={String(item.id)}
        />
      </Pressable>
    </RNAnimated.View>
  );
}

/* ─── active filter chip ────────────────────────────────── */
function ActiveFilterChip({
  label,
  onRemove,
  accentColor,
  textColor,
}: {
  label: string;
  onRemove: () => void;
  accentColor: string;
  textColor: string;
}) {
  return (
    <View style={[styles.activeChip, { backgroundColor: accentColor + "20" }]}>
      <Text
        style={[styles.activeChipText, { color: textColor }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Pressable onPress={onRemove} hitSlop={6}>
        <Icon name="close-circle" size={16} color={accentColor} />
      </Pressable>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
export function ViewMoreView(props: ViewMoreProps) {
  const { colors } = useTheme<MovieTheme>();
  const filterModalRef = useRef<ModalRef>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listRef = useRef<any>(null);
  const [draftGenreIds, setDraftGenreIds] = useState<number[]>([]);
  const [draftProviderIds, setDraftProviderIds] = useState<number[]>([]);

  /* ── FAB scroll-to-top ───────────────────────────────── */
  const showFabRef = useRef(false);
  const fabOpacity = useRef(new RNAnimated.Value(0)).current;
  const fabScale = useRef(new RNAnimated.Value(0.7)).current;

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.y;
      const shouldShow = offset > 320;
      if (shouldShow === showFabRef.current) return;
      showFabRef.current = shouldShow;
      RNAnimated.parallel([
        RNAnimated.spring(fabOpacity, {
          toValue: shouldShow ? 1 : 0,
          useNativeDriver: true,
          speed: 30,
          bounciness: 0,
        }),
        RNAnimated.spring(fabScale, {
          toValue: shouldShow ? 1 : 0.7,
          useNativeDriver: true,
          speed: 22,
          bounciness: 10,
        }),
      ]).start();
    },
    [fabOpacity, fabScale],
  );

  const {
    items,
    listHeaderResultCount,
    getPaginatedItems,
    isLoading,
    genres,
    providersCatalog,
    appliedGenreIds,
    appliedProviderIds,
    applyFilters,
    providersLoading,
    isListFooterLoading,
  } = useViewMore(props.type);

  const { width } = useWindowDimensions();
  const columnWidth = useMemo(
    () =>
      (width - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
      NUM_COLUMNS,
    [width],
  );

  /* ── filter actions ──────────────────────────────────── */
  const openFilters = useCallback(() => {
    setDraftGenreIds(appliedGenreIds);
    setDraftProviderIds(appliedProviderIds);
    filterModalRef.current?.open();
  }, [appliedGenreIds, appliedProviderIds]);

  const toggleDraftGenre = useCallback((id: number) => {
    setDraftGenreIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const toggleDraftProvider = useCallback((id: number) => {
    setDraftProviderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const onApplyFilters = useCallback(() => {
    applyFilters(draftGenreIds, draftProviderIds);
    filterModalRef.current?.close();
    requestAnimationFrame(() => {
      scrollToTop();
    });
  }, [applyFilters, draftGenreIds, draftProviderIds, scrollToTop]);

  const onClearFilters = useCallback(() => {
    setDraftGenreIds([]);
    setDraftProviderIds([]);
    applyFilters([], []);
    filterModalRef.current?.close();
    requestAnimationFrame(() => {
      scrollToTop();
    });
  }, [applyFilters, scrollToTop]);

  const canClearFilters =
    draftGenreIds.length > 0 || draftProviderIds.length > 0;

  /* ── remove single active filter ─────────────────────── */
  const removeGenreFilter = useCallback(
    (id: number) => {
      const next = appliedGenreIds.filter((x) => x !== id);
      applyFilters(next, appliedProviderIds);
      requestAnimationFrame(() => {
        scrollToTop();
      });
    },
    [appliedGenreIds, appliedProviderIds, applyFilters, scrollToTop],
  );

  const removeProviderFilter = useCallback(
    (id: number) => {
      const next = appliedProviderIds.filter((x) => x !== id);
      applyFilters(appliedGenreIds, next);
      requestAnimationFrame(() => {
        scrollToTop();
      });
    },
    [appliedGenreIds, appliedProviderIds, applyFilters, scrollToTop],
  );

  /* ── active filter labels ────────────────────────────── */
  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    for (const gId of appliedGenreIds) {
      const genre = genres.find((g) => g.id === gId);
      if (genre) {
        chips.push({
          key: `g-${gId}`,
          label: genre.name,
          onRemove: () => removeGenreFilter(gId),
        });
      }
    }
    for (const pId of appliedProviderIds) {
      const provider = providersCatalog.find((p) => p.id === pId);
      if (provider) {
        chips.push({
          key: `p-${pId}`,
          label: provider.name,
          onRemove: () => removeProviderFilter(pId),
        });
      }
    }
    return chips;
  }, [
    appliedGenreIds,
    appliedProviderIds,
    genres,
    providersCatalog,
    removeGenreFilter,
    removeProviderFilter,
  ]);

  const activeFilterCount = appliedGenreIds.length + appliedProviderIds.length;

  /* ── navbar trailing icon ────────────────────────────── */
  const navBarTrailing = useMemo(
    () => [
      {
        name: "tune" as const,
        onPress: openFilters,
        children: (
          <View style={styles.filterIconWrapper}>
            <Icon
              name="tune-variant"
              size={22}
              color={colors["icon-button"]["on-container"]}
            />
            {activeFilterCount > 0 && (
              <View
                style={[
                  styles.filterBadge,
                  { backgroundColor: colors.palette.belizeHole },
                ]}
              >
                <Text style={styles.filterBadgeText}>
                  {activeFilterCount > 99 ? "99+" : activeFilterCount}
                </Text>
              </View>
            )}
          </View>
        ),
      },
      { name: "close" as const, onPress: props.goBack },
    ],
    [openFilters, props.goBack, activeFilterCount, colors],
  );

  /* ── list renderers ──────────────────────────────────── */
  const renderItem = useCallback(
    (info: ListRenderItemInfo<GenericItem>) => (
      <View style={[styles.posterCellWrapper, { marginHorizontal: GRID_GAP / 2 }]}>
        <PosterCard
          item={info.item}
          width={columnWidth}
          onPress={() => props.onPressItem(info.item)}
          cardBg={colors.card}
          shadowColor={colors.foreground}
        />
      </View>
    ),
    [columnWidth, props.onPressItem, colors],
  );

  const keyExtractor = useCallback(
    (item: GenericItem, i: number) => `${i}-${item.id}`,
    [],
  );

  const listHeader = useMemo(() => {
    if (!items || items.length === 0) return null;
    return (
      <View style={styles.listHeaderRow}>
        <Icon
          name="movie-open-outline"
          size={16}
          color={colors.palette.concrete}
        />
        <Text style={[styles.listHeaderText, { color: colors.palette.concrete }]}>
          {listHeaderResultCount} resultados
        </Text>
      </View>
    );
  }, [items, listHeaderResultCount, colors]);

  const listFooter = useMemo(
    () => (
      <View style={styles.listFooter}>
        <ActivityIndicator size="small" color={colors.palette.belizeHole} />
      </View>
    ),
    [colors],
  );

  /* ── skeleton grid ───────────────────────────────────── */
  const skeletonItems = useMemo(
    () => Array.from({ length: SKELETON_COUNT }, (_, i) => i),
    [],
  );

  /* ── filter modal ────────────────────────────────────── */
  const filterModalFooter = (
    <View style={styles.modalFooter}>
      <Button onPress={onApplyFilters}>Aplicar filtro</Button>
      <Button
        variant="secondary"
        disabled={!canClearFilters}
        onPress={onClearFilters}
      >
        Limpar filtro
      </Button>
    </View>
  );

  const filterModalContent = (
    <>
      <SearchFilterChips
        title="Gêneros"
        options={genres.map((g) => ({ id: g.id, label: g.name }))}
        selectedIds={draftGenreIds}
        onToggle={toggleDraftGenre}
      />
      <SearchFilterChips
        title="Streaming"
        options={providersCatalog.map((p) => ({ id: p.id, label: p.name }))}
        selectedIds={draftProviderIds}
        onToggle={toggleDraftProvider}
      />
    </>
  );

  /* ═══ render ═══════════════════════════════════════════ */
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── header ── */}
      <NavBar
        title={props.title}
        onPressLeading={props.goBack}
        trainlingIcon={navBarTrailing}
      />

      {/* ── active filters strip ── */}
      {activeFilters.length > 0 && (
        <View
          style={[
            styles.activeFiltersContainer,
            { borderBottomColor: colors.border },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersScroll}
          >
            {activeFilters.map((f) => (
              <ActiveFilterChip
                key={f.key}
                label={f.label}
                onRemove={f.onRemove}
                accentColor={colors.palette.belizeHole}
                textColor={colors.foreground}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── content ── */}
      {isLoading ? (
        <ScrollView
          contentContainerStyle={[
            styles.skeletonContainer,
            { paddingHorizontal: HORIZONTAL_PADDING },
          ]}
        >
          {skeletonItems.map((i) => (
            <SkeletonPlaceholder
              key={i}
              width={columnWidth}
              height={POSTER_HEIGHT}
              borderRadius={POSTER_BORDER_RADIUS}
              style={{
                marginBottom: GRID_GAP,
                marginHorizontal: GRID_GAP / 2,
              }}
            />
          ))}
        </ScrollView>
      ) : (
        <List
          innerRef={listRef}
          estimatedItemSize={POSTER_HEIGHT + GRID_GAP}
          numColumns={NUM_COLUMNS}
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={getPaginatedItems}
          onEndReachedThreshold={0.5}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={listHeader}
          ListFooterComponent={isListFooterLoading ? listFooter : null}
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PADDING - GRID_GAP / 2,
            paddingTop: 12,
            paddingBottom: 32,
          }}
        />
      )}

      {/* ── filter modal ── */}
      <Modal
        ref={filterModalRef}
        title="Filtrar por"
        footer={filterModalFooter}
      >
        {filterModalContent}
      </Modal>

      {/* ── FAB: scroll to top ── */}
      <RNAnimated.View
        style={[
          styles.fab,
          {
            backgroundColor: colors.palette.belizeHole,
            opacity: fabOpacity,
            transform: [{ scale: fabScale }],
          },
        ]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={scrollToTop}
          style={styles.fabPressable}
          accessibilityLabel="Voltar ao topo"
          accessibilityRole="button"
        >
          <Icon name="arrow-up" size={22} color="#ffffff" />
        </Pressable>
      </RNAnimated.View>
    </View>
  );
}

/* ─── styles ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },

  /* filter icon badge */
  filterIconWrapper: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 2,
    minWidth: 18,
    minHeight: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 12,
  },

  /* active filters strip */
  activeFiltersContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
  },
  activeFiltersScroll: {
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeChipText: {
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 120,
  },

  /* poster grid */
  posterCellWrapper: {
    marginBottom: GRID_GAP,
  },
  posterCard: {
    borderRadius: POSTER_BORDER_RADIUS,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  posterPressable: {
    width: "100%",
  },

  /* list header / footer */
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: GRID_GAP / 2,
    paddingBottom: 12,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  listFooter: {
    paddingVertical: 24,
    alignItems: "center",
  },

  /* skeleton */
  skeletonContainer: {
    paddingTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  /* modal footer */
  modalFooter: {
    gap: 10,
    padding: 8,
  },

  /* FAB */
  fab: {
    position: "absolute",
    bottom: 32,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
  },
});
