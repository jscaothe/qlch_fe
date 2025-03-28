
import React from "react";
import { Edit, Trash2, Home } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

export type Room = {
  id: string;
  name: string;
  floor: number;
  roomNumber: string;
  area: number;
  price: number;
  status: "vacant" | "occupied" | "maintenance";
  amenities: string[];
  image?: string;
};

type RoomCardProps = {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
  className?: string;
};

const RoomCard = ({ room, onEdit, onDelete, className }: RoomCardProps) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(room.price);

  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      <div className="h-40 bg-gray-200 relative">
        {room.image ? (
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
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
        <h3 className="text-lg font-semibold">{room.name}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Tầng {room.floor} · Phòng {room.roomNumber}
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
