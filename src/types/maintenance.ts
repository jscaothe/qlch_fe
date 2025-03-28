export interface Maintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'preventive' | 'corrective' | 'predictive';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  startDate: string;
  endDate?: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  cost?: number;
  notes?: string;
}

export interface MaintenanceFilter {
  status?: Maintenance['status'];
  maintenanceType?: Maintenance['maintenanceType'];
  priority?: Maintenance['priority'];
  startDate?: string;
  endDate?: string;
  equipmentId?: string;
} 