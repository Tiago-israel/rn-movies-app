import type { Ref } from "react";
import { FlashList, type FlashListProps } from "@shopify/flash-list";

/**
 * FlashList v2 auto-measures items; `estimatedItemSize` / `estimatedListSize`
 * are kept on this wrapper for call-site documentation and forward-compat,
 * and are not passed to the native recycler.
 */
type ListProps<T> = FlashListProps<T> & {
  innerRef?: Ref<any>;
  estimatedItemSize?: number;
  estimatedListSize?: { width: number; height: number };
};

export function List<T>({
  innerRef,
  estimatedItemSize: _estimatedItemSize,
  estimatedListSize: _estimatedListSize,
  ...rest
}: ListProps<T>) {
  return <FlashList ref={innerRef} {...rest} />;
}
