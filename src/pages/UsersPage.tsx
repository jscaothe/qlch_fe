import React, { useState, useEffect } from "react";
import { Search, Plus, AlertCircle } from "lucide-react";
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
import { IUser, ICreateUserDto, IUpdateUserDto, IUserQuery, IUserResponse, UserStats as UserStatsType } from "@/types/user";
import UserTable from "@/components/users/UserTable";
import UserForm from "@/components/users/UserForm";
import UserStats from "@/components/users/UserStats";
import { userService } from "@/services/user.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UsersPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<UserStatsType>({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {
      admin: 0,
      manager: 0,
      staff: 0,
    },
  });

  const itemsPerPage = 10;
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setError(null);
      setTableLoading(true);
      
      const query: IUserQuery = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm !== "" && { search: searchTerm }),
        ...(roleFilter !== "all" && { role: roleFilter }),
        ...(statusFilter !== "all" && { status: statusFilter })
      };

      console.log('Fetching users with query:', query);
      
      const response = await userService.getUsers(query);
      console.log('API Response in component:', response);

      if (!response || !response.data) {
        throw new Error('Không có dữ liệu trả về từ API');
      }

      const { users: userData, total: totalUsers } = response.data;
      console.log('Processed user data:', userData);
      
      setUsers(userData);
      setTotal(totalUsers);

      // Cập nhật thống kê
      const newStats: UserStatsType = {
        total: userData.length,
        active: userData.filter((user) => user.status === "active").length,
        inactive: userData.filter((user) => user.status === "inactive").length,
        byRole: {
          admin: userData.filter((user) => user.role === "admin").length,
          manager: userData.filter((user) => user.role === "manager").length,
          staff: userData.filter((user) => user.role === "staff").length,
        },
      };
      console.log('Updated stats:', newStats);
      setStats(newStats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách người dùng';
      console.error('Error in fetchUsers:', error);
      setError(errorMessage);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter]);

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchUsers();
  };

  const handleAddUser = async (data: ICreateUserDto) => {
    try {
      await userService.createUser(data);
      toast({
        title: "Thành công",
        description: "Thêm người dùng mới thành công",
      });
      setIsOpen(false);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi thêm người dùng",
        variant: "destructive",
      });
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async (data: IUpdateUserDto) => {
    if (!editingUser) return;
    try {
      setFormLoading(true);
      await userService.updateUser(editingUser.id, data);
      
      // Fetch users trước khi đóng form
      await fetchUsers();
      
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin người dùng thành công",
      });
      
      // Đóng form sau khi hoàn tất mọi thao tác
      handleCancelForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật người dùng';
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
      setFormLoading(false); // Reset loading state nếu có lỗi
    }
  };

  const handleDeleteUser = async (user: IUser) => {
    try {
      await userService.deleteUser(user.id);
      toast({
        title: "Thành công",
        description: "Xóa người dùng thành công",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa người dùng",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleStatus = async (user: IUser) => {
    try {
      setTableLoading(true);
      const newStatus = user.status === "active" ? "inactive" : "active";
      await userService.updateUserStatus(user.id, newStatus);
      toast({
        title: "Thành công",
        description: `Đã ${newStatus === "active" ? "kích hoạt" : "khóa"} tài khoản người dùng`,
      });
      await fetchUsers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái';
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTableLoading(false);
    }
  };

  const handleCancelForm = () => {
    setFormLoading(false); // Reset loading state trước
    setEditingUser(null); // Reset user data
    setIsOpen(false); // Đóng dialog sau cùng
  };

  const totalPages = Math.ceil(total / itemsPerPage);

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
            disabled={tableLoading}
          >
            <Plus size={16} /> Thêm người dùng
          </Button>
        </div>

        {/* Thống kê */}
        <div className="mb-8">
          <UserStats stats={stats} />
        </div>

        {/* Form thêm/sửa người dùng */}
        <Dialog 
          open={isOpen} 
          onOpenChange={(open) => {
            if (!open) {
              if (!formLoading) { // Chỉ đóng form khi không có thao tác đang xử lý
                handleCancelForm();
              }
            } else {
              setIsOpen(true);
            }
          }}
        >
          <DialogContent 
            className="max-w-3xl"
            onInteractOutside={(e) => {
              // Prevent closing when loading
              if (formLoading) {
                e.preventDefault();
              }
            }}
            onEscapeKeyDown={(e) => {
              // Prevent closing when loading
              if (formLoading) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              key={editingUser ? editingUser.id : 'new'} // Force re-render form when user changes
              initialData={editingUser || undefined}
              onSubmit={editingUser ? handleUpdateUser : handleAddUser}
              onCancel={handleCancelForm}
              loading={formLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Bộ lọc và tìm kiếm */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={tableLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>

            <Select 
              value={roleFilter} 
              onValueChange={(value) => {
                setRoleFilter(value);
              }}
              disabled={tableLoading}
            >
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

            <Select
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
              }}
              disabled={tableLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleSearch}
              disabled={tableLoading}
              className="gradient-primary"
            >
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Hiển thị lỗi */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Bảng người dùng */}
        <div className="rounded-md border bg-white">
          <UserTable
            users={users}
            onEdit={(user) => {
              setEditingUser(user);
              setIsOpen(true);
            }}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
            loading={tableLoading}
          />
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={tableLoading}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage; 