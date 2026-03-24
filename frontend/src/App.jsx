import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardLayout from '@/pages/dashboard/DashboardLayout'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import LiveMapPage from '@/pages/dashboard/LiveMapPage'
import NewShipmentPage from '@/pages/dashboard/NewShipmentPage'
import DecisionIntelligencePage from '@/pages/dashboard/DecisionIntelligencePage'
import CompliancePage from '@/pages/dashboard/CompliancePage'
import AuditLogPage from '@/pages/dashboard/AuditLogPage'
import SettingsPage from '@/pages/dashboard/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardLayout /></ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="map" element={<LiveMapPage />} />
        <Route path="new-shipment" element={<NewShipmentPage />} />
        <Route path="decisions" element={<DecisionIntelligencePage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
