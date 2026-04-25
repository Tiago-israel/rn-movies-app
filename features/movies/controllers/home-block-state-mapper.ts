import { deriveBlockState, type BlockState, type HomeBlockModel } from "../types/home-block-state";

type SourceBlock<T = unknown> = {
  id: string;
  title: string;
  items?: T[] | null;
  isLoading: boolean;
  hasError: boolean;
  errorCode?: string;
};

export function mapHomeBlockState<T>(source: SourceBlock<T>): HomeBlockModel<T> {
  const state = deriveBlockState({
    data: source.items,
    isLoading: source.isLoading,
    hasError: source.hasError,
  });

  return {
    id: source.id,
    title: source.title,
    data: source.items ?? [],
    state,
    errorCode: state === "error" ? source.errorCode ?? "unknown" : undefined,
  };
}

export function hasRenderableContent(state: BlockState) {
  return state === "content" || state === "empty" || state === "error";
}
