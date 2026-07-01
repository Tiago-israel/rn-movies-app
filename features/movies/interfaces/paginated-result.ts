export type PaginatedResult<T> = {
  totalPages: number;
  totalResults: number;
  results: T[];
};
