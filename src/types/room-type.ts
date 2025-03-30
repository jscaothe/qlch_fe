export interface RoomType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomTypeDto {
  name: string;
  description: string;
}

export interface UpdateRoomTypeDto {
  name?: string;
  description?: string;
} 