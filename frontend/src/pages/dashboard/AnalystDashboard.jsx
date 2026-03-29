import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Skeleton } from "../../components/ui/skeleton"
import { StatusBadge } from "../../components/ui/status-badge"
import { useAuth, API } from "../../context/AuthContext"
import {
  TrendingUp, AlertTriangle, CheckCircle, BarChart3,
  Activity, RefreshCw, Package, Percent, Clock
} from "lucide-react"
import { motion } from "framer-motion"

const SECTION = "text-xs font-bold uppercase tracking-widest text-muted-foreground"

const STATUS_COLORS = {
  PENDING:   "from-amber-500 to-amber-400",
  IN_TRANSIT:"from-indigo-500 to-violet-500",
  DELIVERED: "from-emerald-500 to-emerald-400",
  DELAYED:   "from-rose-500 to-rose-400",
  CANCELLED: "from-muted-foreground to-muted-foreground",
}

export default function AnalystDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    total: 0, onTime: 0, delayed: 0, delivered: 0, avgProgress: 0,
  })

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        const list = data.data || []
        const total     = list.length
        const delayed   = list.filter(s => s.status === "DELAYED").length
        const delivered = list.filter(s => s.status === "DELIVERED").length
        const onTime    = total - delayed
        const avgProgress = total > 0
          ? Math.round(list.reduce((acc, s) => acc + (s.currentProgress || 0), 0) / total)
          : 0
        setShipments(list)
        setStats({ total, onTime, delayed, delivered, avgProgress })
      }
    } catch (e) {
      console.error("Analytics fetch failed:", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchAnalytics() }, [])

  // Compute status distribution
  const distribution = shipments.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {})

  const STAT_CARDS = [
    {
      label: "Total Active", value: stats.total, icon: BarChart3,
      gradient: "from-indigo-500/15 to-indigo-600/5",
      iconBg: "bg-indigo-500/15 border-indigo-500/30", iconColor: "text-indigo-500",
    },
    {
      label: "On-Time",
      value: stats.total > 0 ? `${Math.round((stats.onTime / stats.total) * 100)}%` : "—",
      icon: CheckCircle,
      gradient: "from-emerald-500/15 to-emerald-600/5",
      iconBg: "bg-emerald-500/15 border-emerald-500/30", iconColor: "text-emerald-500",
    },
    {
      label: "Delayed", value: stats.delayed, icon: AlertTriangle,
      gradient: "from-amber-500/15 to-amber-600/5",
      iconBg: "bg-amber-500/15 border-amber-500/30", iconColor: "text-amber-500",
    },
    {
      label: "Avg Progress", value: `${stats.avgProgress}%`, icon: Percent,
      gradient: "from-violet-500/15 to-violet-600/5",
      iconBg: "bg-violet-500/15 border-violet-500/30", iconColor: "text-violet-500",
    },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time insights and performance metrics
            </p>
          </div>
          <Button
            onClick={() => fetchAnalytics(true)}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 space-y-6">

        {/* Stats Cards */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={SECTION}>System Metrics</p>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/50 bg-card p-5">
                  <Skeleton className="h-10 w-10 rounded-xl mb-4" />
                  <Skeleton className="h-7 w-14 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {STAT_CARDS.map((card, i) => (
                <motion.div
                  key={card.label}
                  className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative p-5">
                    <div className={`inline-flex items-center justify-center rounded-xl border p-2.5 mb-4 ${card.iconBg}`}>
                      <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                    </div>
                    <p className="text-2xl font-extrabold">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">{card.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Status Distribution */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={SECTION}>Status Distribution</p>
          <Card className="border-border/60 card-shadow">
            <CardHeader className="border-b border-border/50 bg-secondary/20 pb-4">
              <CardTitle className="text-base">Shipment Status Breakdown</CardTitle>
              <CardDescription>Current distribution across all active shipments</CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              {loading ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 rounded-lg" />)
              ) : Object.keys(distribution).length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No shipment data</p>
                </div>
              ) : (
                Object.entries(distribution).map(([status, count]) => {
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                  const barColor = STATUS_COLORS[status] || "from-muted-foreground to-muted-foreground/70"
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={status} />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {count} &nbsp;·&nbsp; {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary/60 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Recent Shipments */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <p className={SECTION}>Recent Activity</p>
          <Card className="border-border/60 card-shadow overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-secondary/20 pb-4">
              <CardTitle className="text-base">Latest Shipments</CardTitle>
              <CardDescription>Most recent 10 shipments in the system</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="p-5 space-y-3">
                  {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
                </div>
              ) : shipments.length === 0 ? (
                <div className="py-12 text-center">
                  <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">No recent shipments</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {shipments.slice(0, 10).map((shipment, idx) => (
                    <motion.div
                      key={shipment.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-xs">
                        {shipment.trackingNumber?.charAt(0) || "S"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold font-mono truncate">{shipment.trackingNumber}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {shipment.originName || "—"} → {shipment.destinationName || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge status={shipment.status} />
                        <span className="text-xs font-bold text-primary w-10 text-right">
                          {shipment.currentProgress ?? 0}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
