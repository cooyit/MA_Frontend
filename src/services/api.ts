// modeladmin-ui/src/services/api.ts
// -----------------------------------------------------------------------------
//  api.ts
//  Katman: React - Service (API erişim katmanı)
//  Amaç:
//   Bu dosya, Axios kütüphanesi kullanılarak backend API ile haberleşmeyi sağlar.
//   Özellikle eşleşme verilerini filtreleyerek getirmek için kullanılan `getEslesmelerFiltered`
//   fonksiyonu burada tanımlanır. Diğer API istekleri de bu dosyada toplanabilir.
//
//  Kullanıldığı yerler:
//   - React bileşenlerinde veya özel hook'larda (örn. useEslesmeler.ts) çağrılarak
//     veriyi çekmek ve frontend tarafında göstermek için.
//
//  Temel Sorumluluklar:
//   - Axios instance oluşturmak (baseURL ve header ayarları ile)
//   - `getEslesmelerFiltered` fonksiyonu ile filtreye göre eşleşme listesi çekmek
// -----------------------------------------------------------------------------



import axios from 'axios'
import { EslesmeFilterDto, EslesmeListDto } from '@/types';


// API istekleri için ortak axios örneği (backend baseURL'i ve header ayarları)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

//  Eşleşmeleri filtreye göre çekmek için API çağrısı
export const getEslesmelerFiltered = async (
  filter: EslesmeFilterDto
): Promise<EslesmeListDto[]> => {
  const response = await api.post<EslesmeListDto[]>('/eslesme/filtered', filter);
  return response.data;
};

export default api
