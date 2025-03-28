
export type ContractStatus = "active" | "expired" | "pending";

export type Contract = {
  id: string;
  tenantName: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  monthlyRent: number;
  deposit: number;
};

// Thêm một số utility type cho việc quản lý hợp đồng
export type ContractFilter = {
  status?: ContractStatus;
  searchQuery?: string;
};

// Thêm type cho các action với hợp đồng
export type ContractAction = {
  type: "renew" | "terminate" | "print" | "view";
  contract: Contract;
};
