
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type OccupancyData = {
  name: string;
  value: number;
  color: string;
};

type OccupancyChartProps = {
  data: OccupancyData[];
};

const OccupancyChart = ({ data }: OccupancyChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="dashboard-card h-[300px] flex items-center justify-center">
        <p className="text-gray-500">Không có dữ liệu hiển thị</p>
      </div>
    );
  }
  
  return (
    <div 
      className="dashboard-card h-[300px]"
      role="region" 
      aria-label="Biểu đồ tỷ lệ lấp đầy phòng"
    >
      <h3 className="text-lg font-semibold mb-4">Tỷ lệ lấp đầy</h3>
      
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} phòng`, ""]}
            labelFormatter={() => ""}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
