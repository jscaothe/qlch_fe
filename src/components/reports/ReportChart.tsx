import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData, OccupancyData, TenantData, MaintenanceData } from "@/types/report";
import { formatCurrency } from "@/lib/utils";

interface ReportChartProps {
  type: 'revenue' | 'occupancy' | 'tenant' | 'maintenance';
  data: RevenueData[] | OccupancyData[] | TenantData[] | MaintenanceData[];
}

const ReportChart = ({ type, data }: ReportChartProps) => {
  const renderChart = () => {
    switch (type) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data as RevenueData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Ngày: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" />
              <Line type="monotone" dataKey="expenses" name="Chi phí" stroke="#ef4444" />
              <Line type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'occupancy':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data as OccupancyData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value: number) => `${value}%`}
                labelFormatter={(label) => `Ngày: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="occupancyRate" name="Tỷ lệ lấp đầy" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'tenant':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data as TenantData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip labelFormatter={(label) => `Ngày: ${label}`} />
              <Legend />
              <Bar dataKey="newTenants" name="Khách mới" fill="#10b981" />
              <Bar dataKey="endedContracts" name="Hết hợp đồng" fill="#ef4444" />
              <Line type="monotone" dataKey="totalTenants" name="Tổng số" stroke="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'maintenance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data as MaintenanceData[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip labelFormatter={(label) => `Ngày: ${label}`} />
              <Legend />
              <Bar dataKey="pending" name="Chờ xử lý" fill="#fbbf24" />
              <Bar dataKey="inProgress" name="Đang xử lý" fill="#6366f1" />
              <Bar dataKey="completed" name="Hoàn thành" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'revenue':
        return 'Biểu đồ doanh thu';
      case 'occupancy':
        return 'Biểu đồ tỷ lệ lấp đầy';
      case 'tenant':
        return 'Biểu đồ khách thuê';
      case 'maintenance':
        return 'Biểu đồ bảo trì';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
};

export default ReportChart; 