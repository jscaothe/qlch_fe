
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
