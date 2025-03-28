
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import OccupancyChart from "@/components/dashboard/OccupancyChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RoomCard, { Room } from "@/components/rooms/RoomCard";
import TenantCard, { Tenant } from "@/components/tenants/TenantCard";
import { Home, Users, Wallet, AlertTriangle } from "lucide-react";
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
];

const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    identityCard: "123456789012",
    dateOfBirth: "1990-01-15",
    address: "123 Đường Lê Lợi, Quận 1, TP HCM",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    roomId: "1",
    roomName: "Studio A01",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  }
];

const occupancyData = [
  { name: "Đã thuê", value: 4, color: "#0EA5E9" },
  { name: "Còn trống", value: 2, color: "#22C55E" },
  { name: "Bảo trì", value: 1, color: "#F59E0B" },
];

const revenueData = [
  { month: "T1", revenue: 25000000, expenses: 8000000 },
  { month: "T2", revenue: 27000000, expenses: 7500000 },
  { month: "T3", revenue: 28000000, expenses: 9000000 },
  { month: "T4", revenue: 25000000, expenses: 8500000 },
  { month: "T5", revenue: 30000000, expenses: 10000000 },
  { month: "T6", revenue: 32000000, expenses: 11000000 },
];

const Index = () => {
  const { toast } = useToast();

  const handleRoomEdit = (room: Room) => {
    toast({
      title: "Chỉnh sửa phòng",
      description: `Bạn đã chọn chỉnh sửa phòng ${room.name}`,
    });
  };

  const handleRoomDelete = (roomId: string) => {
    toast({
      title: "Xóa phòng",
      description: "Chức năng này sẽ được triển khai sau",
      variant: "destructive",
    });
  };

  const handleTenantEdit = (tenant: Tenant) => {
    toast({
      title: "Chỉnh sửa thông tin khách thuê",
      description: `Bạn đã chọn chỉnh sửa thông tin của ${tenant.name}`,
    });
  };

  const handleTenantDelete = (tenantId: string) => {
    toast({
      title: "Xóa khách thuê",
      description: "Chức năng này sẽ được triển khai sau",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <h1 className="page-title">Tổng quan</h1>

        {/* Cards thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng số phòng"
            value="7"
            icon={Home}
          />
          <StatsCard
            title="Tỷ lệ lấp đầy"
            value="71%"
            icon={Home}
            change={{ value: "14%", positive: true }}
          />
          <StatsCard
            title="Khách thuê"
            value="5"
            icon={Users}
            change={{ value: "1", positive: true }}
          />
          <StatsCard
            title="Doanh thu tháng này"
            value="32.000.000 ₫"
            icon={Wallet}
            change={{ value: "6.7%", positive: true }}
          />
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <OccupancyChart data={occupancyData} />
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} />
          </div>
        </div>

        {/* Phòng và khách thuê */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Phòng gần đây</h2>
              <a href="/rooms" className="text-primary text-sm font-medium hover:underline">
                Xem tất cả
              </a>
            </div>
            <div className="space-y-4">
              {mockRooms.slice(0, 2).map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEdit={handleRoomEdit}
                  onDelete={handleRoomDelete}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Khách thuê gần đây</h2>
              <a href="/tenants" className="text-primary text-sm font-medium hover:underline">
                Xem tất cả
              </a>
            </div>
            {mockTenants.length > 0 ? (
              <div className="space-y-4">
                {mockTenants.map((tenant) => (
                  <TenantCard
                    key={tenant.id}
                    tenant={tenant}
                    onEdit={handleTenantEdit}
                    onDelete={handleTenantDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <AlertTriangle size={40} className="text-amber-500 mb-3" />
                <h3 className="text-lg font-medium mb-1">Chưa có khách thuê</h3>
                <p className="text-gray-500 mb-4">
                  Bạn chưa có khách thuê nào trong hệ thống
                </p>
                <a href="/tenants/new" className="btn-primary">
                  Thêm khách thuê
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
