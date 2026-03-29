import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RoleBasedRoute } from '@/components/RoleBasedRoute'
import Navbar from '@/components/Navbar'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardRouter from '@/pages/DashboardRouter'
import TrackShipment from '@/pages/TrackShipment'
import Support from '@/pages/Support'
import AdminDashboard from '@/pages/dashboard/AdminDashboard'
import AnalystDashboard from '@/pages/dashboard/AnalystDashboard'
import CustomerOverview from '@/pages/dashboard/customer/CustomerOverview'
import CustomerShipments from '@/pages/dashboard/customer/CustomerShipments'
import TrackingHub from '@/pages/dashboard/customer/TrackingHub'
import CustomerShipmentDetails from '@/pages/dashboard/customer/CustomerShipmentDetails'
import SupportHub from '@/pages/dashboard/customer/SupportHub'

// --- OFFICER IMPORTS ---
import CompanyOfficerOverview from '@/pages/dashboard/officer/CompanyOfficerOverview'
import CreateShipmentFlow from '@/pages/dashboard/officer/CreateShipmentFlow'
import OfficerLiveMap from '@/pages/dashboard/officer/OfficerLiveMap'
import DecisionAiEngine from '@/pages/dashboard/officer/DecisionAiEngine'
import FleetDirectory from '@/pages/dashboard/officer/FleetDirectory'
import Compliance from '@/pages/dashboard/officer/Compliance'
import AuditLogs from '@/pages/dashboard/officer/AuditLogs'

import DriverOverview from '@/pages/dashboard/driver/DriverOverview'
import MyTasks from '@/pages/dashboard/driver/MyTasks'
import MyShipments from '@/pages/dashboard/driver/MyShipments'
import Delivered from '@/pages/dashboard/driver/Delivered'
import LiveTracking from '@/pages/dashboard/driver/LiveTracking'
import ShipmentDetails from '@/pages/dashboard/driver/ShipmentDetails'
import DashboardLayout from '@/pages/dashboard/DashboardLayout'
import SettingsPage from '@/pages/dashboard/SettingsPage'

export default function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/track" element={<TrackShipment />} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        
        {/* The MASTER DASHBOARD LAYOUT (Provides Sidebar) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          
          {/* Index Route - Decides which overview page to show */}
          <Route index element={<DashboardRouter />} />
          
          {/* --- ADMIN ROUTES --- */}
          <Route path="users" element={<RoleBasedRoute requiredRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>} />
          <Route path="shipments" element={<RoleBasedRoute requiredRoles={['ADMIN']}><AdminDashboard /></RoleBasedRoute>} />
          
          {/* --- DRIVER ROUTES --- */}
          <Route path="tasks" element={<RoleBasedRoute requiredRoles={['DRIVER']}><MyTasks /></RoleBasedRoute>} />
          <Route path="driver-shipments" element={<RoleBasedRoute requiredRoles={['DRIVER']}><MyShipments /></RoleBasedRoute>} />
          <Route path="delivered" element={<RoleBasedRoute requiredRoles={['DRIVER']}><Delivered /></RoleBasedRoute>} />
          <Route path="location" element={<RoleBasedRoute requiredRoles={['DRIVER']}><LiveTracking /></RoleBasedRoute>} />
          <Route path="shipment/:id" element={<RoleBasedRoute requiredRoles={['DRIVER']}><ShipmentDetails /></RoleBasedRoute>} />
          
          {/* --- COMPANY OFFICER ROUTES --- */}
          <Route path="create-shipment" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><CreateShipmentFlow /></RoleBasedRoute>} />
          <Route path="live-map" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><OfficerLiveMap /></RoleBasedRoute>} />
          <Route path="decision-ai" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><DecisionAiEngine /></RoleBasedRoute>} />
          <Route path="fleet" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><FleetDirectory /></RoleBasedRoute>} />
          <Route path="compliance" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><Compliance /></RoleBasedRoute>} />
          <Route path="audit-logs" element={<RoleBasedRoute requiredRoles={['COMPANY_OFFICER']}><AuditLogs /></RoleBasedRoute>} />

          {/* --- ANALYST ROUTES --- */}
          <Route path="analytics" element={<RoleBasedRoute requiredRoles={['ANALYST']}><AnalystDashboard /></RoleBasedRoute>} />

          {/* --- CUSTOMER ROUTES --- */}
          <Route path="customer-shipments" element={<RoleBasedRoute requiredRoles={['CUSTOMER']}><CustomerShipments /></RoleBasedRoute>} />
          <Route path="tracking" element={<RoleBasedRoute requiredRoles={['CUSTOMER']}><TrackingHub /></RoleBasedRoute>} />
          <Route path="tracking/:id" element={<RoleBasedRoute requiredRoles={['CUSTOMER']}><TrackingHub /></RoleBasedRoute>} />
          <Route path="customer-shipment/:id" element={<RoleBasedRoute requiredRoles={['CUSTOMER']}><CustomerShipmentDetails /></RoleBasedRoute>} />
          <Route path="support" element={<RoleBasedRoute requiredRoles={['CUSTOMER']}><SupportHub /></RoleBasedRoute>} />
          
          {/* Settings Route (Shared — all roles) */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}