import axios from 'axios';
import { RoomType, CreateRoomTypeDto, UpdateRoomTypeDto } from '../types/room-type';
import { env } from '@/config/env';

export const RoomTypeService = {
  // Lấy danh sách loại phòng
  getAll: async (): Promise<RoomType[]> => {
    const response = await axios.get(`${env.API_URL}/settings/room-types`);
    return response.data;
  },

  // Lấy chi tiết loại phòng theo ID
  getById: async (id: string): Promise<RoomType> => {
    const response = await axios.get(`${env.API_URL}/settings/room-types/${id}`);
    return response.data;
  },

  // Tạo mới loại phòng
  create: async (data: CreateRoomTypeDto): Promise<RoomType> => {
    const response = await axios.post(`${env.API_URL}/settings/room-types`, data);
    return response.data;
  },

  // Cập nhật loại phòng
  update: async (id: string, data: UpdateRoomTypeDto): Promise<RoomType> => {
    const response = await axios.patch(`${env.API_URL}/settings/room-types/${id}`, data);
    return response.data;
  },

  // Xóa loại phòng
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${env.API_URL}/settings/room-types/${id}`);
  }
}; 