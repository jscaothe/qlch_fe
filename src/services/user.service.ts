import axios, { AxiosError } from 'axios';
import { IUser, ICreateUserDto, IUpdateUserDto, IUserQuery, IUserResponse } from '../types/user';
import { env } from '@/config/env';

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

export const UserService = {
  // Lấy danh sách người dùng
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<{ users: IUser[]; total: number; page: number; limit: number; totalPages: number }> => {
    const response = await axios.get(`${env.API_URL}/api/users`, { params });
    return response.data;
  },

  // Lấy chi tiết người dùng theo ID
  getById: async (id: string): Promise<IUser> => {
    const response = await axios.get(`${env.API_URL}/api/users/${id}`);
    return response.data;
  },

  // Tạo mới người dùng
  create: async (data: ICreateUserDto): Promise<IUser> => {
    const response = await axios.post(`${env.API_URL}/api/users`, data);
    return response.data;
  },

  // Cập nhật người dùng
  update: async (id: string, data: IUpdateUserDto): Promise<IUser> => {
    const response = await axios.put(`${env.API_URL}/api/users/${id}`, data);
    return response.data;
  },

  // Xóa người dùng
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${env.API_URL}/api/users/${id}`);
  },

  // Cập nhật trạng thái người dùng
  updateStatus: async (id: string, status: 'active' | 'inactive'): Promise<IUser> => {
    const response = await axios.patch(`${env.API_URL}/api/users/${id}/status`, { status });
    return response.data;
  }
}; 