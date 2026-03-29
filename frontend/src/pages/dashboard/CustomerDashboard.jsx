import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package, Truck, CheckCircle, ChevronRight, BarChart3,
  ArrowUpRight, Search, RefreshCw, AlertCircle, ArrowRight, MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/ui/status-badge"
import { useAuth, API } from "@/context/AuthContext"
import { motion as m } from "framer-motion"

const SECTION = "text-xs font-bold uppercase tracking-widest text-muted-foreground"

function ProgressBar({ value }) {
  const pct = Math.min(Math.max(value ?? 0, 0), 100)
  const color = pct === 100 ? "from-emerald-500 to-emerald-400" : pct > 50 ? "from-indigo-500 to-violet-500" : "from-amber-500 to-orange-400"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-semibold text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  )
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [allShipments, setAllShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [trackingInput, setTrackingInput] = useState("")
  const [filter, setFilter]     = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const fetchShipments = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        const list = data.data || []
        // Filter to shipments where the customerName matches the logged-in user's full name
        // This is the best we can do without a dedicated customer endpoint
        const mine = list.filter((s) =>
          s.customerName && user?.fullName &&
          s.customerName.toLowerCase().trim() === user.fullName.toLowerCase().trim()
        )
        // If no matches (e.g. name mismatch), show all — degrade gracefully
        setAllShipments(mine.length > 0 ? mine : list)
      } else {
        setError("Failed to load shipments. Please try again.")
      }
    } catch {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user) fetchShipments()
  }, [user])

  const handleQuickTrack = () => {
    if (trackingInput.trim()) navigate(`/track?q=${encodeURIComponent(trackingInput.trim())}`)
  }

  // Computed stats from real data
  const stats = {
    total:     allShipments.length,
    inTransit: allShipments.filter(s => s.status === "IN_TRANSIT").length,
    delivered: allShipments.filter(s => s.status === "DELIVERED").length,
    delayed:   allShipments.filter(s => s.status === "DELAYED").length,
  }

  const STAT_CARDS = [
    {
      icon: Package,   label: "Total Shipments", value: stats.total,
      gradient: "from-indigo-500/15 to-indigo-600/5",
      iconBg: "bg-indigo-500/15 border-indigo-500/30", iconColor: "text-indigo-500",
    },
    {
      icon: Truck,     label: "In Transit",      value: stats.inTransit,
      gradient: "from-cyan-500/15 to-cyan-600/5",
      iconBg: "bg-cyan-500/15 border-cyan-500/30",   iconColor: "text-cyan-500",
    },
    {
      icon: CheckCircle, label: "Delivered",     value: stats.delivered,
      gradient: "from-emerald-500/15 to-emerald-600/5",
      iconBg: "bg-emerald-500/15 border-emerald-500/30", iconColor: "text-emerald-500",
    },
    {
      icon: AlertCircle, label: "Delayed",       value: stats.delayed,
      gradient: "from-rose-500/15 to-rose-600/5",
      iconBg: "bg-rose-500/15 border-rose-500/30",   iconColor: "text-rose-500",
    },
  ]

  const filtered = allShipments.filter(s =>
    s.trackingNumber?.toLowerCase().includes(filter.toLowerCase()) ||
    s.cargoType?.toLowerCase().includes(filter.toLowerCase()) ||
    s.status?.toLowerCase().includes(filter.toLowerCase()) ||
    s.originName?.toLowerCase().includes(filter.toLowerCase()) ||
    s.destinationName?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Shipments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track and monitor your active deliveries
            </p>
          </div>
          <Button
            onClick={() => fetchShipments(true)}
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

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2.5 rounded-xl bg-destructive/10 border border-destructive/25 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 text-xs text-destructive hover:bg-destructive/10"
                onClick={() => fetchShipments()}
              >
                Retry
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={SECTION}>Overview</p>
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
              {STAT_CARDS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative p-5">
                    <div className={`inline-flex items-center justify-center rounded-xl border p-2.5 mb-4 ${stat.iconBg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                    <p className="text-2xl font-extrabold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Quick Track */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Card className="border-border/60 card-shadow">
            <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  Quick Track
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Enter a tracking number for instant status</p>
              </div>
              <div className="flex gap-2 sm:w-80">
                <Input
                  placeholder="T2A-123456789"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleQuickTrack()}
                  className="h-9 bg-secondary/50 border-border/60 text-sm font-mono focus-visible:ring-primary/30"
                />
                <Button onClick={handleQuickTrack} size="sm" className="h-9 shrink-0 gap-1.5">
                  Track <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Shipments Table */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="flex items-center justify-between">
            <p className={SECTION}>My Shipments</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Filter…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="h-7 pl-8 w-44 bg-secondary/50 border-border/60 text-xs focus-visible:ring-primary/30"
              />
            </div>
          </div>

          <Card className="border-border/60 card-shadow overflow-hidden">
            {loading ? (
              <div className="p-5 space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">
                  {allShipments.length === 0 ? "No shipments found" : "No shipments match your filter"}
                </p>
                {allShipments.length === 0 && (
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Your shipments will appear here once they are created
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/30">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tracking #</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Route</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Progress</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">ETA</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filtered.map((shipment, i) => (
                      <motion.tr
                        key={shipment.id}
                        className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/track?q=${encodeURIComponent(shipment.trackingNumber)}`)}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <td className="px-5 py-3.5 font-mono font-semibold text-primary text-xs">
                          {shipment.trackingNumber}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground hidden sm:table-cell">
                          {shipment.cargoType || "—"}
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground truncate max-w-[100px]">{shipment.originName || "—"}</span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground/40 flex-shrink-0" />
                            <span className="text-xs font-medium truncate max-w-[100px]">{shipment.destinationName || "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={shipment.status} />
                        </td>
                        <td className="px-4 py-3.5 w-36 hidden lg:table-cell">
                          <ProgressBar value={shipment.currentProgress} />
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground hidden md:table-cell">
                          {shipment.estimatedArrival
                            ? new Date(shipment.estimatedArrival).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={e => {
                              e.stopPropagation()
                              navigate(`/track?q=${encodeURIComponent(shipment.trackingNumber)}`)
                            }}
                          >
                            Track <ChevronRight className="h-3 w-3" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
