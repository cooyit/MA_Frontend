//src/components/model/ModelDetailTable.tsx

"use client";

import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export type ModelDetailSummary = {
  id: number;
  userType: string;
  dimensionCount: number;
  criteriaCount: number;
  indicatorCount: number;
  answerStatus: string;
  status: number;
};

export default function ModelDetailTable({ rows, loading }: { rows: ModelDetailSummary[]; loading?: boolean }) {
  return (
    <DataTable<ModelDetailSummary>
      data={rows}
      loading={loading}
      rowKey={(r, i) => String(r.id ?? i)}
      columns={[
        { key: "userType", title: "Kullanıcı Türü", align: "left" },
        { key: "dimensionCount", title: "Boyut Sayısı", align: "center", width: 140 },
        { key: "criteriaCount", title: "Kriter Sayısı", align: "center", width: 140 },
        { key: "indicatorCount", title: "Gösterge Sayısı", align: "center", width: 140 },
                 { key: "answerStatus", title: "Cevap Eklenme Durumu", align: "center", width: 180, render: (v) => (
           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
             v === "Tamamlandı" 
               ? "bg-black text-white" 
               : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
           }`}>
             {v}
           </span>
         )},
        { key: "status", title: "Durum", align: "center", width: 140, render: (v) => <StatusBadge value={v} /> },
        { key: "actions", title: "İşlemler", align: "center", width: 120, render: () => (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Zap className="h-4 w-4 text-green-600" />
          </Button>
        )},
      ]}
      emptyText="Detay bulunamadı"
      stickyHeader
      scrollY={200}
      striped
    />
  );
}
