import type { ReactNode } from "react";

/**
 * Root dashboard wrapper. Authentication is checked by the customer/admin
 * role layouts so this file can stay presentational.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
