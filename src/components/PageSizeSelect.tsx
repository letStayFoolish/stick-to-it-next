"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PAGE_SIZE_OPTIONS } from "@/lib/pagination";

type Props = {
  pageSize: number;
};

const PageSizeSelect: React.FC<Props> = ({ pageSize }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Products");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", event.target.value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 text-sm text-secondary-foreground">
      {t("itemsPerPage")}
      <select
        value={pageSize}
        onChange={handleChange}
        className="min-h-11 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
};

export default PageSizeSelect;
