import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { StatusBadge } from "../../components/ui/status-badge"
import { useAuth, API } from "../../context/AuthContext"
import { MapPin, Navigation, Package, Truck, CheckCircle2, RefreshCw, RadioTower } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"



export default function DriverDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sharingLocation, setSharingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [selectedShipment, setSelectedShipment] = useState(null)

  useEffect(() => {
    if (user) fetchAssignedShipments()
  }, [user])

  const fetchAssignedShipments = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/driver/${user.id}`, {
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

  const startLiveLocation = async () => {
    setSharingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ latitude, longitude })
          if (selectedShipment) {
            try {
              const token = localStorage.getItem("token")
              const res = await fetch(`${API}/api/shipments/location-update`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ shipmentId: selectedShipment.id, latitude, longitude, statusNote: "Driver live location update" }),
              })
              if (res.ok) {
                const data = await res.json()
                setSelectedShipment(data.data)
              }
            } catch (error) {
              console.error("Failed to update location:", error)
            }
          }
        },
        (error) => { console.error("Location error:", error); setSharingLocation(false) },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 27000 }
      )
    } else {
      alert("Geolocation not supported")
      setSharingLocation(false)
    }
  }

  const stopLiveLocation = () => {
    setSharingLocation(false)
    setCurrentLocation(null)
  }

  const STATS = [
    { label: "In Transit", value: shipments.filter(s => s.status === "IN_TRANSIT").length, icon: Truck, iconBg: "bg-indigo-500/15 border-indigo-500/30", iconColor: "text-indigo-500", gradient: "from-indigo-500/12 to-transparent" },
    { label: "Pending Pickup", value: shipments.filter(s => s.status === "PENDING").length, icon: Package, iconBg: "bg-amber-500/15 border-amber-500/30", iconColor: "text-amber-500", gradient: "from-amber-500/12 to-transparent" },
    { label: "Delivered", value: shipments.filter(s => s.status === "DELIVERED").length, icon: CheckCircle2, iconBg: "bg-emerald-500/15 border-emerald-500/30", iconColor: "text-emerald-500", gradient: "from-emerald-500/12 to-transparent" },
    { label: "Live Tracking", value: sharingLocation ? "ON" : "OFF", icon: RadioTower, iconBg: sharingLocation ? "bg-success/15 border-success/30" : "bg-muted border-border/60", iconColor: sharingLocation ? "text-success" : "text-muted-foreground", gradient: sharingLocation ? "from-success/12 to-transparent" : "" },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-5 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Driver Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage assigned shipments and live tracking</p>
          </div>
          <Button onClick={fetchAssignedShipments} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 space-y-6">

        {/* Live Location Alert */}
        <AnimatePresence>
          {currentLocation && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/8 px-4 py-3 text-sm font-semibold text-success"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </div>
              LIVE TRACKING ACTIVE: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
              <Button size="sm" variant="outline" className="ml-auto h-7 text-xs border-success/30 text-success hover:bg-success/10" onClick={stopLiveLocation}>
                Stop
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
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Shipment Metrics</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STATS.map((item, idx) => (
              <motion.div
                key={item.label}
                className={`group relative rounded-2xl border border-border/60 bg-card overflow-hidden card-shadow transition-all duration-200 hover:-translate-y-0.5`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.07 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
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

        {/* Shipments Grid */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assigned Shipments</h2>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 animate-pulse space-y-3">
                  <div className="h-5 w-32 bg-secondary rounded" />
                  <div className="h-4 w-full bg-secondary rounded" />
                  <div className="h-4 w-3/4 bg-secondary rounded" />
                  <div className="h-8 w-full bg-secondary rounded-lg" />
                </div>
              ))}
            </div>
          ) : shipments.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-card py-16 text-center card-shadow">
              <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No shipments assigned</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Check back later for new assignments</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shipments.map((shipment, idx) => {
                const isSelected = selectedShipment?.id === shipment.id
                return (
                  <motion.div
                    key={shipment.id}
                    className={`rounded-2xl border bg-card card-shadow cursor-pointer transition-all duration-200 overflow-hidden ${
                      isSelected ? "ring-2 ring-primary border-primary/50" : "border-border/60 hover:border-border hover:card-shadow-lg"
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => setSelectedShipment(isSelected ? null : shipment)}
                    whileHover={{ y: -2 }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between p-4 pb-3 border-b border-border/40">
                      <div>
                        <p className="font-mono font-bold text-sm text-primary">{shipment.trackingNumber}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{shipment.cargoType}</p>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                            <MapPin className="h-3 w-3 text-primary" />
                          </div>
                          <span className="font-medium truncate">{shipment.originName || "Origin"}</span>
                        </div>
                        <div className="ml-2.5 w-px h-3 bg-border/60" />
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 flex-shrink-0">
                            <MapPin className="h-3 w-3 text-success" />
                          </div>
                          <span className="font-medium truncate">{shipment.destinationName || "Destination"}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="font-bold text-primary">{shipment.currentProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${shipment.currentProgress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Live tracking toggle — only when selected */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Button
                              size="sm"
                              className={`w-full gap-2 ${sharingLocation ? "bg-destructive hover:bg-destructive/90" : "bg-success hover:bg-success/90"} text-white`}
                              onClick={(e) => {
                                e.stopPropagation()
                                sharingLocation ? stopLiveLocation() : startLiveLocation()
                              }}
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              {sharingLocation ? "Stop Live Tracking" : "Start Live Tracking"}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
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