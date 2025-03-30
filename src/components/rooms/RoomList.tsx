import { useState, useEffect } from 'react';
import { Room } from '@/types/room';
import { roomService } from '@/services/room.service';
import { RoomTypeService } from '@/services/room-type.service';
import { RoomType } from '@/types/room-type';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RoomDialog } from './RoomDialog';
import RoomCard from './RoomCard';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  });

  // Lấy danh sách loại phòng
  const fetchRoomTypes = async () => {
    try {
      setIsLoadingRoomTypes(true);
      const data = await RoomTypeService.getAll();
      setRoomTypes(data);
    } catch (error) {
      toast.error('Không thể tải danh sách loại phòng');
      console.error('Error fetching room types:', error);
    } finally {
      setIsLoadingRoomTypes(false);
    }
  };

  // Lấy danh sách phòng
  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const response = await roomService.getRooms();
      setRooms(response);
    } catch (error) {
      toast.error('Không thể tải danh sách phòng');
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchRoomTypes(), fetchRooms()]);
  }, [filters]);

  // Xử lý tạo mới phòng
  const handleCreate = async (data: any) => {
    try {
      await roomService.createRoom(data);
      toast.success('Tạo phòng thành công');
      setIsDialogOpen(false);
      fetchRooms();
    } catch (error) {
      toast.error('Không thể tạo phòng');
      console.error('Error creating room:', error);
    }
  };

  // Xử lý cập nhật phòng
  const handleUpdate = async (data: any) => {
    if (!editingRoom) return;
    
    try {
      await roomService.updateRoom(editingRoom.id, data);
      toast.success('Cập nhật phòng thành công');
      setIsDialogOpen(false);
      fetchRooms();
    } catch (error) {
      toast.error('Không thể cập nhật phòng');
      console.error('Error updating room:', error);
    }
  };

  // Xử lý xóa phòng
  const handleDelete = async (id: string) => {
    try {
      await roomService.deleteRoom(id);
      toast.success('Xóa phòng thành công');
      fetchRooms();
    } catch (error) {
      toast.error('Không thể xóa phòng');
      console.error('Error deleting room:', error);
    }
  };

  const isLoading = isLoadingRooms || isLoadingRoomTypes;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý phòng</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm phòng..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-sm"
        />
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả</SelectItem>
            <SelectItem value="vacant">Trống</SelectItem>
            <SelectItem value="occupied">Đã thuê</SelectItem>
            <SelectItem value="maintenance">Đang sửa</SelectItem>
            <SelectItem value="reserved">Đã đặt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              roomTypes={roomTypes}
              onEdit={(room) => {
                setEditingRoom(room);
                setIsDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <RoomDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingRoom ? handleUpdate : handleCreate}
        initialData={editingRoom}
        roomTypes={roomTypes}
      />
    </div>
  );
} 