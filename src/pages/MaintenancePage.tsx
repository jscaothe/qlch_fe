import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Maintenance, MaintenanceFilter } from '@/types/maintenance';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const MaintenanceManagement = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [filter, setFilter] = useState<MaintenanceFilter>({});
  const [isOpen, setIsOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);

  const handleFilterChange = (key: keyof MaintenanceFilter, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleAddMaintenance = (data: Partial<Maintenance>) => {
    const newMaintenance: Maintenance = {
      ...data,
      id: Math.random().toString(36).substr(2, 9), // Tạm thời dùng random ID
    } as Maintenance;
    setMaintenances(prev => [...prev, newMaintenance]);
  };

  const handleEditMaintenance = (data: Partial<Maintenance>) => {
    if (!editingMaintenance) return;
    
    setMaintenances(prev =>
      prev.map(maintenance =>
        maintenance.id === editingMaintenance.id
          ? { ...maintenance, ...data }
          : maintenance
      )
    );
  };

  const handleDeleteMaintenance = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      setMaintenances(prev => prev.filter(maintenance => maintenance.id !== id));
    }
  };

  const getStatusColor = (status: Maintenance['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const filteredMaintenances = maintenances.filter(maintenance => {
    if (filter.status && maintenance.status !== filter.status) return false;
    if (filter.maintenanceType && maintenance.maintenanceType !== filter.maintenanceType) return false;
    if (filter.startDate && new Date(maintenance.startDate) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(maintenance.startDate) > new Date(filter.endDate)) return false;
    if (filter.equipmentId && !maintenance.equipmentId.includes(filter.equipmentId)) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="page-title mb-4 sm:mb-0">Quản lý bảo trì</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus size={16} />
                Thêm mới bảo trì
              </Button>
            </DialogTrigger>
            <MaintenanceForm
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onSubmit={handleAddMaintenance}
            />
          </Dialog>
        </div>

        {/* Bộ lọc */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Select
            value={filter.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="in_progress">Đang thực hiện</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.maintenanceType}
            onValueChange={(value) => handleFilterChange('maintenanceType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Loại bảo trì" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preventive">Phòng ngừa</SelectItem>
              <SelectItem value="corrective">Sửa chữa</SelectItem>
              <SelectItem value="predictive">Dự đoán</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            placeholder="Từ ngày"
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />

          <Input
            type="date"
            placeholder="Đến ngày"
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã thiết bị</TableHead>
                <TableHead>Tên thiết bị</TableHead>
                <TableHead>Loại bảo trì</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Người phụ trách</TableHead>
                <TableHead>Độ ưu tiên</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenances.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell>{maintenance.equipmentId}</TableCell>
                  <TableCell>{maintenance.equipmentName}</TableCell>
                  <TableCell>
                    {maintenance.maintenanceType === 'preventive' && 'Phòng ngừa'}
                    {maintenance.maintenanceType === 'corrective' && 'Sửa chữa'}
                    {maintenance.maintenanceType === 'predictive' && 'Dự đoán'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(maintenance.status)}`}>
                      {maintenance.status === 'pending' && 'Chờ xử lý'}
                      {maintenance.status === 'in_progress' && 'Đang thực hiện'}
                      {maintenance.status === 'completed' && 'Hoàn thành'}
                      {maintenance.status === 'cancelled' && 'Đã hủy'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(maintenance.startDate), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell>{maintenance.assignedTo}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      maintenance.priority === 'high' ? 'bg-red-100 text-red-800' :
                      maintenance.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {maintenance.priority === 'high' ? 'Cao' :
                       maintenance.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMaintenance(maintenance)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMaintenance(maintenance.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Form thêm/sửa */}
        <Dialog open={!!editingMaintenance} onOpenChange={(open) => !open && setEditingMaintenance(null)}>
          <MaintenanceForm
            isOpen={!!editingMaintenance}
            onClose={() => setEditingMaintenance(null)}
            onSubmit={handleEditMaintenance}
            initialData={editingMaintenance || undefined}
          />
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceManagement; 