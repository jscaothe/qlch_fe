import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoomCard, { Room } from "@/components/rooms/RoomCard";
import RoomForm from "@/components/rooms/RoomForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { roomService } from "@/services/room.service";
import { settingsService } from "@/services/settings.service";
import { RoomType } from "@/types/room-type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "vacant" | "occupied" | "maintenance">("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  
  const { toast } = useToast();

  // Lấy danh sách phòng và loại phòng khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [roomsData, roomTypesData] = await Promise.all([
          roomService.getRooms(),
          settingsService.getRoomTypes()
        ]);
        setRooms(roomsData);
        setRoomTypes(roomTypesData.map(type => ({
          ...type,
          description: type.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })));
      } catch (error) {
        toast({
          title: "Lỗi!",
          description: "Không thể tải dữ liệu",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesType = roomTypeFilter === "all" || room.roomType === roomTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddRoom = async (newRoomData: Omit<Room, "id">) => {
    try {
      const newRoom = await roomService.createRoom(newRoomData);
      setRooms([...rooms, newRoom]);
      setIsOpen(false);
      
      toast({
        title: "Thành công!",
        description: `Đã thêm phòng ${newRoom.name}`,
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Không thể thêm phòng mới",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoom = async (updatedRoomData: Omit<Room, "id">) => {
    if (!editingRoom) return;
    
    try {
      // Chỉ gửi các trường đã thay đổi và loại bỏ các trường không cần thiết
      const changedFields = Object.entries(updatedRoomData).reduce((acc, [key, value]) => {
        if (value !== editingRoom[key as keyof Room] && 
            key !== 'createdAt' && 
            key !== 'updatedAt' &&
            [
              'name',
              'roomType',
              'price',
              'status',
              'description',
              'floor',
              'area',
              'amenities',
              'images'
            ].includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<Omit<Room, "id">>);

      // Kiểm tra nếu không có trường nào thay đổi
      if (Object.keys(changedFields).length === 0) {
        setEditingRoom(null);
        setIsOpen(false);
        return;
      }

      const updatedRoom = await roomService.updateRoom(editingRoom.id, changedFields);
      const updatedRooms = rooms.map(room => 
        room.id === editingRoom.id ? updatedRoom : room
      );
      
      setRooms(updatedRooms);
      setEditingRoom(null);
      setIsOpen(false);
      
      toast({
        title: "Thành công!",
        description: `Đã cập nhật phòng ${updatedRoom.name}`,
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: error instanceof Error ? error.message : "Không thể cập nhật thông tin phòng",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await roomService.deleteRoom(roomId);
      setRooms(rooms.filter(room => room.id !== roomId));
      
      toast({
        title: "Thành công!",
        description: "Đã xóa phòng",
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Không thể xóa phòng",
        variant: "destructive",
      });
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsOpen(true);
  };

  const handleCancelForm = () => {
    setIsOpen(false);
    setEditingRoom(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="admin-container animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="page-title mb-4 sm:mb-0">Quản lý phòng</h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus size={16}  /> Thêm phòng mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingRoom ? "Chỉnh sửa thông tin phòng" : "Thêm phòng mới"}
                </DialogTitle>
              </DialogHeader>
              <RoomForm
                initialData={editingRoom || undefined}
                onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
                onCancel={handleCancelForm}
                roomTypes={roomTypes}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            
            <div className="w-full md:w-40">
              <select
                value={roomTypeFilter}
                onChange={(e) => setRoomTypeFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">Tất cả loại phòng</option>
                {roomTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="form-input"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="vacant">Còn trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danh sách phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
          filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                roomTypes={roomTypes}
                onEdit={handleEditRoom}
                onDelete={handleDeleteRoom}
              />
            ))
          ) : (
            <div className="col-span-full glass-card p-8 text-center">
              <p className="text-gray-500">Không tìm thấy phòng nào phù hợp với bộ lọc</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoomsPage;
