
import { Badge } from "@/components/ui/badge";
import { Contract, ContractStatus } from "@/types/contracts";

// Constants for status display mapping
export const STATUS_DISPLAY = {
  active: { text: "Đang hiệu lực", className: "bg-emerald-100 text-emerald-800" },
  expired: { text: "Đã hết hạn", className: "bg-rose-100 text-rose-800" },
  pending: { text: "Chờ ký kết", className: "bg-amber-100 text-amber-800" },
};

export const getStatusBadge = (status: ContractStatus) => {
  const statusConfig = STATUS_DISPLAY[status] || { 
    text: "Không xác định", 
    className: "bg-gray-100 text-gray-800" 
  };
  
  return (
    <Badge className={statusConfig.className}>
      {statusConfig.text}
    </Badge>
  );
};

// Filter contracts based on status and search query
export const filterContracts = (
  contracts: Contract[], 
  activeTab: "all" | "active" | "expired", 
  searchQuery: string
): Contract[] => {
  return contracts.filter(contract => {
    // Lọc theo trạng thái
    if (activeTab === "active" && contract.status !== "active") return false;
    if (activeTab === "expired" && contract.status !== "expired") return false;
    
    // Lọc theo chuỗi tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contract.id.toLowerCase().includes(query) ||
        contract.tenantName.toLowerCase().includes(query) ||
        contract.roomNumber.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};

// Calculate total monthly rent from active contracts
export const calculateTotalMonthlyRent = (contracts: Contract[]): number => {
  return contracts.reduce(
    (total, contract) => contract.status === "active" ? total + contract.monthlyRent : total, 
    0
  );
};
