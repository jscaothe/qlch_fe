import { env } from "@/config/env";

const API_URL = `${env.API_URL}/api/settings`;

export interface RoomType {
  id: string;
  name: string;
  description?: string;
}

export const settingsService = {
  // Lấy danh sách loại phòng
  getRoomTypes: async (): Promise<RoomType[]> => {
    try {
      const response = await fetch(`${API_URL}/room-types`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách loại phòng');
      }
      return await response.json();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại phòng:', error);
      throw error;
    }
  },
}; 