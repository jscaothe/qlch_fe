
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ContractDetail from "./ContractDetail";
import { Contract, ContractStatus } from "@/types/contracts";
import { getStatusConfig } from "@/utils/contractUtils";

type ContractCardProps = {
  contract: Contract;
};

const ContractCard = ({ contract }: ContractCardProps) => {
  const renderStatusBadge = (status: ContractStatus) => {
    const statusConfig = getStatusConfig(status);
    return (
      <Badge className={statusConfig.className}>
        {statusConfig.text}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{contract.id}</h3>
            {renderStatusBadge(contract.status)}
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
            <Button 
              variant="outline" 
              size="sm"
              aria-label="Xem chi tiết hợp đồng"
            >
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
