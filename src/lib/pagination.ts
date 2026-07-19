export const PAGE_SIZE_OPTIONS = [10, 30, 50] as const;
export const DEFAULT_PAGE_SIZE: (typeof PAGE_SIZE_OPTIONS)[number] = 10;

export type PaginateResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
};

export function parsePageSize(raw?: string): (typeof PAGE_SIZE_OPTIONS)[number] {
  const parsed = Number(raw);

  return PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number])
    ? (parsed as (typeof PAGE_SIZE_OPTIONS)[number])
    : DEFAULT_PAGE_SIZE;
}

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
