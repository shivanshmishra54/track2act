import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import AdminDashboard from "./dashboard/AdminDashboard"
import DriverOverview from "./dashboard/driver/DriverOverview"
import CustomerOverview from "./dashboard/customer/CustomerOverview"
import CompanyOfficerOverview from "./dashboard/officer/CompanyOfficerOverview"
import AnalystDashboard from "./dashboard/AnalystDashboard"

const ROLE_DASHBOARD = {
  ADMIN:          AdminDashboard,
  DRIVER:         DriverOverview,
  COMPANY_OFFICER: CompanyOfficerOverview,
  PORT_MANAGER:   CompanyOfficerOverview,
  ANALYST:        AnalystDashboard,
  CUSTOMER:       CustomerOverview,
}

export default function DashboardRouter() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const DashboardComponent = ROLE_DASHBOARD[user.role]
  if (!DashboardComponent) return <Navigate to="/login" replace />

  return <DashboardComponent />
}
