
import React from "react";
import { formatCurrency } from "@/utils/financeUtils";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BadgeDollarSign, 
  CreditCard, 
  Wallet 
} from "lucide-react";

type FinanceStatsCardProps = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

const FinanceStatsCard = ({ totalIncome, totalExpense, balance }: FinanceStatsCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <div className="dashboard-card">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tổng thu</h3>
            <p className="text-2xl font-bold mt-1 text-emerald-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
            <ArrowUpIcon size={20} />
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tổng chi</h3>
            <p className="text-2xl font-bold mt-1 text-rose-600">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="p-3 rounded-full bg-rose-100 text-rose-600">
            <ArrowDownIcon size={20} />
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Số dư</h3>
            <p className={`text-2xl font-bold mt-1 ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <BadgeDollarSign size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceStatsCard;
