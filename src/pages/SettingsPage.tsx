import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Building2,
  User,
  Settings2,
  List,
  Shield,
  Database,
  Link,
  FileText
} from 'lucide-react';
import { RoomTypeService } from '@/services/roomTypeService';
import { RoomType } from '@/types/room-type';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [buildingInfo, setBuildingInfo] = useState({
    name: 'ApartEase Building',
    address: '123 Đường ABC, Quận XYZ, TP.HCM',
    phone: '0123456789',
    email: 'contact@apartease.com'
  });

  const [userPreferences, setUserPreferences] = useState({
    language: 'vi',
    notifications: true,
    emailNotifications: true,
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY'
  });

  // State cho quản lý loại phòng
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [newRoomType, setNewRoomType] = useState('');
  const [newRoomTypeDescription, setNewRoomTypeDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hàm lấy danh sách loại phòng
  const fetchRoomTypes = async () => {
    try {
      setIsLoading(true);
      const data = await RoomTypeService.getAll();
      setRoomTypes(data);
    } catch (error) {
      toast.error('Không thể tải danh sách loại phòng');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm thêm loại phòng mới
  const handleAddRoomType = async () => {
    if (!newRoomType.trim()) {
      toast.error('Vui lòng nhập tên loại phòng');
      return;
    }

    try {
      setIsLoading(true);
      await RoomTypeService.create({ 
        name: newRoomType.trim(),
        description: newRoomTypeDescription.trim()
      });
      toast.success('Thêm loại phòng thành công');
      setNewRoomType('');
      setNewRoomTypeDescription('');
      fetchRoomTypes();
    } catch (error) {
      toast.error('Không thể thêm loại phòng');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa loại phòng
  const handleDeleteRoomType = async (id: string) => {
    try {
      setIsLoading(true);
      await RoomTypeService.delete(id);
      toast.success('Xóa loại phòng thành công');
      fetchRoomTypes();
    } catch (error) {
      toast.error('Không thể xóa loại phòng');
    } finally {
      setIsLoading(false);
    }
  };

  // Load danh sách loại phòng khi component mount
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4 bg-transparent h-auto p-0 md:grid-cols-8">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">Thông tin chung</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Tài khoản</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <Settings2 className="h-4 w-4" />
              <span className="hidden md:inline">Hệ thống</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <List className="h-4 w-4" />
              <span className="hidden md:inline">Danh mục</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Bảo mật</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Sao lưu</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <Link className="h-4 w-4" />
              <span className="hidden md:inline">Tích hợp</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-primary/10 flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Nhật ký</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin tòa nhà</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cơ bản về tòa nhà của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building-name">Tên tòa nhà</Label>
                    <Input
                      id="building-name"
                      value={buildingInfo.name}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building-address">Địa chỉ</Label>
                    <Input
                      id="building-address"
                      value={buildingInfo.address}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building-phone">Số điện thoại</Label>
                    <Input
                      id="building-phone"
                      value={buildingInfo.phone}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building-email">Email</Label>
                    <Input
                      id="building-email"
                      type="email"
                      value={buildingInfo.email}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo tòa nhà</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                      Logo
                    </div>
                    <Button variant="outline">Tải lên</Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Lưu thay đổi</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt tài khoản</CardTitle>
                <CardDescription>
                  Quản lý thông tin và tùy chọn tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ngôn ngữ</Label>
                    <Select value={userPreferences.language} onValueChange={(value) => setUserPreferences({ ...userPreferences, language: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Múi giờ</Label>
                    <Select value={userPreferences.timezone} onValueChange={(value) => setUserPreferences({ ...userPreferences, timezone: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</SelectItem>
                        <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Thông báo ứng dụng</Label>
                      <p className="text-sm text-gray-500">Nhận thông báo về các cập nhật quan trọng</p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications}
                      onCheckedChange={(checked) => setUserPreferences({ ...userPreferences, notifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Thông báo qua email</Label>
                      <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                    </div>
                    <Switch
                      checked={userPreferences.emailNotifications}
                      onCheckedChange={(checked) => setUserPreferences({ ...userPreferences, emailNotifications: checked })}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Lưu thay đổi</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình hệ thống</CardTitle>
                <CardDescription>
                  Điều chỉnh các cài đặt cơ bản của hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Đơn vị tiền tệ</Label>
                    <Select value={userPreferences.currency} onValueChange={(value) => setUserPreferences({ ...userPreferences, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Định dạng ngày</Label>
                    <Select value={userPreferences.dateFormat} onValueChange={(value) => setUserPreferences({ ...userPreferences, dateFormat: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mẫu hợp đồng mặc định</Label>
                    <div className="flex items-center gap-4">
                      <Input type="file" />
                      <Button variant="outline">Tải lên</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mẫu hóa đơn mặc định</Label>
                    <div className="flex items-center gap-4">
                      <Input type="file" />
                      <Button variant="outline">Tải lên</Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Lưu thay đổi</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý danh mục</CardTitle>
                <CardDescription>
                  Cấu hình các danh mục sử dụng trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Loại phòng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Input 
                        placeholder="Thêm loại phòng mới" 
                        value={newRoomType}
                        onChange={(e) => setNewRoomType(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddRoomType();
                          }
                        }}
                      />
                      <Input
                        placeholder="Mô tả loại phòng"
                        value={newRoomTypeDescription}
                        onChange={(e) => setNewRoomTypeDescription(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddRoomType();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      className="md:w-auto"
                      onClick={handleAddRoomType}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang xử lý...' : 'Thêm'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {roomTypes.map((roomType) => (
                      <div key={roomType.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{roomType.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteRoomType(roomType.id)}
                          disabled={isLoading}
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Loại thiết bị</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Thêm loại thiết bị mới" />
                    <Button className="md:w-auto">Thêm</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Điều hòa</span>
                      <Button variant="ghost" size="sm">Xóa</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Tủ lạnh</span>
                      <Button variant="ghost" size="sm">Xóa</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Máy giặt</span>
                      <Button variant="ghost" size="sm">Xóa</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt bảo mật</CardTitle>
                <CardDescription>
                  Quản lý các cài đặt bảo mật cho tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Xác thực 2 yếu tố</Label>
                      <p className="text-sm text-gray-500">Bảo vệ tài khoản bằng xác thực 2 yếu tố</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tự động đăng xuất</Label>
                      <p className="text-sm text-gray-500">Tự động đăng xuất sau thời gian không hoạt động</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 phút</SelectItem>
                        <SelectItem value="30">30 phút</SelectItem>
                        <SelectItem value="60">1 giờ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium">Đổi mật khẩu</h3>
                  <div className="space-y-2">
                    <Label>Mật khẩu hiện tại</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mật khẩu mới</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Xác nhận mật khẩu mới</Label>
                    <Input type="password" />
                  </div>
                  <Button>Đổi mật khẩu</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Sao lưu và khôi phục</CardTitle>
                <CardDescription>
                  Quản lý sao lưu và khôi phục dữ liệu hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tự động sao lưu</Label>
                      <p className="text-sm text-gray-500">Tự động sao lưu dữ liệu định kỳ</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tần suất sao lưu</Label>
                      <p className="text-sm text-gray-500">Chọn tần suất sao lưu tự động</p>
                    </div>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Sao lưu thủ công</h3>
                    <Button>Tạo bản sao lưu</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Backup_20240328_001.zip</p>
                        <p className="text-sm text-gray-500">28/03/2024 10:30</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Tải về</Button>
                        <Button variant="outline" size="sm">Khôi phục</Button>
                        <Button variant="ghost" size="sm">Xóa</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle>Tích hợp</CardTitle>
                <CardDescription>
                  Quản lý các tích hợp với dịch vụ bên thứ ba
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Server</Label>
                      <Input placeholder="smtp.gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input placeholder="587" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Mật khẩu</Label>
                      <Input type="password" />
                    </div>
                  </div>
                  <Button>Lưu cấu hình Email</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">SMS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Secret Key</Label>
                      <Input type="password" />
                    </div>
                  </div>
                  <Button>Lưu cấu hình SMS</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Cổng thanh toán</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          VNP
                        </div>
                        <div>
                          <p className="font-medium">VNPay</p>
                          <p className="text-sm text-gray-500">Cổng thanh toán VNPay</p>
                        </div>
                      </div>
                      <Button variant="outline">Cấu hình</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          MM
                        </div>
                        <div>
                          <p className="font-medium">Momo</p>
                          <p className="text-sm text-gray-500">Ví điện tử Momo</p>
                        </div>
                      </div>
                      <Button variant="outline">Cấu hình</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Nhật ký hệ thống</CardTitle>
                <CardDescription>
                  Xem các hoạt động và sự kiện trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="error">Lỗi</SelectItem>
                        <SelectItem value="warning">Cảnh báo</SelectItem>
                        <SelectItem value="info">Thông tin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="date" className="w-40" />
                    <Button variant="outline">Lọc</Button>
                  </div>
                  
                  <div className="border rounded">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                      <div className="grid grid-cols-4 gap-4 w-full">
                        <div>Thời gian</div>
                        <div>Loại</div>
                        <div>Người dùng</div>
                        <div>Hoạt động</div>
                      </div>
                    </div>
                    <div className="divide-y">
                      <div className="flex items-center justify-between p-3">
                        <div className="grid grid-cols-4 gap-4 w-full">
                          <div className="text-sm">28/03/2024 10:30</div>
                          <div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Thông tin
                            </span>
                          </div>
                          <div className="text-sm">admin@apartease.com</div>
                          <div className="text-sm">Đăng nhập thành công</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div className="grid grid-cols-4 gap-4 w-full">
                          <div className="text-sm">28/03/2024 10:25</div>
                          <div>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Cảnh báo
                            </span>
                          </div>
                          <div className="text-sm">system</div>
                          <div className="text-sm">Sao lưu tự động thất bại</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage; 