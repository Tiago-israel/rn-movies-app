export type PaginatedResultResponse<T> = {
  id: number;
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};
