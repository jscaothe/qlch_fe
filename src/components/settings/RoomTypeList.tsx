import { useState, useEffect } from 'react';
import { RoomType } from '@/types/room-type';
import { RoomTypeService } from '@/services/roomTypeService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RoomTypeDialog } from './RoomTypeDialog';
import { toast } from 'sonner';

export function RoomTypeList() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);

  // Lấy danh sách loại phòng
  const fetchRoomTypes = async () => {
    try {
      setIsLoading(true);
      const data = await RoomTypeService.getAll();
      setRoomTypes(data);
    } catch (error) {
      toast.error('Không thể tải danh sách loại phòng');
      console.error('Error fetching room types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // Xử lý tạo mới loại phòng
  const handleCreate = async (data: { name: string; description: string }) => {
    try {
      await RoomTypeService.create(data);
      toast.success('Tạo loại phòng thành công');
      setIsDialogOpen(false);
      fetchRoomTypes();
    } catch (error) {
      toast.error('Không thể tạo loại phòng');
      console.error('Error creating room type:', error);
    }
  };

  // Xử lý cập nhật loại phòng
  const handleUpdate = async (data: { name: string; description: string }) => {
    if (!editingRoomType) return;
    
    try {
      await RoomTypeService.update(editingRoomType.id, data);
      toast.success('Cập nhật loại phòng thành công');
      setIsDialogOpen(false);
      setEditingRoomType(null);
      fetchRoomTypes();
    } catch (error) {
      toast.error('Không thể cập nhật loại phòng');
      console.error('Error updating room type:', error);
    }
  };

  // Xử lý xóa loại phòng
  const handleDelete = async (id: string) => {
    try {
      await RoomTypeService.delete(id);
      toast.success('Xóa loại phòng thành công');
      fetchRoomTypes();
    } catch (error) {
      toast.error('Không thể xóa loại phòng');
      console.error('Error deleting room type:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý loại phòng</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại phòng
        </Button>
      </div>

      {isLoading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roomTypes.map((roomType) => (
            <div
              key={roomType.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold">{roomType.name}</h3>
              <p className="text-gray-600 mt-1">{roomType.description}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingRoomType(roomType);
                    setIsDialogOpen(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(roomType.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <RoomTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingRoomType ? handleUpdate : handleCreate}
        initialData={editingRoomType}
      />
    </div>
  );
} 