import { FlashList, type FlashListProps } from "@shopify/flash-list";

export function List<T>(props: FlashListProps<T>) {
  return <FlashList {...props} />;
}
