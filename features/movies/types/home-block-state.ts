export type BlockState = "loading" | "content" | "empty" | "error";

export type HomeBlockModel<T = unknown> = {
  id: string;
  title: string;
  data: T[];
  state: BlockState;
  errorCode?: string;
};

export function deriveBlockState<T>({
  data,
  isLoading,
  hasError,
}: {
  data?: T[] | null;
  isLoading: boolean;
  hasError: boolean;
}): BlockState {
  if (isLoading && !data?.length) return "loading";
  if (hasError) return "error";
  if (!data?.length) return "empty";
  return "content";
}
