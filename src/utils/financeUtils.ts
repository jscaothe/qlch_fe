
import { Transaction, TransactionType, CategorySummary, MonthlyFinanceData } from "@/types/finances";

// Định nghĩa thông tin hiển thị cho các loại giao dịch
export const TRANSACTION_TYPE_INFO = {
  income: {
    text: "Khoản thu",
    className: "text-emerald-600"
  },
  expense: {
    text: "Khoản chi",
    className: "text-rose-600"
  }
};

// Định nghĩa thông tin hiển thị cho các danh mục
export const CATEGORY_INFO: Record<string, {text: string, className: string}> = {
  // Thu
  rent: { text: "Tiền thuê phòng", className: "bg-violet-100 text-violet-800" },
  deposit: { text: "Tiền đặt cọc", className: "bg-blue-100 text-blue-800" },
  service: { text: "Phí dịch vụ", className: "bg-cyan-100 text-cyan-800" },
  penalty: { text: "Tiền phạt", className: "bg-amber-100 text-amber-800" },
  other_income: { text: "Thu khác", className: "bg-slate-100 text-slate-800" },
  
  // Chi
  maintenance: { text: "Bảo trì sửa chữa", className: "bg-orange-100 text-orange-800" },
  utility: { text: "Điện nước", className: "bg-emerald-100 text-emerald-800" },
  salary: { text: "Lương nhân viên", className: "bg-purple-100 text-purple-800" },
  tax: { text: "Thuế phí", className: "bg-pink-100 text-pink-800" },
  other_expense: { text: "Chi khác", className: "bg-slate-100 text-slate-800" }
};

// Trả về thông tin hiển thị của danh mục
export const getCategoryInfo = (category: string) => {
  return CATEGORY_INFO[category] || { text: "Không xác định", className: "bg-gray-100 text-gray-800" };
};

// Lọc giao dịch theo loại, thời gian và từ khóa tìm kiếm
export const filterTransactions = (
  transactions: Transaction[],
  filters: {
    type?: TransactionType | "all",
    startDate?: string,
    endDate?: string,
    searchQuery?: string
  }
): Transaction[] => {
  return transactions.filter(transaction => {
    // Lọc theo loại giao dịch
    if (filters.type && filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }
    
    // Lọc theo ngày bắt đầu
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false;
    }
    
    // Lọc theo ngày kết thúc
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Lọc theo từ khóa
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        (transaction.roomId && transaction.roomId.toLowerCase().includes(query)) ||
        (transaction.tenantId && transaction.tenantId.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
};

// Tính tổng thu hoặc chi trong khoảng thời gian
export const calculateTotal = (
  transactions: Transaction[],
  type: TransactionType
): number => {
  return transactions
    .filter(transaction => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

// Tạo dữ liệu tổng hợp theo danh mục
export const summarizeByCategory = (
  transactions: Transaction[],
  type: TransactionType
): CategorySummary[] => {
  const filteredTransactions = transactions.filter(t => t.type === type);
  const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Nhóm theo danh mục
  const categorySums: Record<string, number> = {};
  
  filteredTransactions.forEach(transaction => {
    if (!categorySums[transaction.category]) {
      categorySums[transaction.category] = 0;
    }
    categorySums[transaction.category] += transaction.amount;
  });
  
  // Chuyển đổi thành mảng và tính phần trăm
  return Object.entries(categorySums).map(([category, categoryTotal]) => ({
    category: category as Transaction["category"],
    total: categoryTotal,
    percent: total > 0 ? Math.round((categoryTotal / total) * 100) : 0
  }))
  .sort((a, b) => b.total - a.total); // Sắp xếp theo giá trị giảm dần
};

// Tạo dữ liệu cho biểu đồ theo tháng
export const generateMonthlyData = (
  transactions: Transaction[],
  monthCount: number = 6
): MonthlyFinanceData[] => {
  const now = new Date();
  const result: MonthlyFinanceData[] = [];
  
  // Tạo mảng các tháng gần đây
  for (let i = 0; i < monthCount; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    result.unshift({
      month: monthStr,
      income: 0,
      expense: 0
    });
  }
  
  // Tính tổng thu, chi cho từng tháng
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthStr = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    const monthData = result.find(item => item.month === monthStr);
    if (monthData) {
      if (transaction.type === "income") {
        monthData.income += transaction.amount;
      } else {
        monthData.expense += transaction.amount;
      }
    }
  });
  
  return result;
};

// Định dạng tiền tệ VND
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};
