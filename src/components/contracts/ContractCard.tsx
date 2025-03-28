
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ContractDetail from "./ContractDetail";

type ContractStatus = "active" | "expired" | "pending";

type Contract = {
  id: string;
  tenantName: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  monthlyRent: number;
  deposit: number;
};

type ContractCardProps = {
  contract: Contract;
};

const ContractCard = ({ contract }: ContractCardProps) => {
  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800">Đang hiệu lực</Badge>;
      case "expired":
        return <Badge className="bg-rose-100 text-rose-800">Đã hết hạn</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Chờ ký kết</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{contract.id}</h3>
            {getStatusBadge(contract.status)}
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{contract.tenantName}</span>
            </div>
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Phòng {contract.roomNumber}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{contract.startDate} - {contract.endDate}</span>
            </div>
            <div className="font-medium mt-2">
              {contract.monthlyRent.toLocaleString('vi-VN')} đ/tháng
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-4 py-3 bg-muted/30">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Xem chi tiết
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Chi tiết hợp đồng</SheetTitle>
            </SheetHeader>
            <ContractDetail contract={contract} />
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
};

export default ContractCard;
