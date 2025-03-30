import axios from 'axios';
import { RoomType, CreateRoomTypeDto, UpdateRoomTypeDto } from '../types/room-type';
import { env } from '@/config/env';

const API_URL = `${env.API_URL}/api/settings`;

export const RoomTypeService = {
  // Lấy danh sách loại phòng
  getAll: async (): Promise<RoomType[]> => {
    const response = await axios.get(`${API_URL}/room-types`);
    return response.data;
  },

  // Lấy chi tiết loại phòng theo ID
  getById: async (id: string): Promise<RoomType> => {
    const response = await axios.get(`${API_URL}/room-types/${id}`);
    return response.data;
  },

  // Tạo mới loại phòng
  create: async (data: CreateRoomTypeDto): Promise<RoomType> => {
    const response = await axios.post(`${API_URL}/room-types`, data);
    return response.data;
  },

  // Cập nhật loại phòng
  update: async (id: string, data: UpdateRoomTypeDto): Promise<RoomType> => {
    const response = await axios.patch(`${API_URL}/room-types/${id}`, data);
    return response.data;
  },

  // Xóa loại phòng
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/room-types/${id}`);
  }
}; 