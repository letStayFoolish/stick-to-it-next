export type PaginateResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
};

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginateResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
  };
}
