// src/components/common/MenuList.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type MenuItem = {
  label: string;
  count?: number;
  onClick?: () => void | Promise<void>;
};

type Props = {
  items: MenuItem[];
  className?: string;
};

const MenuList: React.FC<Props> = ({ items, className }) => {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((it) => (
        <li key={it.label}>
          <button
            type="button"
            onClick={it.onClick}
            className={cn(
              "w-full rounded-md border border-border bg-muted/40 px-3 py-2",
              "flex items-center justify-between text-left hover:bg-muted transition-colors"
            )}
          >
            <span className="text-sm font-medium">{it.label}</span>
            {typeof it.count === "number" && (
              <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground border border-border">
                {it.count}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MenuList;
