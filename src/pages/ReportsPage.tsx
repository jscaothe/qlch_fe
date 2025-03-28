import React, { useState } from "react";
import { format, subDays, subMonths } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ReportType, ReportPeriod } from "@/types/report";
import ReportSummaryCards from "@/components/reports/ReportSummaryCards";
import ReportChart from "@/components/reports/ReportChart";

// Mock data
const mockSummary = {
  totalRevenue: 150000000,
  averageOccupancy: 85.5,
  totalTenants: 42,
  activeContracts: 38,
  maintenanceCount: 5,
};

const generateMockData = (days: number) => {
  const data = {
    revenue: Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - 1 - i), 'dd/MM/yyyy'),
      revenue: Math.floor(Math.random() * 10000000) + 5000000,
      expenses: Math.floor(Math.random() * 5000000) + 2000000,
      profit: 0,
    })),
    occupancy: Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - 1 - i), 'dd/MM/yyyy'),
      totalRooms: 50,
      occupiedRooms: Math.floor(Math.random() * 10) + 40,
      occupancyRate: 0,
    })),
    tenant: Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - 1 - i), 'dd/MM/yyyy'),
      newTenants: Math.floor(Math.random() * 3),
      endedContracts: Math.floor(Math.random() * 2),
      totalTenants: 42,
    })),
    maintenance: Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - 1 - i), 'dd/MM/yyyy'),
      pending: Math.floor(Math.random() * 3),
      inProgress: Math.floor(Math.random() * 4),
      completed: Math.floor(Math.random() * 5),
    })),
  };

  // Calculate derived values
  data.revenue = data.revenue.map(item => ({
    ...item,
    profit: item.revenue - item.expenses,
  }));

  data.occupancy = data.occupancy.map(item => ({
    ...item,
    occupancyRate: (item.occupiedRooms / item.totalRooms) * 100,
  }));

  return data;
};

const ReportsPage = () => {
  const [reportType, setReportType] = useState<ReportType>('revenue');
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [date, setDate] = useState<Date>(new Date());

  // Generate mock data based on period
  const getDays = () => {
    switch (period) {
      case 'daily':
        return 7;
      case 'weekly':
        return 14;
      case 'monthly':
        return 30;
      case 'yearly':
        return 12;
      default:
        return 30;
    }
  };

  const mockData = generateMockData(getDays());

  return (
    <DashboardLayout>
      <div className="admin-container animate-fade-in">
        <h1 className="page-title mb-6">Báo cáo thống kê</h1>

        {/* Thống kê tổng quan */}
        <div className="mb-8">
          <ReportSummaryCards summary={mockSummary} />
        </div>

        {/* Bộ lọc */}
        <div className="glass-card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Doanh thu</SelectItem>
                <SelectItem value="occupancy">Tỷ lệ lấp đầy</SelectItem>
                <SelectItem value="tenant">Khách thuê</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={(value: ReportPeriod) => setPeriod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn kỳ báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">7 ngày qua</SelectItem>
                <SelectItem value="weekly">14 ngày qua</SelectItem>
                <SelectItem value="monthly">30 ngày qua</SelectItem>
                <SelectItem value="yearly">12 tháng qua</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: vi })
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="glass-card">
          <ReportChart 
            type={reportType}
            data={mockData[reportType]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage; 