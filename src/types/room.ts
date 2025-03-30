import { RoomType } from './room-type';

export interface Room {
  id: string;
  name: string;
  roomType: string;
  roomNumber: string;
  price: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'reserved';
  description: string;
  floor: number;
  area: number;
  amenities: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDto {
  name: string;
  roomType: string;
  roomNumber: string;
  price: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'reserved';
  description: string;
  floor: number;
  area: number;
  amenities: string[];
  images: string[];
}

export interface UpdateRoomDto {
  name?: string;
  roomType?: string;
  roomNumber?: string;
  price?: number;
  status?: 'vacant' | 'occupied' | 'maintenance' | 'reserved';
  description?: string;
  floor?: number;
  area?: number;
  amenities?: string[];
  images?: string[];
} 