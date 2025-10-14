export type ProviderItem = {
    "logo_path": string,
    "provider_id": number,
    "provider_name": string,
    "display_priority": number
}

export type ProviderResponse = {
    link: string;
    flatrate: ProviderItem[];
    rent: ProviderItem[];
    buy: ProviderItem[];
}