import React, { useState } from "react";
import { X, Plus, Image as ImageIcon, Upload } from "lucide-react";
import { Room } from "@/components/rooms/RoomCard";
import { RoomType } from "@/services/settings.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RoomFormProps = {
  initialData?: Room;
  onSubmit: (data: Omit<Room, "id">) => void;
  onCancel: () => void;
  roomTypes: RoomType[];
};

const RoomForm = ({ initialData, onSubmit, onCancel, roomTypes }: RoomFormProps) => {
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    name: initialData?.name || "",
    floor: initialData?.floor || 1,
    roomNumber: initialData?.roomNumber || `ROOM-${Date.now()}`,
    area: initialData?.area || 0,
    price: initialData?.price || 0,
    status: initialData?.status || "vacant",
    roomType: initialData?.roomType || "",
    amenities: initialData?.amenities || [],
    images: initialData?.images || [],
    description: initialData?.description || "",
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: initialData?.updatedAt || new Date().toISOString(),
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageDialogOpen(true);
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

      <div className="form-group mb-6">
        <label className="form-label mb-2">Hình ảnh phòng</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image}
                alt={`Hình ảnh ${index + 1}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(index)}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center">
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Thêm ảnh</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

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
          <label htmlFor="roomType" className="form-label">
            Loại phòng
          </label>
          <select
            id="roomType"
            name="roomType"
            value={formData.roomType}
            onChange={(e) => {
              const selectedType = roomTypes.find(type => type.id === e.target.value);
              setFormData(prev => ({
                ...prev,
                roomType: e.target.value,
              }));
            }}
            className="form-input"
            required
          >
            <option value="">Chọn loại phòng</option>
            {roomTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
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

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <DialogHeader>
            <DialogTitle className="p-4">Xem hình ảnh</DialogTitle>
          </DialogHeader>
          {selectedImageIndex !== null && (
            <div className="relative aspect-video">
              <img
                src={formData.images[selectedImageIndex]}
                alt={`Hình ảnh ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-2 bg-gradient-to-t from-black/50">
                {formData.images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
