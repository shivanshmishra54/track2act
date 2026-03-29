import { motion } from "framer-motion"
import { useState } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { LiveMap } from "@/components/dashboard/live-map"
import { DecisionIntelligencePanel } from "@/components/dashboard/decision-intelligence"
import { CompliancePanel } from "@/components/dashboard/compliance-panel"
import { AuditLog } from "@/components/dashboard/audit-log"
import { TaskExecutionFlow } from "@/components/dashboard/task-execution-flow"
import { CheckCircle, AlertCircle, TrendingUp, Zap, Activity } from "lucide-react"

const SECTION_HEADER_CLASS = "text-xs font-bold uppercase tracking-widest text-muted-foreground"

const STATUS_METRICS = [
  { icon: CheckCircle, label: "System Status", value: "Operational", iconBg: "bg-emerald-500/12 border-emerald-500/25", iconColor: "text-emerald-500", valueColor: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500/8 to-transparent" },
  { icon: TrendingUp, label: "Performance", value: "98.5%", iconBg: "bg-indigo-500/12 border-indigo-500/25", iconColor: "text-indigo-500", valueColor: "text-foreground", gradient: "from-indigo-500/8 to-transparent" },
  { icon: Zap, label: "Active Operations", value: "127", iconBg: "bg-amber-500/12 border-amber-500/25", iconColor: "text-amber-500", valueColor: "text-foreground", gradient: "from-amber-500/8 to-transparent" },
  { icon: AlertCircle, label: "Alerts", value: "3", iconBg: "bg-rose-500/12 border-rose-500/25", iconColor: "text-rose-500", valueColor: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500/8 to-transparent" },
]

export default function DashboardPage() {
  const [aiData, setAiData] = useState([])

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col gap-3 p-5 lg:p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Supply Chain Intelligence</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Real-time monitoring and control center</p>
          </div>
          <QuickActions />
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 space-y-8">

        {/* Shipment KPIs */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className={SECTION_HEADER_CLASS}>Shipment KPIs</p>
          <StatsCards />
        </motion.section>

        {/* Status Metrics */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          <p className={SECTION_HEADER_CLASS}>System Status</p>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {STATUS_METRICS.map((item, idx) => (
              <motion.div
                key={item.label}
                className={`group relative rounded-2xl border border-border/60 bg-card overflow-hidden card-shadow transition-all duration-200 hover:-translate-y-0.5 hover:card-shadow-lg`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 + idx * 0.065 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-4">
                  <div className={`inline-flex items-center justify-center rounded-xl border p-2.5 mb-3 ${item.iconBg}`}>
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                  <p className={`text-xl font-extrabold ${item.valueColor}`}>{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Live Map + Decision Intelligence */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <p className={SECTION_HEADER_CLASS}>Real-Time Tracking & Analysis</p>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-border/60 overflow-hidden bg-card card-shadow hover:card-shadow-lg hover:border-border transition-all duration-300">
              <div className="h-[420px] lg:h-[500px]">
                <LiveMap aiData={aiData} />
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 overflow-hidden bg-card card-shadow hover:card-shadow-lg hover:border-border transition-all duration-300">
              <div className="h-[420px] lg:h-[500px]">
                <DecisionIntelligencePanel setAiData={setAiData} />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Operations & Compliance */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <p className={SECTION_HEADER_CLASS}>Operations & Compliance</p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card card-shadow hover:card-shadow-lg hover:border-border transition-all duration-300 overflow-hidden">
              <TaskExecutionFlow />
            </div>
            <div className="rounded-2xl border border-border/60 bg-card card-shadow hover:card-shadow-lg hover:border-border transition-all duration-300 overflow-hidden">
              <CompliancePanel />
            </div>
          </div>
        </motion.section>

        {/* Audit Trail */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <p className={SECTION_HEADER_CLASS}>Activity Log</p>
          <div className="rounded-2xl border border-border/60 bg-card card-shadow hover:card-shadow-lg hover:border-border transition-all duration-300 overflow-hidden">
            <AuditLog />
          </div>
        </motion.section>
      </div>
    </div>
  )
}
