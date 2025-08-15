//src/components/common/AppCard.tsx
import * as React from "react";
import { cn } from "@/lib/utils"; // shadcn utils: classnames helper

type AppCardSize = "sm" | "md" | "lg";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode; // sağ üstte buton/menü alanı
  footer?: React.ReactNode;  // alt kısım
  size?: AppCardSize;
  hoverable?: boolean;
  selectableText?: boolean; // true: text seçilebilir; false: sadece başlık seçilemez gibi kullanım için
}

export const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  (
    {
      title,
      icon,
      actions,
      footer,
      size = "md",
      hoverable = true,
      selectableText = true,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const padding = { sm: "p-4", md: "p-6", lg: "p-8" }[size];

    // A11y: başlıkla ilişkilendirme
    const headingId = React.useId();

    return (
      <div
        ref={ref}
        role="region"
        aria-labelledby={title ? headingId : undefined}
        className={cn(
          // Token tabanlı renkler (shadcn)
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          hoverable && "transition-shadow hover:shadow-md",
          // Focus görünürlüğü
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          // Seçilebilirlik
          selectableText ? "select-text" : "select-none",
          padding,
          className
        )}
        {...rest}
      >
        {(title || icon || actions) && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
              {title && (
                <h3 id={headingId} className="truncate text-lg font-semibold">
                  {title}
                </h3>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}

        <div>{children}</div>

        {footer && <div className="mt-4 border-t pt-4">{footer}</div>}
      </div>
    );
  }
);
AppCard.displayName = "AppCard";
export default AppCard;