import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  pageSize?: number;
};

const pageHref = (basePath: string, page: number, pageSize?: number) =>
  pageSize ? `${basePath}?page=${page}&pageSize=${pageSize}` : `${basePath}?page=${page}`;

const navLinkClasses =
  "flex items-center gap-1 min-h-11 px-3 rounded-md text-sm font-medium hover:bg-accent/30 active:bg-accent/50 transition-colors";

const Pagination: React.FC<Props> = ({
  basePath,
  currentPage,
  totalPages,
  pageSize,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-2 w-full mt-4"
    >
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, currentPage - 1, pageSize)}
          className={navLinkClasses}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Previous
        </Link>
      ) : (
        <span />
      )}

      <ul className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            {page === currentPage ? (
              <span
                aria-current="page"
                className="flex items-center justify-center size-9 rounded-md bg-primary text-accent-ink font-semibold text-sm"
              >
                {page}
              </span>
            ) : (
              <Link
                href={pageHref(basePath, page, pageSize)}
                className="flex items-center justify-center size-9 rounded-md text-sm font-medium hover:bg-accent/30 active:bg-accent/50 transition-colors"
              >
                {page}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, currentPage + 1, pageSize)}
          className={cn(navLinkClasses, "flex-row-reverse")}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};

export default Pagination;
