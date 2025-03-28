import React, { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  FileText, 
  Search, 
  Plus, 
  Filter,
  Download,
  Printer
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Invoice, InvoiceFilters } from "@/types/invoice";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import InvoiceForm from "@/components/invoices/InvoiceForm";

// Dữ liệu mẫu
const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV001",
    invoiceNumber: "INV-2024-001",
    date: "2024-03-01",
    dueDate: "2024-03-15",
    roomId: "R101",
    tenantId: "T001",
    items: [
      {
        id: "ITEM001",
        description: "Tiền thuê phòng tháng 3/2024",
        amount: 5500000,
        quantity: 1,
        unitPrice: 5500000
      },
      {
        id: "ITEM002",
        description: "Tiền điện nước tháng 2/2024",
        amount: 500000,
        quantity: 1,
        unitPrice: 500000
      }
    ],
    totalAmount: 6000000,
    status: "pending",
    notes: "Thanh toán trước ngày 15/03/2024"
  },
  {
    id: "INV002",
    invoiceNumber: "INV-2024-002",
    date: "2024-03-01",
    dueDate: "2024-03-15",
    roomId: "R102",
    tenantId: "T002",
    items: [
      {
        id: "ITEM003",
        description: "Tiền thuê phòng tháng 3/2024",
        amount: 5000000,
        quantity: 1,
        unitPrice: 5000000
      },
      {
        id: "ITEM004",
        description: "Tiền điện nước tháng 2/2024",
        amount: 450000,
        quantity: 1,
        unitPrice: 450000
      }
    ],
    totalAmount: 5450000,
    status: "paid",
    notes: "Đã thanh toán ngày 05/03/2024"
  }
];

const InvoicesPage = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleAddInvoice = (data: Omit<Invoice, "id">) => {
    const newInvoice = {
      ...data,
      id: `INV${String(invoices.length + 1).padStart(3, "0")}`,
    };
    setInvoices([...invoices, newInvoice]);
    setIsOpen(false);
    toast({
      title: "Thành công",
      description: "Đã tạo hóa đơn mới",
    });
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filters.status && invoice.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.roomId.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h1 className="page-title mb-4 sm:mb-0">Quản lý Hóa đơn</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus size={16} />
                Tạo hóa đơn mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Tạo hóa đơn mới</DialogTitle>
              </DialogHeader>
              <InvoiceForm onSubmit={handleAddInvoice} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo số hóa đơn hoặc phòng..."
                    className="pl-8"
                    value={filters.search || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Lọc
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trạng thái</label>
                      <Select
                        value={filters.status}
                        onValueChange={(value: InvoiceFilters["status"]) =>
                          setFilters({ ...filters, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ thanh toán</SelectItem>
                          <SelectItem value="paid">Đã thanh toán</SelectItem>
                          <SelectItem value="overdue">Quá hạn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleResetFilters}
                    >
                      Đặt lại bộ lọc
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <InvoiceTable invoices={filteredInvoices} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvoicesPage; 