export interface CustomerDashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
}

export interface AdminDashboardStats {
  totalRegisteredCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalSuccessfulPayments: number;
  totalRevenue: number;
  currency: string;
}
