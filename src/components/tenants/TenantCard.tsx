
import React from "react";
import { Edit, Trash2, User, Phone, Mail, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tenant = {
  id: string;
  name: string;
  phone: string;
  email: string;
  identityCard: string;
  dateOfBirth: string;
  address: string;
  startDate: string;
  endDate: string;
  roomId: string;
  roomName: string;
  avatar?: string;
};

type TenantCardProps = {
  tenant: Tenant;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenantId: string) => void;
  className?: string;
};

const TenantCard = ({ tenant, onEdit, onDelete, className }: TenantCardProps) => {
  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 bg-gray-100 p-4 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-3">
            {tenant.avatar ? (
              <img
                src={tenant.avatar}
                alt={tenant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User size={40} className="text-gray-400" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-center">{tenant.name}</h3>
          <p className="text-sm text-center text-primary">Phòng {tenant.roomName}</p>
        </div>

        <div className="w-full sm:w-2/3 p-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <Phone size={16} className="mr-2 text-gray-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Số điện thoại</p>
                <p className="text-sm">{tenant.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail size={16} className="mr-2 text-gray-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{tenant.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar size={16} className="mr-2 text-gray-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Thời gian thuê</p>
                <p className="text-sm">
                  {new Date(tenant.startDate).toLocaleDateString("vi-VN")} -&nbsp;
                  {new Date(tenant.endDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onEdit(tenant)}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(tenant.id)}
              className="p-2 text-gray-600 hover:text-destructive transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantCard;
