import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add request ID for tracking
        config.headers['x-request-id'] = crypto.randomUUID();
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error status
          console.error('API Error:', error.response.data);
        } else if (error.request) {
          // Request made but no response
          console.error('API Error: No response from server');
        } else {
          // Error in request setup
          console.error('API Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET request
  async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; meta?: any }> = 
      await this.client.get(url, { params });
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'API request failed');
    }

    return response.data.data;
  }

  // Generic POST request
  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; meta?: any }> = 
      await this.client.post(url, data);
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'API request failed');
    }

    return response.data.data;
  }

  // Generic PUT request
  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; meta?: any }> = 
      await this.client.put(url, data);
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'API request failed');
    }

    return response.data.data;
  }

  // Generic DELETE request
  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; meta?: any }> = 
      await this.client.delete(url);
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'API request failed');
    }

    return response.data.data;
  }
}

export const apiClient = new ApiClient();

// API endpoints
export const api = {
  // Health check
  health: () => apiClient.get('/health'),

  // Market data
  getMarkets: (params?: { vs_currency?: string; per_page?: number; page?: number; order?: string }) =>
    apiClient.get('/api/v1/markets', params),
  getMarketBySymbol: (symbol: string) =>
    apiClient.get(`/api/v1/markets/${symbol}`),

  // Liquidations
  getLiquidations: (params?: { symbol?: string; limit?: number; offset?: number }) =>
    apiClient.get('/api/v1/liquidations', params),
  getLiquidationChart: (symbol: string, timeframe?: string) =>
    apiClient.get(`/api/v1/liquidations/${symbol}/chart`, { timeframe }),

  // Strategies
  getStrategySignals: (params?: { signal_type?: string; limit?: number; coin_symbol?: string }) =>
    apiClient.get('/api/v1/strategies/signals', params),
  getBollingerBands: (symbol: string) =>
    apiClient.get(`/api/v1/strategies/bollinger-bands/${symbol}`),
  getMultiCoinStrategies: () =>
    apiClient.get('/api/v1/strategies/multi-coin'),

  // News
  getNews: (params?: { limit?: number; coin_symbol?: string; source?: string }) =>
    apiClient.get('/api/v1/news', params),

  // Anomalies
  getAnomalies: (params?: { severity?: string; limit?: number }) =>
    apiClient.get('/api/v1/anomalies', params),

  // Admin
  getApiStatus: () =>
    apiClient.get('/api/v1/admin/api-status'),
  updateApiConfig: (apiName: string, config: { apiKey: string; apiSecret?: string }) =>
    apiClient.post('/api/v1/admin/api-config', { apiName, ...config }),
  getSystemLogs: (params?: { level?: string; limit?: number }) =>
    apiClient.get('/api/v1/admin/logs', params),
};

export default api;
