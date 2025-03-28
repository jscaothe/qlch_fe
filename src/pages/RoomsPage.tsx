
import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoomCard, { Room } from "@/components/rooms/RoomCard";
import RoomForm from "@/components/rooms/RoomForm";
import { useToast } from "@/hooks/use-toast";

// Dữ liệu mẫu - trong ứng dụng thực tế sẽ được lấy từ API/backend
const mockRooms: Room[] = [
  {
    id: "1",
    name: "Studio A01",
    floor: 1,
    roomNumber: "A01",
    area: 25,
    price: 5000000,
    status: "occupied",
    amenities: ["TV", "Tủ lạnh", "Điều hòa", "Máy giặt"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "2",
    name: "Studio A02",
    floor: 1,
    roomNumber: "A02",
    area: 30,
    price: 6000000,
    status: "vacant",
    amenities: ["TV", "Tủ lạnh", "Điều hòa", "Máy giặt", "Ban công"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    name: "Studio B01",
    floor: 2,
    roomNumber: "B01",
    area: 28,
    price: 5500000,
    status: "maintenance",
    amenities: ["TV", "Tủ lạnh", "Điều hòa"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "4",
    name: "Studio B02",
    floor: 2,
    roomNumber: "B02",
    area: 32,
    price: 6500000,
    status: "vacant",
    amenities: ["TV", "Tủ lạnh", "Điều hòa", "Máy giặt", "Ban công"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "5",
    name: "Studio C01",
    floor: 3,
    roomNumber: "C01",
    area: 35,
    price: 7000000,
    status: "occupied",
    amenities: ["TV", "Tủ lạnh", "Điều hòa", "Máy giặt", "Ban công", "Bồn tắm"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
];

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "vacant" | "occupied" | "maintenance">("all");
  
  const { toast } = useToast();

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddRoom = (newRoomData: Omit<Room, "id">) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      ...newRoomData
    };
    
    setRooms([...rooms, newRoom]);
    setShowForm(false);
    
    toast({
      title: "Thành công!",
      description: `Đã thêm phòng ${newRoom.name}`,
    });
  };

  const handleUpdateRoom = (updatedRoomData: Omit<Room, "id">) => {
    if (!editingRoom) return;
    
    const updatedRooms = rooms.map(room => 
      room.id === editingRoom.id ? { ...room, ...updatedRoomData } : room
    );
    
    setRooms(updatedRooms);
    setEditingRoom(null);
    
    toast({
      title: "Thành công!",
      description: `Đã cập nhật phòng ${updatedRoomData.name}`,
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId));
    
    toast({
      title: "Thành công!",
      description: "Đã xóa phòng",
    });
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="page-title mb-4 sm:mb-0">Quản lý phòng</h1>
          
          <button
            onClick={() => {
              setEditingRoom(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center justify-center"
          >
            <Plus size={18} className="mr-1" /> Thêm phòng mới
          </button>
        </div>

        {/* Form thêm/sửa phòng */}
        {showForm && (
          <div className="mb-8">
            <RoomForm
              initialData={editingRoom || undefined}
              onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
              onCancel={handleCancelForm}
            />
          </div>
        )}

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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="form-input"
              >
                <option value="all">Tất cả</option>
                <option value="vacant">Còn trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danh sách phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
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
