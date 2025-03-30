// File ini dibuat untuk backward compatibility dengan beberapa komponen
// yang masih menggunakan path @/lib/api-config

import API_CONFIG, { getAuthHeader, getApiUrl } from "./api/config";

export { 
  API_CONFIG as default, 
  getAuthHeader, 
  getApiUrl 
}; 