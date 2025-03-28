
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
  return (
    <div className="dashboard-card h-[300px]">
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
