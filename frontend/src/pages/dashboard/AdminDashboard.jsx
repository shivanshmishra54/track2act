import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "../../components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { useAuth, API } from "../../context/AuthContext"
import { shipmentService } from "../../services/shipmentService.js"
import { 
  Users, Truck, Building2, Shield, TrendingUp, CheckCircle2, 
  AlertCircle, Search, Lock, RefreshCw, Package, UserCheck, 
  UserX, ChevronDown, Filter
} from "lucide-react"
import { StatsCards } from "../../components/dashboard/stats-cards.jsx"

const ROLES = ["ADMIN", "DRIVER", "COMPANY_OFFICER", "PORT_MANAGER", "ANALYST", "CUSTOMER"]

const ROLE_CONFIG = {
  ADMIN: { bg: "bg-red-500/12 text-red-600 dark:text-red-400 border-red-500/25", dot: "bg-red-500" },
  DRIVER: { bg: "bg-blue-500/12 text-blue-600 dark:text-blue-400 border-blue-500/25", dot: "bg-blue-500" },
  COMPANY_OFFICER: { bg: "bg-violet-500/12 text-violet-600 dark:text-violet-400 border-violet-500/25", dot: "bg-violet-500" },
  PORT_MANAGER: { bg: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25", dot: "bg-emerald-500" },
  ANALYST: { bg: "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25", dot: "bg-amber-500" },
  CUSTOMER: { bg: "bg-cyan-500/12 text-cyan-600 dark:text-cyan-400 border-cyan-500/25", dot: "bg-cyan-500" },
}

function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || { bg: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {role.replace('_', ' ')}
    </span>
  )
}

function UserInitialAvatar({ name }) {
  const initials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "??"
  const hue = name ? (name.charCodeAt(0) * 37) % 360 : 200
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
      style={{ background: `hsl(${hue}, 55%, 48%)` }}
    >
      {initials}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [shipmentStats, setShipmentStats] = useState({ totalShipments: 0, activeShipments: 0, deliveredShipments: 0, delayedShipments: 0 })
  const [statsLoading, setStatsLoading] = useState(true)
  const [assigningRole, setAssigningRole] = useState(null)
  const [newRole, setNewRole] = useState("")
  const [filter, setFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")

  useEffect(() => { fetchAllUsers() }, [])
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true)
      try {
        const data = await shipmentService.getDashboardStats()
        setShipmentStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/users`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (res.ok) setUsers(data.data || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRole = async (userId) => {
    if (!newRole) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/users/${userId}/assign-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? data.data : u))
        setAssigningRole(null)
        setNewRole("")
      }
    } catch (error) {
      console.error("Failed to assign role:", error)
    }
  }

  const handleToggleUser = async (userId, isActive) => {
    try {
      const token = localStorage.getItem("token")
      const endpoint = isActive ? "deactivate" : "activate"
      const res = await fetch(`${API}/api/users/${userId}/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isActive: !isActive } : u))
      }
    } catch (error) {
      console.error("Failed to toggle user:", error)
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase())
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const userStats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/25" },
    { label: "Drivers", value: users.filter(u => u.role === "DRIVER").length, icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/25" },
    { label: "Officers", value: users.filter(u => u.role === "COMPANY_OFFICER").length, icon: Building2, color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/25" },
    { label: "Active", value: users.filter(u => u.isActive).length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/25" },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage users, roles, and platform activity</p>
          </div>
          <Button onClick={fetchAllUsers} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 space-y-6">

        {/* Shipment Stats */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Shipment Metrics</h2>
          <StatsCards stats={shipmentStats} isLoading={statsLoading} />
        </motion.section>

        {/* User Quick Stats */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">User Overview</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {userStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-xl border border-border/60 bg-card p-4 card-shadow hover:card-shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className={`inline-flex items-center justify-center rounded-lg border p-2 mb-3 ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* User Management Table */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">User Management</h2>

          <Card className="border-border/60 card-shadow overflow-hidden">
            {/* Card Header */}
            <div className="flex flex-col gap-3 p-5 border-b border-border/50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">Platform Users</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{filteredUsers.length} of {users.length} users shown</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Role filter */}
                <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-secondary/50 p-1">
                  {["ALL", ...ROLES.slice(0, 4)].map(r => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                        roleFilter === r 
                          ? "bg-background shadow-sm text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r === "ALL" ? "All" : r === "COMPANY_OFFICER" ? "Officer" : r.charAt(0) + r.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-border/40 bg-secondary/20">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search by name or email…"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-9 h-8 bg-background/80 border-border/50 text-sm"
                />
              </div>
            </div>

            {/* Users List */}
            <div>
              {loading ? (
                <div className="p-5 space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">No users found</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {filteredUsers.map((u, idx) => (
                    <motion.div
                      key={u.id}
                      className="flex flex-col gap-3 p-4 hover:bg-secondary/30 transition-colors sm:flex-row sm:items-center"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      {/* User info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative">
                          <UserInitialAvatar name={u.fullName} />
                          <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${u.isActive ? "bg-success" : "bg-muted-foreground/40"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{u.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>

                      {/* Role + Status */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RoleBadge role={u.role} />
                        {!u.isActive && (
                          <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {assigningRole === u.id ? (
                          <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="h-8 rounded-lg border border-border/70 bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                            >
                              <option value="">Select role…</option>
                              {ROLES.map(role => (
                                <option key={role} value={role}>{role.replace('_', ' ')}</option>
                              ))}
                            </select>
                            <Button size="sm" onClick={() => handleAssignRole(u.id)} className="h-8 text-xs">
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => { setAssigningRole(null); setNewRole("") }} className="h-8 text-xs">
                              Cancel
                            </Button>
                          </motion.div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setAssigningRole(u.id); setNewRole(u.role) }}
                              className="h-8 gap-1.5 text-xs"
                            >
                              <Lock className="w-3 h-3" />
                              Role
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleUser(u.id, u.isActive)}
                              className={`h-8 text-xs gap-1.5 ${
                                u.isActive 
                                  ? "text-destructive hover:bg-destructive/10 hover:border-destructive/30" 
                                  : "text-success hover:bg-success/10 hover:border-success/30"
                              }`}
                            >
                              {u.isActive 
                                ? <><UserX className="w-3 h-3" /> Deactivate</> 
                                : <><UserCheck className="w-3 h-3" /> Activate</>
                              }
                            </Button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}