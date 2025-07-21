// EslesmeTreeRow tipi, modelden göstergeye kadar olan hiyerarşik yapıyı temsil eder.
// Her satırın id, ad, ikon, durum ve varsa alt çocukları bulunur.
// Bu tip genellikle EslesmeTreeTable bileşeninde kullanılır.

export interface EslesmeTreeRow {
    id: string
    name: string
    icon: React.ReactNode
    status: 'Aktif' | 'Pasif'
    children?: EslesmeTreeRow[]
  }
  