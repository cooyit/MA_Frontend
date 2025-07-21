// modeladmin-ui/src/types/Eslesme.ts
// -----------------------------------------------------------------------------
//  Eslesme.ts
//  Katman: Frontend / Types
//  Amaç: Backend'den gelen eşleşme (model, boyut, kriter, gösterge ilişkileri) verilerini 
//         tip güvenliği ile tanımlamak için kullanılan TypeScript tip dosyasıdır.
//  Kullanıldığı Yerler:
//    - API servisleri (`services/api.ts`)
//    - Custom hook'lar (`hooks/useEslesmeler.ts`)
//    - Tablo veya detay gösterimleri (`components/EslesmeTable.tsx` vb.)
// -----------------------------------------------------------------------------

// Detaylı listeleme için kullanılan DTO
export interface EslesmeListDto {
    id: number;
    modelId: number;
    boyutId: number;
    kriterId: number;
    gostergeId?: number | null;
    modelAdi: string;
    boyutAdi: string;
    kriterAdi: string;
    gostergeAdi?: string | null;
  }
  
  // Filtreleme için kullanılan DTO
  export interface EslesmeFilterDto {
    modelId?: number | null;
    boyutId?: number | null;
    kriterId?: number | null;
    gostergeId?: number| null;
    dilAdi?: string | null;
    aktif?: number | null;
    anahtarKelime?: string | null;
  }
  