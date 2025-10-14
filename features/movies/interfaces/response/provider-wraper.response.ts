import { ProviderResponse } from "./provider.response";

export type ProviderWrapperResponse = {
    id: number;
    results: {
        [key: string]: ProviderResponse;
    }
}