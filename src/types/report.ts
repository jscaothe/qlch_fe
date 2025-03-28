export type ReportType = 'revenue' | 'occupancy' | 'tenant' | 'maintenance';

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReportFilter {
  type: ReportType;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
}

export interface ReportSummary {
  totalRevenue: number;
  averageOccupancy: number;
  totalTenants: number;
  activeContracts: number;
  maintenanceCount: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface OccupancyData {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export interface TenantData {
  date: string;
  newTenants: number;
  endedContracts: number;
  totalTenants: number;
}

export interface MaintenanceData {
  date: string;
  pending: number;
  inProgress: number;
  completed: number;
} 