import { useState, useEffect } from 'react';
import { Room } from '@/types/room';
import { RoomType } from '@/types/room-type';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: Room | null;
  roomTypes: RoomType[];
}

export function RoomDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  roomTypes,
}: RoomDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    roomType: '',
    price: '',
    status: 'vacant',
    description: '',
    floor: '',
    area: '',
    amenities: [] as string[],
    images: [] as string[],
  });

  // Cập nhật form data khi có initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        roomType: initialData.roomType,
        price: initialData.price.toString(),
        status: initialData.status,
        description: initialData.description,
        floor: initialData.floor.toString(),
        area: initialData.area.toString(),
        amenities: initialData.amenities,
        images: initialData.images,
      });
    } else {
      setFormData({
        name: '',
        roomType: '',
        price: '',
        status: 'vacant',
        description: '',
        floor: '',
        area: '',
        amenities: [],
        images: [],
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      floor: Number(formData.floor),
      area: Number(formData.area),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên phòng</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomType">Loại phòng</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) =>
                  setFormData({ ...formData, roomType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại phòng" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (đ/tháng)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacant">Trống</SelectItem>
                  <SelectItem value="occupied">Đã thuê</SelectItem>
                  <SelectItem value="maintenance">Đang sửa</SelectItem>
                  <SelectItem value="reserved">Đã đặt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Tầng</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Diện tích (m²)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {initialData ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 