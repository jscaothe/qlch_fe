export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  roomId: string;
  tenantId: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceFilters {
  status?: 'pending' | 'paid' | 'overdue';
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
} 