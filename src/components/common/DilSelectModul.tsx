//src/components/common/DilSelectModul.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Languages, Globe, ArrowRight, X, Loader2 } from "lucide-react";
import { getDiller } from "@/services/dilService";

type DbLang = { dilId: number; dilAdi: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: { code: string; name: string; flag: string }) => void;
  dimensionName: string;
  existingTranslations?: string[]; // dil adları
}

export default function DilSelectModul({
  isOpen,
  onClose,
  onLanguageSelect,
  dimensionName,
  existingTranslations = [],
}: Props) {
  const [loading, setLoading] = useState(false);
  const [langs, setLangs] = useState<DbLang[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal açıldığında DB'den dilleri yükle
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!isOpen) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getDiller();
        if (!ignore) setLangs(data);
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? "Diller yüklenemedi");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  const existing = useMemo(() => new Set(existingTranslations), [existingTranslations]);

  const selectable = useMemo(
    () => langs.filter((l) => !existing.has(l.dilAdi)),
    [langs, existing]
  );

  const selectedLang = useMemo(
    () => selectable.find((l) => String(l.dilId) === selectedCode),
    [selectable, selectedCode]
  );

  const handleContinue = () => {
    if (!selectedLang) return;
    onLanguageSelect({
      code: String(selectedLang.dilId), // DB kimliği
      name: selectedLang.dilAdi,        // Dil adı
      flag: "🌐",                       // DB'de bayrak yoksa genel simge
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>

      <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-gradient-to-r from-blue-100 to-purple-100">
              <Languages className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Tercüme Dili Seçin</DialogTitle>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{dimensionName}</span> için tercüme dili seçin
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor…
            </div>
          ) : error ? (
            <Card className="border-destructive/40">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-destructive">{error}</p>
                <p className="text-xs text-muted-foreground mt-2">Lütfen tekrar deneyin.</p>
              </CardContent>
            </Card>
          ) : selectable.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Globe className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mb-2 font-medium">Tüm Diller Tercüme Edilmiş</h3>
                <p className="text-sm text-muted-foreground">
                  Bu kayıt için mevcut tüm dillerde tercüme bulunmaktadır.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="mb-2 font-medium">Mevcut Tercümeler</h3>
                <div className="flex flex-wrap gap-2">
                  {existingTranslations.length === 0 ? (
                    <Badge variant="outline" className="opacity-70">
                      Henüz tercüme yok
                    </Badge>
                  ) : (
                    existingTranslations.map((lang) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Tercüme Edilebilir Diller</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {selectable.map((l) => (
                    <Card
                      key={l.dilId}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCode === String(l.dilId)
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedCode(String(l.dilId))}
                      title={l.dilAdi}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🌐</div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{l.dilAdi}</h4>
                            <p className="text-xs text-muted-foreground">ID: {l.dilId}</p>
                          </div>
                          {selectedCode === String(l.dilId) && (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex-shrink-0 flex items-center justify-between border-t bg-muted/30 p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>
              {selectedLang ? `${selectedLang.dilAdi} tercümesi oluşturulacak` : "Tercüme dili seçin"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              İptal
            </Button>
            <Button onClick={handleContinue} disabled={!selectedLang || loading}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Tercümeye Başla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
