export type WatchProviderListEntry = {
  logo_path: string;
  provider_name: string;
  provider_id: number;
  display_priority?: number;
};

export type WatchProvidersListResponse = {
  results: WatchProviderListEntry[];
};
