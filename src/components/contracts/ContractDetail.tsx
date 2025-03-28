import React from "react";
import { CalendarCheck, Home, User, Calendar, BanknoteIcon, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Contract } from "@/types/contracts";

type ContractDetailProps = {
  contract: Contract;
};

const ContractDetail = ({ contract }: ContractDetailProps) => {
  const { toast } = useToast();

  const handlePrintContract = () => {
    toast({
      title: "In hợp đồng",
      description: "Đang chuẩn bị in hợp đồng " + contract.id,
    });
  };

  const handleTerminateContract = () => {
    toast({
      title: "Chấm dứt hợp đồng",
      description: "Đã chấm dứt hợp đồng " + contract.id,
      variant: "destructive",
    });
  };

  const handleRenewContract = () => {
    toast({
      title: "Gia hạn hợp đồng",
      description: "Đã gia hạn hợp đồng " + contract.id + " thêm 12 tháng",
    });
  };

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-start py-2">
      <Icon className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Hợp đồng {contract.id}</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          contract.status === "active" 
            ? "bg-emerald-100 text-emerald-800" 
            : contract.status === "expired" 
            ? "bg-rose-100 text-rose-800" 
            : "bg-amber-100 text-amber-800"
        }`}>
          {contract.status === "active" 
            ? "Đang hiệu lực" 
            : contract.status === "expired" 
            ? "Đã hết hạn" 
            : "Chờ ký kết"}
        </div>
      </div>

      <div className="space-y-1">
        <DetailItem 
          icon={User} 
          label="Khách thuê" 
          value={contract.tenantName} 
        />
        <DetailItem 
          icon={Home} 
          label="Phòng" 
          value={contract.roomNumber} 
        />
        <DetailItem 
          icon={Calendar} 
          label="Thời hạn hợp đồng" 
          value={`${contract.startDate} - ${contract.endDate}`} 
        />
        <DetailItem 
          icon={BanknoteIcon} 
          label="Tiền thuê hàng tháng" 
          value={`${contract.monthlyRent.toLocaleString('vi-VN')} đ`} 
        />
        <DetailItem 
          icon={ShieldCheck} 
          label="Tiền đặt cọc" 
          value={`${contract.deposit.toLocaleString('vi-VN')} đ`} 
        />
      </div>

      <Separator className="my-6" />

      <div className="space-y-3">
        <Button className="w-full" variant="outline" onClick={handlePrintContract}>
          <FileText className="h-4 w-4 mr-2" />
          In hợp đồng
        </Button>
        
        {contract.status === "active" && (
          <>
            <Button className="w-full" variant="outline" onClick={handleRenewContract}>
              <CalendarCheck className="h-4 w-4 mr-2" />
              Gia hạn hợp đồng
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" variant="destructive">
                  Chấm dứt hợp đồng
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận chấm dứt hợp đồng</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn chấm dứt hợp đồng này không? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleTerminateContract}>
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        
        {contract.status === "expired" && (
          <Button className="w-full" onClick={handleRenewContract}>
            <CalendarCheck className="h-4 w-4 mr-2" />
            Tạo hợp đồng mới
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;
