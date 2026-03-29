import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { StatusBadge } from "../../components/ui/status-badge"
import { useAuth, API } from "../../context/AuthContext"
import { Plus, Edit2, Trash2, Eye, Truck, Package, Building, RefreshCw, ChevronRight, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"



const EMPTY_FORM = {
  cargoType: "", cargoWeight: "", cargoDescription: "",
  originId: "", destinationId: "",
  customerName: "", customerContact: "",
  receiverName: "", receiverContact: "",
  estimatedArrival: "",
}

export default function CompanyOfficerDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (user?.id) fetchShipments()
  }, [user])

  const fetchShipments = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/created-by/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setShipments(data.data || [])
    } catch (error) {
      console.error("Failed to fetch shipments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShipment = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          originId: formData.originId ? { id: formData.originId } : null,
          destinationId: formData.destinationId ? { id: formData.destinationId } : null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setShipments([data.data, ...shipments])
        setShowCreateForm(false)
        setFormData(EMPTY_FORM)
      }
    } catch (error) {
      console.error("Failed to create shipment:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteShipment = async (id) => {
    if (!confirm("Delete this shipment?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setShipments(shipments.filter(s => s.id !== id))
    } catch (error) {
      console.error("Failed to delete shipment:", error)
    }
  }

  const STATS = [
    { label: "Total", value: shipments.length, icon: Truck, iconBg: "bg-indigo-500/15 border-indigo-500/30", iconColor: "text-indigo-500", gradient: "from-indigo-500/12" },
    { label: "In Transit", value: shipments.filter(s => s.status === 'IN_TRANSIT').length, icon: Package, iconBg: "bg-cyan-500/15 border-cyan-500/30", iconColor: "text-cyan-500", gradient: "from-cyan-500/12" },
    { label: "Delivered", value: shipments.filter(s => s.status === 'DELIVERED').length, icon: Building, iconBg: "bg-emerald-500/15 border-emerald-500/30", iconColor: "text-emerald-500", gradient: "from-emerald-500/12" },
    { label: "Avg Progress", value: shipments.length > 0 ? `${Math.round(shipments.reduce((acc, s) => acc + (s.currentProgress || 0), 0) / shipments.length)}%` : "0%", icon: Building, iconBg: "bg-violet-500/15 border-violet-500/30", iconColor: "text-violet-500", gradient: "from-violet-500/12" },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Shipment Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Create, manage, and track shipments for your organisation</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchShipments} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              className="gap-2 shadow-md hover:shadow-primary/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Shipment
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 space-y-6">

        {/* Stats */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Shipment Overview</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map((item, idx) => (
              <motion.div
                key={item.label}
                className={`relative rounded-2xl border border-border/60 bg-card overflow-hidden card-shadow transition-all duration-200 hover:-translate-y-0.5`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} to-transparent opacity-60`} />
                <div className="relative p-4">
                  <div className={`inline-flex items-center justify-center rounded-xl border p-2.5 mb-3 ${item.iconBg}`}>
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Create Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="border-primary/30 bg-primary/3 card-shadow">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15">
                      <Plus className="h-3.5 w-3.5 text-primary" />
                    </div>
                    New Shipment
                  </CardTitle>
                  <CardDescription>Fill in the details to create a new shipment</CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                  <form onSubmit={handleCreateShipment} className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Cargo Type *</Label>
                        <Input placeholder="Electronics, Apparel…" value={formData.cargoType} onChange={e => setFormData({ ...formData, cargoType: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Weight (kg)</Label>
                        <Input placeholder="500" type="number" value={formData.cargoWeight} onChange={e => setFormData({ ...formData, cargoWeight: e.target.value })} className="h-9 bg-background/80 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Description</Label>
                      <Input placeholder="Brief cargo description" value={formData.cargoDescription} onChange={e => setFormData({ ...formData, cargoDescription: e.target.value })} className="h-9 bg-background/80 text-sm" />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Origin Location ID *</Label>
                        <Input placeholder="e.g. LOC001" value={formData.originId} onChange={e => setFormData({ ...formData, originId: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                        <p className="text-[10px] text-muted-foreground">Enter the location ID from the admin panel</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Destination ID *</Label>
                        <Input placeholder="e.g. LOC002" value={formData.destinationId} onChange={e => setFormData({ ...formData, destinationId: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                        <p className="text-[10px] text-muted-foreground">Enter the destination location ID</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Customer Name *</Label>
                        <Input placeholder="Name" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Customer Contact *</Label>
                        <Input placeholder="+91 9876543210" value={formData.customerContact} onChange={e => setFormData({ ...formData, customerContact: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Receiver Name *</Label>
                        <Input placeholder="Name" value={formData.receiverName} onChange={e => setFormData({ ...formData, receiverName: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Receiver Contact *</Label>
                        <Input placeholder="+91 9876543210" value={formData.receiverContact} onChange={e => setFormData({ ...formData, receiverContact: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Estimated Arrival *</Label>
                      <Input type="datetime-local" value={formData.estimatedArrival} onChange={e => setFormData({ ...formData, estimatedArrival: e.target.value })} required className="h-9 bg-background/80 text-sm" />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button type="submit" className="flex-1" disabled={creating}>
                        {creating ? "Creating…" : "Create Shipment"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setShowCreateForm(false); setFormData(EMPTY_FORM) }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Shipments Grid */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Shipments</h2>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 animate-pulse space-y-3">
                  <div className="h-5 w-36 bg-secondary rounded" />
                  <div className="h-4 w-full bg-secondary rounded" />
                  <div className="h-8 w-full bg-secondary rounded-lg mt-4" />
                </div>
              ))}
            </div>
          ) : shipments.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-card py-16 text-center card-shadow">
              <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No shipments yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Create your first shipment to get started</p>
              <Button size="sm" className="mt-4 gap-2" onClick={() => setShowCreateForm(true)}>
                <Plus className="h-3.5 w-3.5" />
                Create Shipment
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shipments.map((shipment, idx) => {
                const isSelected = selectedShipment?.id === shipment.id
                return (
                  <motion.div
                    key={shipment.id}
                    className={`rounded-2xl border bg-card card-shadow overflow-hidden transition-all duration-200 ${
                      isSelected ? "ring-2 ring-primary border-primary/50" : "border-border/60 hover:border-border hover:card-shadow-lg"
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    whileHover={{ y: -2 }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 pb-3 border-b border-border/40">
                      <div>
                        <p className="font-mono font-bold text-sm text-primary">{shipment.trackingNumber}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{shipment.cargoType} {shipment.cargoWeight ? `· ${shipment.cargoWeight}kg` : ""}</p>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground/70 font-medium uppercase tracking-wide text-[10px] mb-0.5">From</p>
                          <p className="font-semibold truncate">{shipment.originName || "—"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground/70 font-medium uppercase tracking-wide text-[10px] mb-0.5">To</p>
                          <p className="font-semibold truncate">{shipment.destinationName || "—"}</p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="font-bold text-primary">{shipment.currentProgress || 0}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${shipment.currentProgress || 0}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs gap-1.5"
                          onClick={() => setSelectedShipment(isSelected ? null : shipment)}
                        >
                          <Eye className="h-3 w-3" />
                          {isSelected ? "Hide" : "Details"}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteShipment(shipment.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}