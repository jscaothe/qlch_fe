import React, { useState } from "react";
import { Edit, Trash2, Home, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { RoomType } from "@/types/room-type";

export type Room = {
  id: string;
  name: string;
  floor: number;
  area: number;
  price: number;
  status: "vacant" | "occupied" | "maintenance" | "reserved";
  roomType: string;
  amenities: string[];
  images: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
};

type RoomCardProps = {
  room: Room;
  roomTypes?: RoomType[];
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
  className?: string;
};

const RoomCard = ({ room, roomTypes = [], onEdit, onDelete, className }: RoomCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(room.price);

  const roomTypeName = roomTypes?.find?.(type => type.id === room.roomType)?.name || "Không xác định";

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? room.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === room.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={cn("glass-card overflow-hidden group", className)}>
      <div className="h-40 bg-gray-200 relative">
        {room.images.length > 0 ? (
          <>
            <img
              src={room.images[currentImageIndex]}
              alt={room.name}
              className="w-full h-full object-cover"
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {room.images.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Home size={40} className="text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={room.status} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{room.name}</h3>
          <span className="text-sm text-primary font-medium">{roomTypeName}</span>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Tầng {room.floor}
          </p>
          <p className="text-sm text-gray-600">
            {room.area} m² · {formattedPrice}/tháng
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-gray-100 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(room)}
            className="p-2 text-gray-600 hover:text-primary transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="p-2 text-gray-600 hover:text-destructive transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
