import React, { useState } from "react";
import { Plus, Search, UserPlus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TenantCard, { Tenant } from "@/components/tenants/TenantCard";
import TenantForm from "@/components/tenants/TenantForm";
import { Room } from "@/components/rooms/RoomCard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
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
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
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
  },
  {
    id: "2",
    name: "Trần Thị B",
    phone: "0909876543",
    email: "tranthib@example.com",
    identityCard: "123456789013",
    dateOfBirth: "1992-05-20",
    address: "456 Đường Nguyễn Huệ, Quận 1, TP HCM",
    startDate: "2023-02-01",
    endDate: "2023-12-31",
    roomId: "5",
    roomName: "Studio C01",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const TenantsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useToast();

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTenant = (newTenantData: Omit<Tenant, "id">) => {
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      ...newTenantData
    };
    
    setTenants([...tenants, newTenant]);
    setIsOpen(false);
    
    toast({
      title: "Thành công!",
      description: `Đã thêm khách thuê ${newTenant.name}`,
    });

    // Trong thực tế, cần cập nhật trạng thái phòng thành "occupied"
  };

  const handleUpdateTenant = (updatedTenantData: Omit<Tenant, "id">) => {
    if (!editingTenant) return;
    
    const updatedTenants = tenants.map(tenant => 
      tenant.id === editingTenant.id ? { ...tenant, ...updatedTenantData } : tenant
    );
    
    setTenants(updatedTenants);
    setEditingTenant(null);
    
    toast({
      title: "Thành công!",
      description: `Đã cập nhật thông tin của ${updatedTenantData.name}`,
    });
  };

  const handleDeleteTenant = (tenantId: string) => {
    setTenants(tenants.filter(tenant => tenant.id !== tenantId));
    
    toast({
      title: "Thành công!",
      description: "Đã xóa khách thuê",
    });

    // Trong thực tế, cần cập nhật trạng thái phòng thành "vacant"
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsOpen(true);
  };

  const handleCancelForm = () => {
    setIsOpen(false);
    setEditingTenant(null);
  };

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="page-title mb-4 sm:mb-0">Quản lý khách thuê</h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <UserPlus size={16} /> Thêm khách thuê
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTenant ? "Chỉnh sửa thông tin khách thuê" : "Thêm khách thuê mới"}
                </DialogTitle>
              </DialogHeader>
              <TenantForm
                initialData={editingTenant || undefined}
                availableRooms={mockRooms}
                onSubmit={editingTenant ? handleUpdateTenant : handleAddTenant}
                onCancel={handleCancelForm}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tìm kiếm */}
        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
        </div>

        {/* Danh sách khách thuê */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTenants.length > 0 ? (
            filteredTenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                onEdit={handleEditTenant}
                onDelete={handleDeleteTenant}
              />
            ))
          ) : (
            <div className="col-span-full glass-card p-8 text-center">
              <p className="text-gray-500">Không tìm thấy khách thuê nào phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TenantsPage;
