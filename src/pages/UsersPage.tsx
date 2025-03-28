import React, { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, UserFilters, UserStats as UserStatsType } from "@/types/user";
import UserTable from "@/components/users/UserTable";
import UserForm from "@/components/users/UserForm";
import UserStats from "@/components/users/UserStats";

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-03-20T10:00:00",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    role: "manager",
    status: "active",
    createdAt: "2024-01-02",
    lastLogin: "2024-03-19T15:30:00",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0369852147",
    role: "staff",
    status: "inactive",
    createdAt: "2024-01-03",
  },
];

const mockStats: UserStatsType = {
  total: 3,
  active: 2,
  inactive: 1,
  byRole: {
    admin: 1,
    manager: 1,
    staff: 1,
  },
};

const UsersPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { toast } = useToast();

  const handleAddUser = (data: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    // TODO: Implement API call
    toast({
      title: "Thành công",
      description: "Thêm người dùng mới thành công",
    });
    setIsOpen(false);
  };

  const handleUpdateUser = (data: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    // TODO: Implement API call
    toast({
      title: "Thành công",
      description: "Cập nhật thông tin người dùng thành công",
    });
    setIsOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (user: User) => {
    // TODO: Implement API call
    toast({
      title: "Thành công",
      description: "Xóa người dùng thành công",
    });
  };

  const handleToggleStatus = (user: User) => {
    // TODO: Implement API call
    toast({
      title: "Thành công",
      description: `Đã ${user.status === "active" ? "khóa" : "kích hoạt"} tài khoản người dùng`,
    });
  };

  const handleCancelForm = () => {
    setIsOpen(false);
    setEditingUser(null);
  };

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="page-title mb-4 sm:mb-0">Quản lý người dùng</h1>
          
          <Button
            onClick={() => {
              setEditingUser(null);
              setIsOpen(true);
            }}
            className="gradient-primary"
          >
            <Plus size={16} /> Thêm người dùng
          </Button>
        </div>

        {/* Thống kê */}
        <div className="mb-8">
          <UserStats stats={mockStats} />
        </div>

        {/* Form thêm/sửa người dùng */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              initialData={editingUser || undefined}
              onSubmit={editingUser ? handleUpdateUser : handleAddUser}
              onCancel={handleCancelForm}
            />
          </DialogContent>
        </Dialog>

        {/* Bộ lọc và tìm kiếm */}
        <div className="glass-card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
                <SelectItem value="manager">Quản lý</SelectItem>
                <SelectItem value="staff">Nhân viên</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bảng người dùng */}
        <div className="glass-card">
          <UserTable
            users={paginatedUsers}
            onEdit={(user) => {
              setEditingUser(user);
              setIsOpen(true);
            }}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage; 