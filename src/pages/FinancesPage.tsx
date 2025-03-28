
import React, { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Wallet, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  BadgeDollarSign, 
  Filter 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Transaction, TransactionType } from "@/types/finances";
import { 
  filterTransactions, 
  calculateTotal, 
  generateMonthlyData, 
  summarizeByCategory 
} from "@/utils/financeUtils";
import TransactionTable from "@/components/finances/TransactionTable";
import TransactionForm from "@/components/finances/TransactionForm";
import FinanceChart from "@/components/finances/FinanceChart";
import CategoryPieChart from "@/components/finances/CategoryPieChart";
import FinanceStatsCard from "@/components/finances/FinanceStatsCard";

// Dữ liệu mẫu
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TRX001",
    date: "2023-07-01",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 7/2023",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX002",
    date: "2023-07-05",
    amount: 4500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 7/2023",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX003",
    date: "2023-07-10",
    amount: 1500000,
    type: "expense",
    category: "maintenance",
    description: "Sửa chữa điều hòa phòng 101",
    roomId: "R101"
  },
  {
    id: "TRX004",
    date: "2023-08-01",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 8/2023",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX005",
    date: "2023-08-05",
    amount: 4500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 8/2023",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX006",
    date: "2023-08-15",
    amount: 2500000,
    type: "expense",
    category: "utility",
    description: "Tiền điện nước tháng 8/2023"
  },
  {
    id: "TRX007",
    date: "2023-09-01",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 9/2023",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX008",
    date: "2023-09-05",
    amount: 4500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 9/2023",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX009",
    date: "2023-09-20",
    amount: 3000000,
    type: "expense",
    category: "maintenance",
    description: "Sửa chữa cửa và khóa các phòng"
  },
  {
    id: "TRX010",
    date: "2023-10-01",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 10/2023",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX011",
    date: "2023-10-05",
    amount: 4500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 10/2023",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX012",
    date: "2023-10-10",
    amount: 2000000,
    type: "expense",
    category: "utility",
    description: "Tiền điện nước tháng 10/2023"
  },
  {
    id: "TRX013",
    date: "2023-11-01",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 11/2023",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX014",
    date: "2023-11-05",
    amount: 4500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 11/2023",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX015",
    date: "2023-11-15",
    amount: 1000000,
    type: "expense",
    category: "tax",
    description: "Thuế nhà đất quý 4/2023"
  },
  {
    id: "TRX016",
    date: "2023-12-01",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 12/2023",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX017",
    date: "2023-12-05",
    amount: 4500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 12/2023",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX018",
    date: "2023-12-20",
    amount: 4000000,
    type: "expense",
    category: "maintenance",
    description: "Sơn lại toàn bộ mặt ngoài tòa nhà"
  },
  {
    id: "TRX019",
    date: "2024-01-01",
    amount: 5500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 1/2024 (đã tăng giá)",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX020",
    date: "2024-01-05",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 1/2024 (đã tăng giá)",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX021",
    date: "2024-01-10",
    amount: 2500000,
    type: "expense",
    category: "utility",
    description: "Tiền điện nước tháng 1/2024"
  },
  {
    id: "TRX022",
    date: "2024-02-01",
    amount: 5500000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 101 tháng 2/2024",
    roomId: "R101",
    tenantId: "T001"
  },
  {
    id: "TRX023",
    date: "2024-02-05",
    amount: 5000000,
    type: "income",
    category: "rent",
    description: "Tiền thuê phòng 102 tháng 2/2024",
    roomId: "R102",
    tenantId: "T002"
  },
  {
    id: "TRX024",
    date: "2024-02-15",
    amount: 3000000,
    type: "expense",
    category: "salary",
    description: "Lương nhân viên quản lý tháng 2/2024"
  }
];

const FinancesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | TransactionType>("all");
  const [filterDateFrom, setFilterDateFrom] = useState<Date | undefined>(undefined);
  const [filterDateTo, setFilterDateTo] = useState<Date | undefined>(undefined);
  
  // Lọc giao dịch
  const filteredTransactions = filterTransactions(transactions, {
    type: activeTab !== "all" ? activeTab : undefined,
    startDate: filterDateFrom ? format(filterDateFrom, "yyyy-MM-dd") : undefined,
    endDate: filterDateTo ? format(filterDateTo, "yyyy-MM-dd") : undefined,
    searchQuery: searchQuery
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Tính tổng thu, chi và số dư
  const totalIncome = calculateTotal(filteredTransactions, "income");
  const totalExpense = calculateTotal(filteredTransactions, "expense");
  const balance = totalIncome - totalExpense;

  // Tạo dữ liệu biểu đồ
  const monthlyData = generateMonthlyData(transactions, 6);
  const incomeByCategory = summarizeByCategory(filteredTransactions, "income");
  const expenseByCategory = summarizeByCategory(filteredTransactions, "expense");

  // Màu sắc cho biểu đồ
  const incomeColors = ['#9b87f5', '#6875f5', '#3b82f6', '#0ea5e9', '#22d3ee', '#2dd4bf'];
  const expenseColors = ['#f43f5e', '#fb7185', '#fda4af', '#f97316', '#fb923c', '#fdba74'];

  // Xử lý thêm giao dịch mới
  const handleAddTransaction = (data: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...data,
      id: `TRX${transactions.length + 1}`.padStart(6, '0'),
    };
    
    setTransactions([...transactions, newTransaction]);
    
    toast({
      title: "Đã thêm giao dịch mới",
      description: "Giao dịch đã được thêm thành công",
    });
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setFilterDateFrom(undefined);
    setFilterDateTo(undefined);
  };

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="page-title mb-4 sm:mb-0">
            Quản lý thu chi
          </h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus size={16} />
                Thêm giao dịch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Thêm giao dịch mới</DialogTitle>
              </DialogHeader>
              <TransactionForm onSubmit={handleAddTransaction} />
            </DialogContent>
          </Dialog>
        </div>
        
        <FinanceStatsCard 
          totalIncome={totalIncome} 
          totalExpense={totalExpense} 
          balance={balance} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FinanceChart data={monthlyData} />
          
          <div className="grid grid-cols-1 gap-6">
            <CategoryPieChart 
              data={incomeByCategory} 
              title="Cơ cấu thu"
              colors={incomeColors}
            />
            
            <CategoryPieChart 
              data={expenseByCategory} 
              title="Cơ cấu chi"
              colors={expenseColors}
            />
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Khoảng thời gian
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="end">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Từ ngày</h4>
                        <Calendar
                          mode="single"
                          selected={filterDateFrom}
                          onSelect={setFilterDateFrom}
                          initialFocus
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Đến ngày</h4>
                        <Calendar
                          mode="single"
                          selected={filterDateTo}
                          onSelect={setFilterDateTo}
                          initialFocus
                        />
                      </div>
                      <Button variant="outline" onClick={handleResetFilters}>
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Select
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as "all" | TransactionType)}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Loại giao dịch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="income">Khoản thu</SelectItem>
                    <SelectItem value="expense">Khoản chi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="income" className="text-emerald-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Khoản thu
                </TabsTrigger>
                <TabsTrigger value="expense" className="text-rose-600">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  Khoản chi
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <TransactionTable transactions={filteredTransactions} />
              </TabsContent>
              
              <TabsContent value="income">
                <TransactionTable 
                  transactions={filteredTransactions.filter(t => t.type === "income")} 
                />
              </TabsContent>
              
              <TabsContent value="expense">
                <TransactionTable 
                  transactions={filteredTransactions.filter(t => t.type === "expense")} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FinancesPage;
