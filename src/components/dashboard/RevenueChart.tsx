
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type RevenueData = {
  month: string;
  revenue: number;
  expenses: number;
};

type RevenueChartProps = {
  data: RevenueData[];
};

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <div className="dashboard-card h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Doanh thu & Chi phí</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => 
              value >= 1000000 
                ? `${(value / 1000000).toFixed(1)}M` 
                : `${(value / 1000).toFixed(0)}K`
            } 
          />
          <Tooltip 
            formatter={(value) => 
              [`${new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(Number(value))}`, ""]
            }
          />
          <Legend />
          <Bar 
            name="Doanh thu" 
            dataKey="revenue" 
            fill="#9b87f5" 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            name="Chi phí" 
            dataKey="expenses" 
            fill="#0EA5E9" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
