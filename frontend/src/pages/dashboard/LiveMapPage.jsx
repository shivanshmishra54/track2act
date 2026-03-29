import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MapPin, 
  Ship, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Search,
  X,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { shipmentService } from "@/services/shipmentService"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/format.js"

// India geo bounds for SVG mapping (viewBox 0-100)
const INDIA_BOUNDS = {
  minLat: 8,
  maxLat: 37,
  minLng: 68,
  maxLng: 97
}

const latLngToSvg = (lat, lng) => {
  const x = ((lng - INDIA_BOUNDS.minLng) / (INDIA_BOUNDS.maxLng - INDIA_BOUNDS.minLng)) * 100
  const y = ((INDIA_BOUNDS.maxLat - lat) / (INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat)) * 100
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
}

const disruptions = [
  { id: 1, x: 35, y: 35, type: "weather", label: "Heavy Rain", severity: "medium" },
  { id: 2, x: 60, y: 55, type: "traffic", label: "Road Block", severity: "high" },
  { id: 3, x: 25, y: 65, type: "accident", label: "Accident", severity: "high" },
]

export default function LiveMapPage() {
  const [shipments, setShipments] = useState([])
  const [locations, setLocations] = useState([])
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDisruptions, setShowDisruptions] = useState(true)
  const [showPorts, setShowPorts] = useState(true)
  const [showHubs, setShowHubs] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [shipmentsData, locationsData] = await Promise.all([
        shipmentService.getActiveShipments(),
        shipmentService.getLocations()
      ])
      setShipments(shipmentsData || [])
      setLocations(locationsData || [])
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      setError(msg)
      toast({
        title: "Error",
        description: msg,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getLocationByName = (name) => locations.find(l => l.name.toLowerCase() === name.toLowerCase())

  const filteredShipments = shipments.filter(s => {
    const statusStr = s.status?.toLowerCase().replace(/_/g, '-')
    if (statusFilter !== "all" && statusStr !== statusFilter) return false
    if (searchQuery && !s.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !s.cargoType?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: shipments.length,
    onTime: shipments.filter(s => s.status === "ON_TIME").length,
    delayed: shipments.filter(s => s.status === "DELAYED").length,
    atRisk: shipments.filter(s => s.status === "AT_RISK").length,
  }

  const ports = locations.filter(l => l.type === "PORT")
  const hubs = locations.filter(l => l.type === "HUB")

  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive mb-4">Failed to load data: {error}</p>
        <Button onClick={fetchData} >
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8 rounded-lg border">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Loading shipments and locations...</p>
          </div>
        </div>
      )}

      {/* Left Sidebar - Shipment List */}
      <Card className="w-80 flex-shrink-0 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Shipments</CardTitle>
            <Badge variant="secondary">{filteredShipments.length}</Badge>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search ID or cargo" 
                className="pl-10 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="on-time">On Time</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto space-y-2 p-0">
          {filteredShipments.map((shipment) => {
            const statusStr = shipment.status.toLowerCase().replace(/_/g, '-')
            return (
              <motion.div
                key={shipment.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedShipment(shipment)}
                className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-sm truncate">{shipment.id}</span>
                  <Badge variant={statusStr === 'on-time' ? 'default' : statusStr === 'delayed' ? 'secondary' : 'destructive'}>
                    {statusStr === 'on-time' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {statusStr === 'delayed' && <Clock className="w-3 h-3 mr-1" />}
                    {statusStr === 'at-risk' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {statusStr.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {shipment.originName} → {shipment.destinationName}
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span>{shipment.cargoType}</span>
                  <span className="font-mono">{shipment.currentProgress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      statusStr === 'on-time' ? 'bg-emerald-500' :
                      statusStr === 'delayed' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${shipment.currentProgress}%` }}
                  />
                </div>
              </motion.div>
            )
          })}
          {filteredShipments.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No shipments match filter
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Map */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg">Live Tracking Map</CardTitle>
            <div className="flex gap-2 text-sm">
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {stats.onTime} On Time
              </Badge>
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {stats.delayed} Delayed
              </Badge>
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {stats.atRisk} At Risk
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Layers className="w-4 h-4 mr-1" />
                  Layers
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Map Layers</SheetTitle>
                </SheetHeader>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent" onClick={() => setShowPorts(!showPorts)}>
                    <Checkbox id="ports" checked={showPorts} />
                    <label htmlFor="ports" className="cursor-pointer flex items-center gap-2">
                      <Ship className="w-4 h-4" />
                      Ports ({ports.length})
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent" onClick={() => setShowHubs(!showHubs)}>
                    <Checkbox id="hubs" checked={showHubs} />
                    <label htmlFor="hubs" className="cursor-pointer flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Hubs ({hubs.length})
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent" onClick={() => setShowDisruptions(!showDisruptions)}>
                    <Checkbox id="disruptions" checked={showDisruptions} />
                    <label htmlFor="disruptions" className="cursor-pointer flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Disruptions (3)
                    </label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex h-8 border rounded-md overflow-hidden">
              <Button variant="ghost" size="sm" className="h-full px-2" onClick={() => setZoom(z => Math.min(z + 0.1, 2.5))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-full px-2" onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-full px-2" onClick={() => setZoom(1)}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative overflow-hidden">
          <motion.svg 
            viewBox={`0 0 100 100`} 
            className="w-full h-full"
            style={{ transform: `scale(${zoom})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="delayedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* India outline */}
            <path
              d="M10 30 Q25 15 40 20 Q55 15 70 25 Q85 35 88 48 Q90 65 82 78 Q75 88 62 92 Q48 95 35 88 Q22 82 15 72 Q10 60 8 48 Q5 35 10 30"
              fill="#fefce8"
              stroke="#94a3b8"
              strokeWidth="0.4"
              opacity="0.8"
            />

            {/* Shipment routes */}
            {filteredShipments.map((shipment, index) => {
              const originLoc = getLocationByName(shipment.originName)
              const destLoc = getLocationByName(shipment.destinationName)
              if (!originLoc || !destLoc) return null

              const originPos = latLngToSvg(originLoc.latitude, originLoc.longitude)
              const destPos = latLngToSvg(destLoc.latitude, destLoc.longitude)
              const midX = (originPos.x + destPos.x) / 2
              const midY = (originPos.y + destPos.y) / 2 - 8
              const pathD = `M ${originPos.x} ${originPos.y} Q ${midX} ${midY} ${destPos.x} ${destPos.y}`

              const statusStr = shipment.status.toLowerCase().replace(/_/g, '-')
              const gradientId = statusStr === 'on-time' ? 'routeGradient' : statusStr === 'delayed' ? 'delayedGradient' : 'riskGradient'

              // Current position interpolated
              const progress = shipment.currentProgress / 100
              const currentX = originPos.x + (destPos.x - originPos.x) * progress
              const currentY = originPos.y + (destPos.y - originPos.y) * progress - Math.sin(progress * Math.PI) * 6

              return (
                <g key={shipment.id} opacity={0.9}>
                  {/* Route path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeDasharray="3,2"
                    filter="url(#glow)"
                    className="cursor-pointer hover:stroke-width-1.8"
                    onClick={() => setSelectedShipment(shipment)}
                  />
                  {/* Progress stroke */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="2.5"
                    strokeDasharray={`${progress * 200} 200`}
                    filter="url(#glow)"
                  />
                  {/* Current position dot */}
                  <motion.circle
                    cx={currentX}
                    cy={currentY}
                    r="2.2"
                    fill={statusStr === 'on-time' ? '#10b981' : statusStr === 'delayed' ? '#f59e0b' : '#ef4444'}
                    stroke="white"
                    strokeWidth="0.8"
                    filter="url(#glow)"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="cursor-pointer"
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
                  </motion.circle>
                </g>
              )
            })}

            {/* Ports */}
            {showPorts && ports.map((port) => {
              const pos = latLngToSvg(port.latitude, port.longitude)
              return (
                <g key={port.id}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={3.5}
                    fill="#3b82f6"
                    opacity={0.3}
                    animate={{ r: [3.5, 5, 3.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <circle cx={pos.x} cy={pos.y} r="2.2" fill="#3b82f6" filter="url(#glow)" />
                  <text x={pos.x} y={pos.y - 5} textAnchor="middle" fontSize="1.8" fill="#1e293b" fontWeight="bold">
                    {port.name.split(' ')[0]}
                  </text>
                </g>
              )
            })}

            {/* Hubs */}
            {showHubs && hubs.map((hub) => {
              const pos = latLngToSvg(hub.latitude, hub.longitude)
              return (
                <g key={hub.id}>
                  <rect x={pos.x - 1.8} y={pos.y - 1.8} width="3.6" height="3.6" rx="0.8" fill="#10b981" filter="url(#glow)" />
                  <text x={pos.x} y={pos.y + 0.5} textAnchor="middle" fontSize="1.6" fill="white" fontWeight="bold">
                    {hub.name.split(' ')[0][0]}
                  </text>
                </g>
              )
            })}

            {/* Disruptions */}
            {showDisruptions && disruptions.map((disruption) => (
              <g key={disruption.id}>
                <motion.circle
                  cx={disruption.x}
                  cy={disruption.y}
                  r="3.5"
                  fill="#ef4444"
                  opacity={0.25}
                  animate={{ r: [3.5, 5.5, 3.5], opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx={disruption.x} cy={disruption.y} r="2" fill="#ef4444" stroke="white" strokeWidth="0.5" />
                <text x={disruption.x} y={disruption.y + 4} textAnchor="middle" fontSize="1.4" fill="#ef4444" fontWeight="bold">
                  {disruption.label.split(' ')[0]}
                </text>
              </g>
            ))}

            {/* Legend */}
            <g transform="translate(5, 92)">
              <rect width="90" height="6" rx="2" fill="white" opacity="0.9" />
              <text x="2" y="4" fontSize="2.2" fill="#64748b" fontWeight="bold">Map Legend</text>
              <circle cx="8" cy="9" r="1.2" fill="#3b82f6" />
              <text x="12" y="10.5" fontSize="1.8" fill="#475569">Ports</text>
              <rect x="32" y="7.2" width="2.4" height="2.4" rx="0.4" fill="#10b981" />
              <text x="38" y="10.5" fontSize="1.8" fill="#475569">Hubs</text>
              <circle cx="55" cy="9" r="1.2" fill="#ef4444" />
              <text x="59" y="10.5" fontSize="1.8" fill="#475569">Disruptions</text>
            </g>
          </motion.svg>
        </CardContent>
      </Card>

      {/* Right Sidebar - Selected Shipment Details */}
      <AnimatePresence>
        {selectedShipment && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0"
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{selectedShipment.id}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedShipment(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Badge className={`px-3 py-1 text-xs ${
                  selectedShipment.status === "ON_TIME" ? "bg-emerald-500" :
                  selectedShipment.status === "DELAYED" ? "bg-amber-500" : "bg-red-500"
                }`}>
                  {selectedShipment.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Route */}
                <div>
                  <h3 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">Route</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <div className="w-px h-20 bg-gradient-to-b from-muted to-border" />
                      <div className="w-3 h-3 border-2 border-blue-500 rounded-full" />
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div>
                        <div className="font-semibold">{selectedShipment.originName}</div>
                        <div className="text-xs text-muted-foreground">Origin</div>
                      </div>
                      <div className="text-xs text-muted-foreground mx-2">{'→'}</div>
                      <div>
                        <div className="font-semibold">{selectedShipment.destinationName}</div>
                        <div className="text-xs text-muted-foreground">Destination</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progress</span>
                    <span className="font-mono text-lg">{selectedShipment.currentProgress}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        selectedShipment.status === "ON_TIME" ? "bg-emerald-500" :
                        selectedShipment.status === "DELAYED" ? "bg-amber-500" : "bg-red-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedShipment.currentProgress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Cargo</span>
                    <span className="font-medium">{selectedShipment.cargoType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">ETA</span>
                    <span className="font-medium">
                      {formatDateTime(selectedShipment.estimatedArrival)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Current Lat/Lng</span>
                    <span className="font-mono text-xs">
                      {selectedShipment.currentLatitude?.toFixed(4)}, {selectedShipment.currentLongitude?.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Driver */}
                {selectedShipment.driverName && (
                  <div>
                    <h3 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">Driver</h3>
                    <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {selectedShipment.driverName.split(' ').map(n => n[0]).slice(0,2).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{selectedShipment.driverName}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1" disabled={!selectedShipment.driverName}>
                    📞 Contact Driver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    📋 View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}

