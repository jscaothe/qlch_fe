import axios, { AxiosError } from 'axios';
import { IUser, ICreateUserDto, IUpdateUserDto, IUserQuery, IUserResponse } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.error('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    if (error.response) {
      throw new Error(error.response.data.message || 'Lỗi từ server');
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server');
    }
  }
  throw new Error('Có lỗi xảy ra');
};

const retryRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (i < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY * (i + 1));
      }
    }
  }
  
  throw lastError;
};

interface ApiResponse {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
}

export const userService = {
  // Lấy danh sách users
  async getUsers(query: IUserQuery): Promise<IUserResponse> {
    try {
      console.log('API Request:', {
        url: `${API_URL}/api/users`,
        method: 'GET',
        params: query
      });

      const params: Record<string, any> = {
        page: query.page,
        limit: query.limit
      };

      if (query.search && query.search.trim()) {
        params.search = query.search.trim();
      }
      if (query.role) {
        params.role = query.role;
      }
      if (query.status) {
        params.status = query.status;
      }

      const response = await axios.get<ApiResponse>(`${API_URL}/api/users`, { 
        params
      });

      console.log('API Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      // Kiểm tra format của response
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response format from API');
      }

      // Chuyển đổi response về đúng format
      const formattedResponse: IUserResponse = {
        data: {
          users: response.data.users || [],
          total: response.data.total || 0,
          page: response.data.page || query.page,
          limit: response.data.limit || query.limit
        }
      };

      return formattedResponse;
    } catch (error) {
      console.error('API Error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Lấy thông tin chi tiết user
  async getUserById(id: string): Promise<IUser> {
    try {
      return await retryRequest(async () => {
        const response = await axios.get(`${API_URL}/api/users/${id}`, {
          timeout: 5000
        });
        return response.data;
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Tạo user mới
  async createUser(data: ICreateUserDto): Promise<IUser> {
    try {
      return await retryRequest(async () => {
        const response = await axios.post(`${API_URL}/api/users`, data, {
          timeout: 5000
        });
        return response.data;
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Cập nhật thông tin user
  async updateUser(id: string, data: IUpdateUserDto): Promise<IUser> {
    try {
      return await retryRequest(async () => {
        const response = await axios.put(`${API_URL}/api/users/${id}`, data, {
          timeout: 5000
        });
        return response.data;
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Xóa user
  async deleteUser(id: string): Promise<void> {
    try {
      await retryRequest(async () => {
        await axios.delete(`${API_URL}/api/users/${id}`, {
          timeout: 5000
        });
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Cập nhật trạng thái user
  async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<IUser> {
    try {
      return await retryRequest(async () => {
        const response = await axios.patch(`${API_URL}/api/users/${id}/status`, 
          { status },
          { timeout: 5000 }
        );
        return response.data;
      });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}; 