
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/utils/financeUtils";
import { CategorySummary } from "@/types/finances";

type CategoryPieChartProps = {
  data: CategorySummary[];
  title: string;
  colors: string[];
};

const CategoryPieChart = ({ data, title, colors }: CategoryPieChartProps) => {
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
      aria-label={title}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="total"
            nameKey="category"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [formatCurrency(Number(value)), ""]}
          />
          <Legend 
            formatter={(value) => {
              const item = data.find(d => d.category === value);
              return item ? `${value} (${formatCurrency(item.total)})` : value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
