//src/components/boyut/BoyutHome.tsx

"use client";

import * as React from "react";
import BoyutToolbar from "./BoyutToolbar";
import BoyutTable, { type BoyutRow, type BoyutTranslation } from "./BoyutTable";
import ModelTable, { type ModelSummary } from "./ModelTable";

import { fetchBoyutTree, fetchBoyutModels } from "@/services/boyutService";
import { mapTreeApiToRow, mapModelApiToRow, type BoyutRowUI, type ModelSummaryUI } from "./normalize";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { toStatusNumber } from "@/lib/status";

// tarih kısayolu
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("tr-TR") : "");

export default function BoyutHome() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "draft" | "passive" | "multiple">("all");
  const [languageFilter, setLanguageFilter] = React.useState<string | "all" | "multiple">("all");
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const { setPageTitle } = usePageTitle();

  // Sayfa başlığını ayarla
  React.useEffect(() => {
    setPageTitle('Boyutlar');
  }, [setPageTitle]);

  const [rows, setRows] = React.useState<BoyutRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [selected, setSelected] = React.useState<BoyutRow | null>(null);
  const [selectedTrans, setSelectedTrans] = React.useState<BoyutTranslation | null>(null); // <-- çeviri seçimi

  const [models, setModels] = React.useState<ModelSummary[]>([]);
  const [modelsLoading, setModelsLoading] = React.useState(false);

  // Seçili satır key'ini hesapla
  const selectedRowKey = React.useMemo(() => {
    if (selectedTrans && selected) {
      // Çeviri seçildiyse çevirinin key'ini kullan
      return `trans-${selected.id}-${selectedTrans.id}`;
    } else if (selected) {
      // Kök seçildiyse kökün key'ini kullan
      return `root-${selected.id}`;
    }
    return undefined;
  }, [selected, selectedTrans]);

  // Liste yükle
  React.useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);

    fetchBoyutTree(ctrl.signal)
      .then((data) => {
        const mapped = data.map(mapTreeApiToRow) as BoyutRowUI[];
        const filtered = applyFilters(mapped, { search, statusFilter, languageFilter, selectedLanguages });
        const final = filtered.map((r) => ({
          ...r,
          date: fmt(r.date),
          translations: r.translations?.map((t) => ({ ...t, date: fmt(t.date) })),
        })) as unknown as BoyutRow[];
        setRows(final);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchBoyutTree", e);
        setRows([]);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [search, statusFilter, languageFilter]);

  // Modeller yükle: her kayıt kendi ID'sini kullanır
  React.useEffect(() => {
    // Çeviri seçildiyse çevirinin ID'si, kök seçildiyse kökün ID'si
    let id: string | number | undefined;
    
    if (selectedTrans) {
      // Çeviri seçildiyse çevirinin ID'sini kullan
      id = selectedTrans.id;
    } else if (selected) {
      // Sadece kök seçildiyse kökün ID'sini kullan
      id = selected.id;
    }
    
    if (!id) {
      setModels([]);
      return;
    }
    
    // console.log("Modeller yükleniyor:", {
    //   selectedId: selected?.id,
    //   selectedTransId: selectedTrans?.id,
    //   kullanilanId: id,
    //   selectedName: selected?.name,
    //   selectedTransName: selectedTrans?.name,
    //   selectedRowKey: selectedRowKey,
    //   isTranslation: !!selectedTrans
    // });
    
    const ctrl = new AbortController();
    setModelsLoading(true);

    fetchBoyutModels(Number(id), ctrl.signal)
      .then((data) => {
        const mapped = data.map(mapModelApiToRow) as ModelSummaryUI[];
        setModels(mapped as unknown as ModelSummary[]);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error("fetchBoyutModels", e);
        setModels([]);
      })
      .finally(() => setModelsLoading(false));

    return () => ctrl.abort();
  }, [selected, selectedTrans]);

  const actions = {
    onView: (row: BoyutRow) => console.log("view", row),
    onEdit: (row: BoyutRow) => console.log("edit", row),
    onDelete: (row: BoyutRow) => console.log("delete", row),
    onActivate: (row: BoyutRow) => console.log("activate", row),
    onTranslate: (row: BoyutRow) => console.log("translate", row),
    onTransView: (parent: BoyutRow, t: BoyutTranslation) => console.log("trans view", parent, t),
    onTransEdit: (parent: BoyutRow, t: BoyutTranslation) => console.log("trans edit", parent, t),
    onTransActivate: (parent: BoyutRow, t: BoyutTranslation) => console.log("trans activate", parent, t),
    onTransDelete: (parent: BoyutRow, t: BoyutTranslation) => console.log("trans delete", parent, t),

    // <-- çeviri satırına tıklayınca: hem kökü seç, hem çeviriyi sakla
    onSelectTranslation: (parent: BoyutRow, t: BoyutTranslation) => {
      setSelected(parent);
      setSelectedTrans(t);
    },
  };

    return (
    <div className="min-h-screen bg-background">
      {/* Modern Toolbar */}
      <BoyutToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        languageFilter={languageFilter}
        onLanguageFilterChange={setLanguageFilter}
        selectedLanguages={selectedLanguages}
        onSelectedLanguagesChange={setSelectedLanguages}
        onCreate={() => console.log("create")}
        onRefresh={() => {
          // Sayfayı yenile
          window.location.reload();
        }}
        hints={rows.map(r => r.name).filter(Boolean)}
      />

             {/* Content Area */}
       <div className="p-6 space-y-6">
         {/* Main Table */}
         <div className="bg-card rounded-lg border shadow-sm">
           <div className="p-4 border-b border-border/50">
             <h3 className="text-lg font-medium">Boyut Listesi</h3>
           </div>
           <div className="p-0">
             <BoyutTable
               rows={rows}
               loading={loading}
               onRowSelect={(row) => {
                 setSelected(row);
                 setSelectedTrans(null); // kök tıklandıysa çeviri seçimini sıfırla
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
               <ModelTable rows={[]} loading={true} />
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
               <ModelTable rows={models} loading={false} />
             </div>
           </div>
         )}
       </div>
     </div>
   );
 }

