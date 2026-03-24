import { motion } from "framer-motion"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { LiveMap } from "@/components/dashboard/live-map"
import { DecisionIntelligencePanel } from "@/components/dashboard/decision-intelligence"
import { CompliancePanel } from "@/components/dashboard/compliance-panel"
import { AuditLog } from "@/components/dashboard/audit-log"
import { TaskExecutionFlow } from "@/components/dashboard/task-execution-flow"


export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground">Real-time supply chain intelligence for Indian logistics</p>
        </div>
        <QuickActions />
      </motion.div>
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[500px]"><LiveMap /></div>
        <div className="h-[500px]"><DecisionIntelligencePanel /></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TaskExecutionFlow />
        <CompliancePanel />
      </div>
      <AuditLog />
    </div>
  )
}
