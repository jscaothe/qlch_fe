
import React, { useState, useEffect } from "react";
import { Room } from "@/components/rooms/RoomCard";
import { Tenant } from "@/components/tenants/TenantCard";

type TenantFormProps = {
  initialData?: Tenant;
  availableRooms: Room[];
  onSubmit: (data: Omit<Tenant, "id">) => void;
  onCancel: () => void;
};

const TenantForm = ({ 
  initialData, 
  availableRooms, 
  onSubmit, 
  onCancel 
}: TenantFormProps) => {
  const [formData, setFormData] = useState<Omit<Tenant, "id">>({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    identityCard: initialData?.identityCard || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    address: initialData?.address || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    roomId: initialData?.roomId || "",
    roomName: initialData?.roomName || "",
    avatar: initialData?.avatar || "",
  });

  // Cập nhật tên phòng khi roomId thay đổi
  useEffect(() => {
    if (formData.roomId) {
      const selectedRoom = availableRooms.find(r => r.id === formData.roomId);
      if (selectedRoom) {
        setFormData(prev => ({
          ...prev,
          roomName: selectedRoom.name
        }));
      }
    }
  }, [formData.roomId, availableRooms]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Lọc ra các phòng có thể được thuê (trống hoặc đã được thuê bởi khách này)
  const rentableRooms = availableRooms.filter(
    room => room.status === "vacant" || (initialData && room.id === initialData.roomId)
  );

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Chỉnh sửa thông tin khách thuê" : "Thêm khách thuê mới"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Họ và tên
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="identityCard" className="form-label">
            CMND/CCCD
          </label>
          <input
            type="text"
            id="identityCard"
            name="identityCard"
            value={formData.identityCard}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth" className="form-label">
            Ngày sinh
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatar" className="form-label">
            URL ảnh đại diện
          </label>
          <input
            type="text"
            id="avatar"
            name="avatar"
            value={formData.avatar || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="form-group md:col-span-2">
          <label htmlFor="address" className="form-label">
            Địa chỉ thường trú
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input min-h-[80px]"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate" className="form-label">
            Ngày bắt đầu thuê
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="form-label">
            Ngày kết thúc thuê
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group md:col-span-2">
          <label htmlFor="roomId" className="form-label">
            Phòng thuê
          </label>
          <select
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">-- Chọn phòng --</option>
            {rentableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} - {room.roomNumber} ({room.status === "vacant" ? "Trống" : "Đã thuê"})
              </option>
            ))}
          </select>
          {rentableRooms.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              Hiện không có phòng trống. Vui lòng thêm phòng trước.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={rentableRooms.length === 0}
        >
          {initialData ? "Cập nhật" : "Thêm khách thuê"}
        </button>
      </div>
    </form>
  );
};

export default TenantForm;
