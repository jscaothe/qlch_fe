
import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Room } from "@/components/rooms/RoomCard";

type RoomFormProps = {
  initialData?: Room;
  onSubmit: (data: Omit<Room, "id">) => void;
  onCancel: () => void;
};

const RoomForm = ({ initialData, onSubmit, onCancel }: RoomFormProps) => {
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    name: initialData?.name || "",
    floor: initialData?.floor || 1,
    roomNumber: initialData?.roomNumber || "",
    area: initialData?.area || 0,
    price: initialData?.price || 0,
    status: initialData?.status || "vacant",
    amenities: initialData?.amenities || [],
    image: initialData?.image || "",
  });

  const [newAmenity, setNewAmenity] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "floor" || name === "area" || name === "price" 
        ? Number(value) 
        : value,
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== amenity),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Tên phòng
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
          <label htmlFor="roomNumber" className="form-label">
            Mã phòng
          </label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="floor" className="form-label">
            Tầng
          </label>
          <input
            type="number"
            id="floor"
            name="floor"
            min={1}
            value={formData.floor}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="area" className="form-label">
            Diện tích (m²)
          </label>
          <input
            type="number"
            id="area"
            name="area"
            min={0}
            step={0.1}
            value={formData.area}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Giá thuê (VNĐ/tháng)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min={0}
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Tình trạng
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="vacant">Còn trống</option>
            <option value="occupied">Đã thuê</option>
            <option value="maintenance">Bảo trì</option>
          </select>
        </div>

        <div className="form-group md:col-span-2">
          <label htmlFor="image" className="form-label">
            URL hình ảnh
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image || ""}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group md:col-span-2">
          <label className="form-label">Tiện nghi</label>
          <div className="flex items-center">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              className="form-input mr-2"
              placeholder="Thêm tiện nghi..."
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="btn-secondary flex items-center"
            >
              <Plus size={16} className="mr-1" /> Thêm
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {formData.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1"
              >
                <span className="text-sm">{amenity}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(amenity)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
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
        >
          {initialData ? "Cập nhật" : "Thêm phòng"}
        </button>
      </div>
    </form>
  );
};

export default RoomForm;
