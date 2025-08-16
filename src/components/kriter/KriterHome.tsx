//src/components/kriter/KriterHome.tsx

"use client";

import * as React from "react";
import KriterToolbar from "./KriterToolbar";
import KriterTable, { type KriterRow, type KriterTranslation } from "./KriterTable";
import KriterModelTable, { type KriterModelSummary } from "./KriterModelTable";
import { fetchKriterTree, fetchKriterModels, fetchKriterNavigation } from "@/services/kriterService";
import { mapTreeApiToRow, mapModelApiToRow, type KriterRowUI, type KriterModelUI } from "./normalize";
import { toStatusNumber } from "@/lib/status";
import { usePageTitle } from "@/contexts/PageTitleContext";

// tarih kısayolu
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "");

export default function KriterHome() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "draft" | "passive" | "multiple">("all");
  const [selectedStatuses, setSelectedStatuses] = React.useState<number[]>([]);
  const [languageFilter, setLanguageFilter] = React.useState<string | "all" | "multiple">("all");
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const { setPageTitle } = usePageTitle();

  // Sayfa başlığını ayarla
  React.useEffect(() => {
    setPageTitle('Kriterler');
  }, [setPageTitle]);

  const [rows, setRows] = React.useState<KriterRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [selected, setSelected] = React.useState<KriterRow | null>(null);
  const [selectedTrans, setSelectedTrans] = React.useState<KriterTranslation | null>(null);

  const [models, setModels] = React.useState<KriterModelSummary[]>([]);
  const [modelsLoading, setModelsLoading] = React.useState(false);

  // Seçili satır key'ini hesapla
  const selectedRowKey = React.useMemo(() => {
    if (selectedTrans && selected) {
      return `trans-${selected.id}-${selectedTrans.id}`;
    } else if (selected) {
      return `root-${selected.id}`;
    }
    return undefined;
  }, [selected, selectedTrans]);

  // Liste yükle
  React.useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    fetchKriterTree(ctrl.signal)
      .then((data) => {
        const mapped = data.map(mapTreeApiToRow) as KriterRowUI[];
        const filtered = applyFilters(mapped, { search, statusFilter, selectedStatuses, languageFilter, selectedLanguages });
        const final = filtered.map((r) => ({
          ...r,
          date: fmt(r.date),
          translations: r.translations?.map((t) => ({ ...t, date: fmt(t.date) })),
        })) as unknown as KriterRow[];
        setRows(final);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchKriterTree", e);
        setRows([]);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [search, statusFilter, selectedStatuses, languageFilter, selectedLanguages]);

  // Modeller yükle
  React.useEffect(() => {
    let id: string | number | undefined;
    
    if (selectedTrans) {
      id = selectedTrans.id;
    } else if (selected) {
      id = selected.id;
    }
    
    if (!id) {
      setModels([]);
      return;
    }
    
    const ctrl = new AbortController();
    setModelsLoading(true);

    // Hem model verilerini hem de navigasyon verilerini çek
    Promise.all([
      fetchKriterModels(Number(id), ctrl.signal),
      fetchKriterNavigation(Number(id), ctrl.signal)
    ])
      .then(([modelData, navigationData]) => {
        const mapped = modelData.map(mapModelApiToRow) as KriterModelUI[];
        
        // Navigasyon verilerinden gösterge sayılarını güncelle
        const enrichedModels = mapped.map(model => {
          // Navigasyon verilerinde bu modeli bul
          const navModel = navigationData.find(nav => nav.modelId === model.id);
          if (navModel) {
            // Bu modeldeki boyutları bul
            const navBoyut = navModel.boyutlar.find(boyut => boyut.boyutAdi === model.boyutName);
            if (navBoyut) {
              // Gösterge sayısını güncelle
              model.gostergeSayisi = navBoyut.gostergeSayisi;
            }
          }
          return model;
        });
        
        setModels(enrichedModels as unknown as KriterModelSummary[]);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchKriterModels", e);
        setModels([]);
      })
      .finally(() => setModelsLoading(false));

    return () => ctrl.abort();
  }, [selected, selectedTrans]);

  const actions = {
    onView: (row: KriterRow) => console.log("view", row),
    onEdit: (row: KriterRow) => console.log("edit", row),
    onDelete: (row: KriterRow) => console.log("delete", row),
    onActivate: (row: KriterRow) => console.log("activate", row),
    onTranslate: (row: KriterRow) => console.log("translate", row),
    onTransView: (parent: KriterRow, t: KriterTranslation) => console.log("trans view", parent, t),
    onTransEdit: (parent: KriterRow, t: KriterTranslation) => console.log("trans edit", parent, t),
    onTransActivate: (parent: KriterRow, t: KriterTranslation) => console.log("trans activate", parent, t),
    onTransDelete: (parent: KriterRow, t: KriterTranslation) => console.log("trans delete", parent, t),

    onSelectTranslation: (parent: KriterRow, t: KriterTranslation) => {
      setSelected(parent);
      setSelectedTrans(t);
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Toolbar */}
      <KriterToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onSelectedStatusesChange={setSelectedStatuses}
        languageFilter={languageFilter}
        onLanguageFilterChange={setLanguageFilter}
        selectedLanguages={selectedLanguages}
        onSelectedLanguagesChange={setSelectedLanguages}
        onCreate={() => console.log("create")}
        onRefresh={() => {
          window.location.reload();
        }}
        hints={rows.map(r => r.name).filter(Boolean)}
      />

      {/* Content Area */}
      <div className="p-6 space-y-6">
        {/* Main Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b border-border/50">
            <h3 className="text-lg font-medium">Kriter Listesi</h3>
          </div>
          <div className="p-0">
            <KriterTable
              rows={rows}
              loading={loading}
              onRowSelect={(row) => {
                setSelected(row);
                setSelectedTrans(null);
              }}
              selectedRowKey={selectedRowKey}
              actions={actions}
            />
          </div>
        </div>

        {/* Model Tables */}
        {(selected && modelsLoading) && (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-lg font-medium">
                {(selectedTrans ? selectedTrans.name : selected.name) + " • Modeller"}
              </h3>
            </div>
            <div className="p-0">
              <KriterModelTable rows={[]} loading={true} />
            </div>
          </div>
        )}
        
        {(selected && !modelsLoading && models.length > 0) && (
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-lg font-medium">
                {(selectedTrans ? selectedTrans.name : selected.name) + " • Modeller"}
              </h3>
            </div>
            <div className="p-0">
              <KriterModelTable rows={models} loading={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------- Filtre ----------------- */

function normalizeLang(s: string) {
  return s
    .trim()
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function applyFilters(
  items: KriterRowUI[],
  params: {
    search: string;
    statusFilter: "all" | "active" | "draft" | "passive" | "multiple";
    selectedStatuses: number[];
    languageFilter: string | "all" | "multiple";
    selectedLanguages: string[];
  }
) {
  const { search, statusFilter, selectedStatuses, languageFilter, selectedLanguages } = params;
  const q = search.trim().toLowerCase();

  // Önce language filtrelemesi yap
  const languageFiltered: KriterRowUI[] =
    languageFilter === "all"
      ? items
      : languageFilter === "multiple"
      ? items.flatMap((r): KriterRowUI[] => {
          const wantedLanguages = selectedLanguages.map(lang => normalizeLang(lang));
          
          const rootMatches = wantedLanguages.some(wanted => 
            normalizeLang(r.language) === wanted
          );
          
          if (rootMatches) {
            const filteredTranslations = r.translations?.filter(t => 
              wantedLanguages.some(wanted => normalizeLang(t.language) === wanted)
            ) || [];
            return [{ ...r, translations: filteredTranslations }];
          }
          
          const matchingTranslations = r.translations?.filter(t => 
            wantedLanguages.some(wanted => normalizeLang(t.language) === wanted)
          ) || [];
          
          if (matchingTranslations.length > 0) {
            return matchingTranslations.map(t => ({
              id: t.id,
              name: t.name,
              shortName: t.shortName,
              language: t.language,
              status: t.status,
              date: t.date || "",
              translations: [],
            }));
          }
          
          return [];
        })
      : items.flatMap((r) => {
          const wanted = normalizeLang(String(languageFilter));

          if (normalizeLang(r.language) === wanted) {
            return [{ ...r, translations: [] }];
          }

          const t = r.translations?.find((x) => normalizeLang(x.language) === wanted);
          if (t) {
            return [
              {
                id: t.id,
                name: t.name,
                shortName: t.shortName,
                language: t.language,
                status: t.status,
                date: t.date,
                translations: [],
              },
            ];
          }

          return [];
        });

  // Sonra status filtrelemesi yap - child kayıtları da root kayıt gibi göster
  return languageFiltered.flatMap((r) => {
    const matchesSearch =
      !q || r.name.toLowerCase().includes(q) || r.shortName.toLowerCase().includes(q);

    const results: KriterRowUI[] = [];

    // Status filtrelemesi için statusFilter'ı parse et
    let statusesToCheck: number[] = [];
    if (statusFilter === "all") {
      statusesToCheck = [0, 1, 2]; // Pasif, Aktif, Taslak
    } else if (statusFilter === "multiple") {
      statusesToCheck = selectedStatuses;
    } else if (statusFilter === "active") {
      statusesToCheck = [1];
    } else if (statusFilter === "draft") {
      statusesToCheck = [2];
    } else if (statusFilter === "passive") {
      statusesToCheck = [0];
    }

    // Root kayıt status kontrolü
    const rootStatus = toStatusNumber(r.status);
    const rootMatchesStatus = statusesToCheck.includes(rootStatus);

    // Root kayıt eşleşiyorsa ekle (child'ları ile birlikte)
    if (matchesSearch && rootMatchesStatus) {
      // Root kayıt eşleşiyorsa, child'ları da filtrele
      const filteredChildren = r.translations?.filter(child => {
        const childStatus = toStatusNumber(child.status);
        return statusesToCheck.includes(childStatus);
      }) || [];
      
      results.push({
        ...r,
        translations: filteredChildren
      });
    }

    // Child kayıtları ayrı root kayıt gibi ekle (sadece root eşleşmiyorsa)
    if (matchesSearch && !rootMatchesStatus && r.translations) {
      r.translations.forEach(child => {
        const childStatus = toStatusNumber(child.status);
        if (statusesToCheck.includes(childStatus)) {
          results.push({
            id: child.id,
            name: child.name,
            shortName: child.shortName,
            language: child.language,
            status: child.status,
            date: child.date || "",
            translations: [], // Child'ı root yaptığımız için translations'ı boş bırak
          });
        }
      });
    }

    return results;
  });
}
