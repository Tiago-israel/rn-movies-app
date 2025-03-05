import { FlashList, type FlashListProps } from "@shopify/flash-list";

type ListProps<T> = FlashListProps<T> & {
  innerRef?: any;
};

export function List<T>(props: ListProps<T>) {
  return <FlashList ref={props.innerRef} {...props} />;
}