/* ----------------- Filtre ----------------- */
// BoyutHome.tsx

function normalizeLang(s: string) {
    // trim + lowercase + aksanları kaldır (İ/i farkı dahil)
    return s
      .trim()
      .toLocaleLowerCase("tr")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  
  /**
   * Dil filtresi "all" değilse:
   * - Kök dil seçilen dille eşitse: kökü bırak, ÇEVİRİLERİ SİL (gizle)
   * - Kök eşleşmiyorsa ama seçilen dilde tercümesi varsa:
   *   kökün yerine o tercümeyi PROJEKSİYON ile yeni bir satır olarak getir (çeviriler boş).
   * Sonra search ve status filtrelerini bu projeksiyon üzerinde uygula.
   */
     function applyFilters(
     items: BoyutRowUI[],
     params: {
       search: string;
       statusFilter: "all" | "active" | "draft" | "passive" | "multiple";
       languageFilter: string | "all" | "multiple";
       selectedLanguages: string[];
     }
   ) {
     const { search, statusFilter, languageFilter, selectedLanguages } = params;
     const q = search.trim().toLowerCase();
   
     const projected: BoyutRowUI[] =
       languageFilter === "all"
         ? items
         : languageFilter === "multiple"
         ? items.flatMap((r): BoyutRowUI[] => {
             // Çoklu dil seçildiyse sadece seçilen dillerdeki kayıtları göster
             const wantedLanguages = selectedLanguages.map(lang => normalizeLang(lang));
             
             // Kök kayıt seçilen dillerden birindeyse göster
             const rootMatches = wantedLanguages.some(wanted => 
               normalizeLang(r.language) === wanted
             );
             
             if (rootMatches) {
               // Kök kayıt seçilen dillerden birindeyse, sadece o dillerdeki çevirileri göster
               const filteredTranslations = r.translations?.filter(t => 
                 wantedLanguages.some(wanted => normalizeLang(t.language) === wanted)
               ) || [];
               return [{ ...r, translations: filteredTranslations }];
             }
             
             // Kök kayıt seçilen dillerde değilse, seçilen dillerdeki çevirilerini göster
             const matchingTranslations = r.translations?.filter(t => 
               wantedLanguages.some(wanted => normalizeLang(t.language) === wanted)
             ) || [];
             
             if (matchingTranslations.length > 0) {
               return matchingTranslations.map(t => ({
                 id: (t as any).id ?? r.id,
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
  
            // kök bu dildeyse: kökü koru, translations'ı gizle
            if (normalizeLang(r.language) === wanted) {
              return [{ ...r, translations: [] }];
            }
  
            // kökün seçilen dilde tercümesi varsa: kökün yerine o tercümeden yeni satır üret
            const t = r.translations?.find((x) => normalizeLang(x.language) === wanted);
            if (t) {
              return [
                {
                  id: (t as any).id ?? r.id,   // çeviri BoyutId’si varsa onu kullan
                  name: t.name,
                  shortName: t.shortName,
                  language: t.language,
                  status: t.status,
                  date: t.date,
                  translations: [],            // diğer dilleri gizle
                },
              ];
            }
  
            // bu kayıt bu dilde yoksa hiç getirme
            return [];
          });
  
    return projected.filter((r) => {
      const matchesSearch =
        !q || r.name.toLowerCase().includes(q) || r.shortName.toLowerCase().includes(q);
  
      const matchesStatus =
        statusFilter === "all" ||
        toStatusNumber(r.status) === (statusFilter === "active" ? 1 : statusFilter === "draft" ? 2 : 0);
  
      return matchesSearch && matchesStatus;
    });
  }
  