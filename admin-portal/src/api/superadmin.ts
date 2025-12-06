import axiosClient from './axiosClient';

export const superadminAPI = {
  // Database endpoints
  getDatabases: () => axiosClient.get('/api/superadmin/databases'),
  getTables: (database: string) => 
    axiosClient.get(`/api/superadmin/databases/${database}/tables`),
  getTableData: (database: string, table: string, limit: number = 10, offset: number = 0) =>
    axiosClient.get(`/api/superadmin/databases/${database}/tables/${table}/data`, {
      params: { limit, offset }
    }),
  getTableStructure: (database: string, table: string) =>
    axiosClient.get(`/api/superadmin/databases/${database}/tables/${table}/structure`),
  
  // Redis endpoints
  getRedisStats: () => axiosClient.get('/api/superadmin/redis/stats'),
  
  // System endpoints
  getSystemInfo: () => axiosClient.get('/api/superadmin/system/info'),
  
  // Database maintenance
  optimizeTable: (database: string, table: string) =>
    axiosClient.post(`/api/superadmin/databases/${database}/tables/${table}/optimize`),
  repairTable: (database: string, table: string) =>
    axiosClient.post(`/api/superadmin/databases/${database}/tables/${table}/repair`),
  
  // Cache operations
  flushCache: () => axiosClient.post('/api/superadmin/cache/flush'),
  clearRedis: () => axiosClient.post('/api/superadmin/redis/flush'),
};

export default superadminAPI;
