// src/components/dimensions/HeaderActions.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft, Edit, Eye, MoreHorizontal, Power, Plus, Save, Trash2, X, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle: string;
  editMode: boolean;
  onBack: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onTranslate: () => void;

  /** Ekstra kontroller */
  saving?: boolean;          // Kaydet sırasında spinner
  saveDisabled?: boolean;    // Kaydet butonunu kilitle
  canDelete?: boolean;       // Sil göster/kapat
  canActivate?: boolean;     // Devreye Al göster/kapat
  canTranslate?: boolean;    // Tercüme Ekle göster/kapat
  canEdit?: boolean;         // Düzenle göster/kapat
  rightExtra?: React.ReactNode; // Sağ tarafa ek slot (örn. durum badge)
  compact?: boolean;         // Mobil/kompakt başlık
  className?: string;
}

export function HeaderActions({
  title, subtitle, editMode,
  onBack, onSave, onCancel, onEdit, onDelete, onActivate, onTranslate,
  saving = false, saveDisabled = false,
  canDelete = true, canActivate = true, canTranslate = true, canEdit = true,
  rightExtra, compact = false, className,
}: Props) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className={cn("flex items-center gap-4", compact && "gap-2")}>
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri
        </Button>
        <div className={cn("min-w-0", compact && "space-y-0")}>
          <h1 className={cn(
            "flex items-center gap-2 font-bold",
            compact ? "text-xl" : "text-3xl"
          )}>
            {editMode ? <Edit className={cn("h-5 w-5", !compact && "h-6 w-6")} /> : <Eye className={cn("h-5 w-5", !compact && "h-6 w-6")} />}
            <span className="truncate">{title}</span>
          </h1>
          {!compact && (
            <p className="text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {rightExtra}

        {editMode ? (
          <>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" /> İptal
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={saveDisabled || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Kaydet
                </>
              )}
            </Button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline">
                <MoreHorizontal className="mr-2 h-4 w-4" /> İşlemler
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" /> Düzenle
                </DropdownMenuItem>
              )}
              {canActivate && (
                <DropdownMenuItem onClick={onActivate}>
                  <Power className="mr-2 h-4 w-4" /> Devreye Al
                </DropdownMenuItem>
              )}
              {canTranslate && (
                <DropdownMenuItem onClick={onTranslate}>
                  <Plus className="mr-2 h-4 w-4" /> Tercüme Ekle
                </DropdownMenuItem>
              )}
              {(canEdit || canActivate || canTranslate) && <DropdownMenuSeparator />}
              {canDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Sil
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
