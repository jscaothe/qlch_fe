
export type TransactionType = "income" | "expense";

export type TransactionCategory = 
  // Thu
  | "rent" 
  | "deposit" 
  | "service" 
  | "penalty" 
  | "other_income"
  // Chi
  | "maintenance" 
  | "utility" 
  | "salary" 
  | "tax" 
  | "other_expense";

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  roomId?: string;
  tenantId?: string;
};

export type MonthlyFinanceData = {
  month: string;
  income: number;
  expense: number;
};

export type CategorySummary = {
  category: TransactionCategory;
  total: number;
  percent: number;
};
