"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EslesmeSearchFilter } from "@/components/eslesme/EslesmeSearchFilter"
import { EslesmeTreeTable } from "@/components/eslesme/EslesmeTreeTable"
import { EslesmeTableToolbar } from "@/components/eslesme/EslesmeTableToolbar"


// Mock data - gerçek uygulamada API'den gelecek
import type { Model } from "@/components/eslesme/EslesmeTreeTable"

const mockData: Model[] = [
  {
    id: "model-1",
    name: "Performans Değerlendirme Modeli",
    durum: "Aktif",
    type: "model", // literal olarak algılanacak
    boyutlar: [
      {
        id: "boyut-1-1",
        name: "Operasyonel Verimlilik",
        durum: "Aktif",
        type: "boyut",
        kriterler: [
          {
            id: "kriter-1-1-1",
            name: "Süreç Optimizasyonu",
            durum: "Aktif",
            type: "kriter",
            gostergeler: [
              { id: "gosterge-1-1-1-1", name: "Döngü Süresi", durum: "Aktif", type: "gosterge" },
              { id: "gosterge-1-1-1-2", name: "Hata Oranı", durum: "Aktif", type: "gosterge" }
            ]
          },
          {
            id: "kriter-1-1-2",
            name: "Kaynak Kullanımı",
            durum: "Aktif",
            type: "kriter",
            gostergeler: [{ id: "gosterge-1-1-2-1", name: "Maliyet Etkinliği", durum: "Aktif", type: "gosterge" }]
          }
        ]
      },
      {
        id: "boyut-1-2",
        name: "Kalite Yönetimi",
        durum: "Aktif",
        type: "boyut",
        kriterler: [
          {
            id: "kriter-1-2-1",
            name: "Müşteri Memnuniyeti",
            durum: "Aktif",
            type: "kriter",
            gostergeler: [
              { id: "gosterge-1-2-1-1", name: "NPS Skoru", durum: "Aktif", type: "gosterge" },
              { id: "gosterge-1-2-1-2", name: "Şikayet Oranı", durum: "Pasif", type: "gosterge" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "model-2",
    name: "Finansal Analiz Modeli",
    durum: "Aktif",
    type: "model",
    boyutlar: [
      {
        id: "boyut-2-1",
        name: "Karlılık Analizi",
        durum: "Aktif",
        type: "boyut",
        kriterler: [
          {
            id: "kriter-2-1-1",
            name: "Gelir Büyümesi",
            durum: "Aktif",
            type: "kriter",
            gostergeler: [
              { id: "gosterge-2-1-1-1", name: "Yıllık Büyüme Oranı", durum: "Aktif", type: "gosterge" },
              { id: "gosterge-2-1-1-2", name: "Çeyreklik Büyüme", durum: "Aktif", type: "gosterge" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "model-3",
    name: "İnsan Kaynakları Modeli",
    durum: "Pasif",
    type: "model",
    boyutlar: [
      {
        id: "boyut-3-1",
        name: "Çalışan Bağlılığı",
        durum: "Pasif",
        type: "boyut",
        kriterler: [
          {
            id: "kriter-3-1-1",
            name: "Motivasyon İndeksi",
            durum: "Pasif",
            type: "kriter",
            gostergeler: [
              { id: "gosterge-3-1-1-1", name: "Engagement Skoru", durum: "Pasif", type: "gosterge" }
            ]
          }
        ]
      }
    ]
  }
]


export default function EslesmePage() {
  const [data] = useState(mockData)

  const handleSearch = (filters: any) => {
    console.log("Arama filtreleri:", filters)
    // Burada API çağrısı yapılacak
  }

  const handleItemClick = (item: any, action: string) => {
    console.log("Item action:", item, action)
    // Burada ilgili sayfaya yönlendirme yapılacak
    switch (action) {
      case "model-detail":
        // router.push(`/dashboard/model/${item.id}`)
        break
      case "boyut-detail":
        // router.push(`/dashboard/boyut/${item.id}`)
        break
      case "kriter-detail":
        // router.push(`/dashboard/kriter/${item.id}`)
        break
      case "gosterge-detail":
        // router.push(`/dashboard/gosterge/${item.id}`)
        break
      case "edit":
        // Düzenleme modalı aç
        break
      case "delete":
        // Silme onayı al
        break
    }
  }

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case "filter":
        console.log("Filtre açıldı")
        break
      case "refresh":
        console.log("Sayfa yenilendi")
        // setData(await fetchData())
        break
   
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">MODEL NAVİGASYONU</CardTitle>
          </CardHeader>
        </Card>

        {/* Search Filter */}
        <EslesmeSearchFilter onSearch={handleSearch} />

        {/* Results Table */}
        <Card className="bg-slate-800 border-slate-700">
          <EslesmeTableToolbar
            onFilter={() => handleToolbarAction("filter")}
            onRefresh={() => handleToolbarAction("refresh")}
        
          />
          <CardContent className="p-0">
            <EslesmeTreeTable data={data} onItemClick={handleItemClick} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
