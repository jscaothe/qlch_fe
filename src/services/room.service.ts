import { env } from "@/config/env";
import { Room, CreateRoomDto, UpdateRoomDto } from "@/types/room";

const API_URL = `${env.API_URL}/api/rooms`;

// Kiểm tra xem một giá trị có phải là object không
const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

// Kiểm tra xem một giá trị có phải là mảng không
const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

// Hàm để đảm bảo dữ liệu phòng có đầy đủ các trường
const normalizeRoomData = (data: unknown): Room => {
  const room = isObject(data) ? data : {};
  
  // Đảm bảo images là một mảng string URLs
  const images = isArray(room.images) 
    ? room.images.map(img => typeof img === 'string' ? img : '')
    : [];

  // Đảm bảo amenities là một mảng của string
  const amenities = isArray(room.amenities) 
    ? room.amenities.filter((item): item is string => typeof item === 'string')
    : [];

  // Xử lý roomType - API trả về string ID
  const roomType = typeof room.roomType === 'string' ? room.roomType : '';

  return {
    id: typeof room.id === 'string' ? room.id : '',
    name: typeof room.name === 'string' ? room.name : '',
    floor: typeof room.floor === 'number' ? room.floor : 1,
    area: typeof room.area === 'number' ? room.area : 0,
    price: typeof room.price === 'number' ? room.price : 0,
    status: ['vacant', 'occupied', 'maintenance', 'reserved'].includes(room.status as string) 
      ? (room.status as 'vacant' | 'occupied' | 'maintenance' | 'reserved') 
      : 'vacant',
    roomType,
    amenities,
    images,
    description: typeof room.description === 'string' ? room.description : '',
    createdAt: typeof room.createdAt === 'string' ? room.createdAt : new Date().toISOString(),
    updatedAt: typeof room.updatedAt === 'string' ? room.updatedAt : new Date().toISOString(),
  };
};

export const roomService = {
  // Lấy danh sách phòng
  getRooms: async (): Promise<Room[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách phòng');
      }
      const responseData = await response.json();
      console.log('Raw data from API:', responseData);

      // Kiểm tra cấu trúc dữ liệu API
      let roomsData: unknown[];
      if (isObject(responseData) && isArray(responseData.data)) {
        // Trường hợp API trả về dạng { data: Room[] }
        roomsData = responseData.data;
      } else if (isArray(responseData)) {
        // Trường hợp API trả về trực tiếp mảng Room[]
        roomsData = responseData;
      } else if (isObject(responseData) && isObject(responseData.items) && isArray(responseData.items)) {
        // Trường hợp API trả về dạng { items: Room[] }
        roomsData = responseData.items;
      } else {
        console.warn('Không thể xác định cấu trúc dữ liệu API:', responseData);
        return [];
      }

      console.log('Truoc Normalized rooms:', roomsData);
      const normalizedRooms = roomsData.map(normalizeRoomData);
      console.log('Normalized rooms:', normalizedRooms);
      return normalizedRooms;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng:', error);
      throw error;
    }
  },

  // Thêm phòng mới
  createRoom: async (roomData: CreateRoomDto): Promise<Room> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        throw new Error('Không thể thêm phòng mới');
      }
      const data = await response.json();
      return normalizeRoomData(data);
    } catch (error) {
      console.error('Lỗi khi thêm phòng:', error);
      throw error;
    }
  },

  // Cập nhật thông tin phòng
  updateRoom: async (id: string, roomData: UpdateRoomDto): Promise<Room> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Xử lý các trường hợp lỗi cụ thể
        if (response.status === 400) {
          throw new Error(Array.isArray(data.message) 
            ? data.message.join(', ') 
            : data.message || 'Dữ liệu không hợp lệ');
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy phòng');
        }
        throw new Error('Không thể cập nhật thông tin phòng');
      }

      return normalizeRoomData(data);
    } catch (error) {
      console.error('Lỗi khi cập nhật phòng:', error);
      throw error;
    }
  },

  // Xóa phòng
  deleteRoom: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Không thể xóa phòng');
      }
    } catch (error) {
      console.error('Lỗi khi xóa phòng:', error);
      throw error;
    }
  },
}; 