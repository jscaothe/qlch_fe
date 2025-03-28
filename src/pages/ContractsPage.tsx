import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText, Plus, Search, Filter, CalendarCheck, FileCheck, FileX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ContractCard from "@/components/contracts/ContractCard";
import ContractForm from "@/components/contracts/ContractForm";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Contract, ContractStatus } from "@/types/contracts";

const ContractsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "expired">("all");
  const { toast } = useToast();

  // Dữ liệu giả lập cho hợp đồng - đảm bảo status có kiểu ContractStatus
  const contracts: Contract[] = [
    {
      id: "CTR-001",
      tenantName: "Nguyễn Văn A",
      roomNumber: "101",
      startDate: "01/05/2023",
      endDate: "01/05/2024",
      status: "active" as ContractStatus,
      monthlyRent: 4500000,
      deposit: 9000000
    },
    {
      id: "CTR-002",
      tenantName: "Trần Thị B",
      roomNumber: "102",
      startDate: "15/06/2023",
      endDate: "15/06/2024",
      status: "active" as ContractStatus,
      monthlyRent: 5000000,
      deposit: 10000000
    },
    {
      id: "CTR-003",
      tenantName: "Lê Văn C",
      roomNumber: "103",
      startDate: "10/01/2023",
      endDate: "10/01/2024",
      status: "expired" as ContractStatus,
      monthlyRent: 4800000,
      deposit: 9600000
    },
    {
      id: "CTR-004",
      tenantName: "Phạm Thị D",
      roomNumber: "201",
      startDate: "20/07/2023",
      endDate: "20/07/2024",
      status: "active" as ContractStatus,
      monthlyRent: 5200000,
      deposit: 10400000
    },
  ];

  const filteredContracts = contracts.filter(contract => {
    // Lọc theo trạng thái
    if (activeTab === "active" && contract.status !== "active") return false;
    if (activeTab === "expired" && contract.status !== "expired") return false;
    
    // Lọc theo chuỗi tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contract.id.toLowerCase().includes(query) ||
        contract.tenantName.toLowerCase().includes(query) ||
        contract.roomNumber.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleAddContract = () => {
    setIsOpen(false);
    toast({
      title: "Đã tạo hợp đồng mới",
      description: "Hợp đồng đã được tạo thành công",
    });
  };

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
    <DashboardLayout>
      <div className="admin-container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="page-title">Quản lý hợp đồng</h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus size={16} />
                Tạo hợp đồng mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Tạo hợp đồng mới
                </DialogTitle>
              </DialogHeader>
              <ContractForm onSubmit={handleAddContract} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm theo mã hợp đồng, tên khách thuê, số phòng..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === "all" ? "default" : "outline"} 
                  onClick={() => setActiveTab("all")}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  Tất cả
                </Button>
                <Button 
                  variant={activeTab === "active" ? "default" : "outline"} 
                  onClick={() => setActiveTab("active")}
                >
                  <FileCheck className="mr-1 h-4 w-4" />
                  Đang hiệu lực
                </Button>
                <Button 
                  variant={activeTab === "expired" ? "default" : "outline"} 
                  onClick={() => setActiveTab("expired")}
                >
                  <FileX className="mr-1 h-4 w-4" />
                  Đã hết hạn
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị trên thiết bị di động */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
          
          {filteredContracts.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">Không tìm thấy hợp đồng phù hợp</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Hiển thị trên tablet/desktop */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã hợp đồng</TableHead>
                    <TableHead>Tên khách thuê</TableHead>
                    <TableHead>Phòng</TableHead>
                    <TableHead>Ngày bắt đầu</TableHead>
                    <TableHead>Ngày kết thúc</TableHead>
                    <TableHead>Giá thuê</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>{contract.tenantName}</TableCell>
                      <TableCell>{contract.roomNumber}</TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell>{contract.monthlyRent.toLocaleString('vi-VN')} đ</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredContracts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Không tìm thấy hợp đồng phù hợp
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê hợp đồng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="dashboard-card p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {contracts.filter(c => c.status === "active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hợp đồng đang hiệu lực</div>
                </div>
                <div className="dashboard-card p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {contracts.filter(c => c.status === "expired").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hợp đồng đã hết hạn</div>
                </div>
                <div className="dashboard-card p-4 flex flex-col items-center">
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {contracts.reduce((total, contract) => 
                      contract.status === "active" ? total + contract.monthlyRent : total, 0).toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-sm text-muted-foreground">Tổng giá trị hợp đồng/tháng</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractsPage;
