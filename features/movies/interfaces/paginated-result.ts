export type PaginatedResult<T> = {
  totalPages: number;
  results: T[];
};
