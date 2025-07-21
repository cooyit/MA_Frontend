"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EslesmeSearchFilterProps {
  onSearch?: (filters: any) => void
}

export function EslesmeSearchFilter({ onSearch }: EslesmeSearchFilterProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form verilerini topla ve onSearch'e gönder
    onSearch?.({})
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Model</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Model Ara"
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Kriter</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Kriter Ara"
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Boyut</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Boyut Ara"
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Gösterge</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Gösterge Ara"
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Dil</label>
              <Select defaultValue="tr">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Durum</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="passive">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
              Listele
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
