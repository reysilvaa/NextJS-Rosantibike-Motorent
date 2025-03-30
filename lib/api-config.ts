// File ini dibuat untuk backward compatibility dengan beberapa komponen
// yang masih menggunakan path @/lib/api-config

import CONFIG, { getAuthHeader, getApiUrl } from "./api/config";

// Ekspor ulang sebagai API_CONFIG untuk kompatibilitas
const API_CONFIG = CONFIG;

export { 
  getAuthHeader, 
  getApiUrl 
};

// Ekspor default untuk impor dari komponen
export default API_CONFIG; 