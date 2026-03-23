import { useState } from "react"
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
  X
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

const ports = [
  { id: "jnpt", name: "JNPT Mumbai", x: 18, y: 52, type: "port", shipments: 24 },
  { id: "mundra", name: "Mundra Port", x: 15, y: 42, type: "port", shipments: 18 },
  { id: "chennai", name: "Chennai Port", x: 55, y: 75, type: "port", shipments: 15 },
  { id: "kolkata", name: "Kolkata Port", x: 78, y: 42, type: "port", shipments: 12 },
  { id: "vizag", name: "Visakhapatnam", x: 68, y: 58, type: "port", shipments: 8 },
  { id: "cochin", name: "Cochin Port", x: 35, y: 85, type: "port", shipments: 6 },
]

const hubs = [
  { id: "delhi", name: "Delhi NCR Hub", x: 42, y: 28, type: "hub", shipments: 45 },
  { id: "bangalore", name: "Bangalore Hub", x: 45, y: 78, type: "hub", shipments: 32 },
  { id: "hyderabad", name: "Hyderabad Hub", x: 52, y: 62, type: "hub", shipments: 28 },
  { id: "ahmedabad", name: "Ahmedabad Hub", x: 22, y: 40, type: "hub", shipments: 22 },
  { id: "pune", name: "Pune Hub", x: 28, y: 58, type: "hub", shipments: 19 },
]

const shipments = [
  {
    id: "SHP-001",
    from: "jnpt",
    to: "delhi",
    status: "on-time",
    progress: 65,
    cargo: "Electronics",
    value: "₹2.4Cr",
    eta: "2h 15m",
    vehicle: "truck",
    driver: "Rajesh Kumar",
    phone: "+91 98765 43210",
  },
  {
    id: "SHP-002",
    from: "mundra",
    to: "ahmedabad",
    status: "delayed",
    progress: 45,
    cargo: "Auto Parts",
    value: "₹1.8Cr",
    eta: "4h 30m",
    delay: "45min",
    vehicle: "truck",
    driver: "Amit Singh",
    phone: "+91 98765 43211",
  },
  {
    id: "SHP-003",
    from: "chennai",
    to: "bangalore",
    status: "at-risk",
    progress: 30,
    cargo: "Pharmaceuticals",
    value: "₹3.2Cr",
    eta: "5h 45m",
    risk: "Weather Alert",
    vehicle: "truck",
    driver: "Suresh Reddy",
    phone: "+91 98765 43212",
  },
  {
    id: "SHP-004",
    from: "kolkata",
    to: "hyderabad",
    status: "on-time",
    progress: 80,
    cargo: "Textiles",
    value: "₹95L",
    eta: "1h 20m",
    vehicle: "truck",
    driver: "Prakash Das",
    phone: "+91 98765 43213",
  },
  {
    id: "SHP-005",
    from: "vizag",
    to: "hyderabad",
    status: "on-time",
    progress: 55,
    cargo: "Steel",
    value: "₹1.5Cr",
    eta: "3h 00m",
    vehicle: "truck",
    driver: "Venkat Rao",
    phone: "+91 98765 43214",
  },
  {
    id: "SHP-006",
    from: "cochin",
    to: "bangalore",
    status: "delayed",
    progress: 25,
    cargo: "Spices",
    value: "₹45L",
    eta: "6h 15m",
    delay: "1h 30m",
    vehicle: "truck",
    driver: "Joseph Thomas",
    phone: "+91 98765 43215",
  },
]

const disruptions = [
  { id: 1, x: 35, y: 35, type: "weather", label: "Heavy Rain", severity: "medium" },
  { id: 2, x: 60, y: 55, type: "traffic", label: "Road Block", severity: "high" },
  { id: 3, x: 25, y: 65, type: "accident", label: "Accident", severity: "high" },
]

export default function LiveMapPage() {
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDisruptions, setShowDisruptions] = useState(true)
  const [showPorts, setShowPorts] = useState(true)
  const [showHubs, setShowHubs] = useState(true)
  const [zoom, setZoom] = useState(1)

  const getLocation = (id) => {
    const port = ports.find(p => p.id === id)
    if (port) return port
    return hubs.find(h => h.id === id)
  }

  const filteredShipments = shipments.filter(s => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    if (searchQuery && !s.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !s.cargo.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: shipments.length,
    onTime: shipments.filter(s => s.status === "on-time").length,
    delayed: shipments.filter(s => s.status === "delayed").length,
    atRisk: shipments.filter(s => s.status === "at-risk").length,
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Left Sidebar - Shipment List */}
      <Card className="w-80 flex-shrink-0 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Shipments</CardTitle>
            <Badge variant="secondary">{filteredShipments.length}</Badge>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-24 h-9">
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
        <CardContent className="flex-1 overflow-auto space-y-2 pb-4">
          {filteredShipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedShipment(shipment)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedShipment?.id === shipment.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{shipment.id}</span>
                <Badge 
                  variant={
                    shipment.status === "on-time" ? "default" :
                    shipment.status === "delayed" ? "secondary" : "destructive"
                  }
                  className={
                    shipment.status === "on-time" ? "bg-success text-success-foreground" :
                    shipment.status === "delayed" ? "bg-warning text-warning-foreground" : ""
                  }
                >
                  {shipment.status === "on-time" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {shipment.status === "delayed" && <Clock className="w-3 h-3 mr-1" />}
                  {shipment.status === "at-risk" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {shipment.status.replace("-", " ")}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {getLocation(shipment.from)?.name} → {getLocation(shipment.to)?.name}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>{shipment.cargo}</span>
                <span className="font-medium">{shipment.value}</span>
              </div>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${
                    shipment.status === "on-time" ? "bg-success" :
                    shipment.status === "delayed" ? "bg-warning" : "bg-destructive"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${shipment.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Main Map Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg">Live Tracking Map</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {stats.onTime} On Time
              </Badge>
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                {stats.delayed} Delayed
              </Badge>
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                {stats.atRisk} At Risk
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layers className="w-4 h-4 mr-2" />
                  Layers
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Map Layers</SheetTitle>
                  <SheetDescription>Toggle map elements visibility</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={showPorts} onCheckedChange={(c) => setShowPorts(!!c)} />
                    <Ship className="w-4 h-4" />
                    <span>Ports</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={showHubs} onCheckedChange={(c) => setShowHubs(!!c)} />
                    <Truck className="w-4 h-4" />
                    <span>Distribution Hubs</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={showDisruptions} onCheckedChange={(c) => setShowDisruptions(!!c)} />
                    <AlertTriangle className="w-4 h-4" />
                    <span>Disruptions</span>
                  </label>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex border rounded-md">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(z + 0.2, 2))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(1)}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 relative overflow-hidden bg-muted/30 rounded-lg">
          {/* SVG Map */}
          <motion.svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            style={{ scale: zoom }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="delayedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-warning)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--color-warning)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-warning)" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--color-destructive)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* India outline (simplified) */}
            <path
              d="M15,25 Q25,15 45,18 Q65,15 75,25 Q82,35 80,50 Q78,60 70,70 Q60,85 45,90 Q30,85 25,75 Q15,60 12,45 Q10,35 15,25"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-border"
              opacity={0.5}
            />

            {/* Routes */}
            {filteredShipments.map((shipment) => {
              const from = getLocation(shipment.from)
              const to = getLocation(shipment.to)
              if (!from || !to) return null

              const gradientId = shipment.status === "on-time" ? "routeGradient" : 
                                 shipment.status === "delayed" ? "delayedGradient" : "riskGradient"

              const midX = (from.x + to.x) / 2
              const midY = (from.y + to.y) / 2 - 10

              return (
                <g key={shipment.id}>
                  <path
                    d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="0.8"
                    strokeDasharray="2,1"
                    filter="url(#glow)"
                    className="cursor-pointer"
                    onClick={() => setSelectedShipment(shipment)}
                  />
                  {/* Moving dot */}
                  <motion.circle
                    r="1.5"
                    fill={
                      shipment.status === "on-time" ? "var(--color-success)" :
                      shipment.status === "delayed" ? "var(--color-warning)" : "var(--color-destructive)"
                    }
                    filter="url(#glow)"
                    animate={{
                      offsetDistance: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      offsetPath: `path('M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}')`,
                    }}
                  />
                </g>
              )
            })}

            {/* Ports */}
            {showPorts && ports.map((port) => (
              <g key={port.id}>
                <motion.circle
                  cx={port.x}
                  cy={port.y}
                  r="3"
                  fill="var(--color-primary)"
                  opacity={0.2}
                  animate={{ r: [3, 5, 3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle
                  cx={port.x}
                  cy={port.y}
                  r="2"
                  fill="var(--color-primary)"
                  filter="url(#glow)"
                  className="cursor-pointer"
                />
                <text
                  x={port.x}
                  y={port.y - 4}
                  textAnchor="middle"
                  className="text-[2px] fill-foreground font-medium"
                >
                  {port.name}
                </text>
              </g>
            ))}

            {/* Hubs */}
            {showHubs && hubs.map((hub) => (
              <g key={hub.id}>
                <rect
                  x={hub.x - 1.5}
                  y={hub.y - 1.5}
                  width="3"
                  height="3"
                  fill="var(--color-accent)"
                  rx="0.5"
                  filter="url(#glow)"
                  className="cursor-pointer"
                />
                <text
                  x={hub.x}
                  y={hub.y - 4}
                  textAnchor="middle"
                  className="text-[2px] fill-foreground font-medium"
                >
                  {hub.name}
                </text>
              </g>
            ))}

            {/* Disruptions */}
            {showDisruptions && disruptions.map((disruption) => (
              <g key={disruption.id}>
                <motion.circle
                  cx={disruption.x}
                  cy={disruption.y}
                  r="4"
                  fill="var(--color-destructive)"
                  opacity={0.2}
                  animate={{ r: [4, 7, 4], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <circle
                  cx={disruption.x}
                  cy={disruption.y}
                  r="2"
                  fill="var(--color-destructive)"
                  className="cursor-pointer"
                />
                <text
                  x={disruption.x}
                  y={disruption.y + 5}
                  textAnchor="middle"
                  className="text-[1.5px] fill-destructive font-medium"
                >
                  {disruption.label}
                </text>
              </g>
            ))}
          </motion.svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border text-xs space-y-2">
            <div className="font-medium mb-2">Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Ports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-accent" />
              <span>Distribution Hubs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>Disruptions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Sidebar - Shipment Details */}
      <AnimatePresence>
        {selectedShipment && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0"
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedShipment.id}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedShipment(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Badge 
                  className={
                    selectedShipment.status === "on-time" ? "bg-success text-success-foreground" :
                    selectedShipment.status === "delayed" ? "bg-warning text-warning-foreground" : ""
                  }
                  variant={selectedShipment.status === "at-risk" ? "destructive" : "default"}
                >
                  {selectedShipment.status === "on-time" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {selectedShipment.status === "delayed" && <Clock className="w-3 h-3 mr-1" />}
                  {selectedShipment.status === "at-risk" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {selectedShipment.status.replace("-", " ")}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Route */}
                <div>
                  <div className="text-sm font-medium mb-2">Route</div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-0.5 h-8 bg-border" />
                      <div className="w-3 h-3 rounded-full border-2 border-primary" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium text-sm">{getLocation(selectedShipment.from)?.name}</div>
                        <div className="text-xs text-muted-foreground">Origin</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{getLocation(selectedShipment.to)?.name}</div>
                        <div className="text-xs text-muted-foreground">Destination</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progress</span>
                    <span>{selectedShipment.progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        selectedShipment.status === "on-time" ? "bg-success" :
                        selectedShipment.status === "delayed" ? "bg-warning" : "bg-destructive"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedShipment.progress}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Cargo</div>
                    <div className="font-medium">{selectedShipment.cargo}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Value</div>
                    <div className="font-medium">{selectedShipment.value}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ETA</div>
                    <div className="font-medium">{selectedShipment.eta}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Vehicle</div>
                    <div className="font-medium capitalize">{selectedShipment.vehicle}</div>
                  </div>
                </div>

                {/* Delay/Risk Info */}
                {(selectedShipment.delay || selectedShipment.risk) && (
                  <div className={`p-3 rounded-lg ${
                    selectedShipment.status === "delayed" ? "bg-warning/10 border border-warning/30" : "bg-destructive/10 border border-destructive/30"
                  }`}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {selectedShipment.status === "delayed" ? (
                        <>
                          <Clock className="w-4 h-4 text-warning" />
                          <span>Delayed by {selectedShipment.delay}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span>{selectedShipment.risk}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Driver Info */}
                <div>
                  <div className="text-sm font-medium mb-2">Driver</div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {selectedShipment.driver.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{selectedShipment.driver}</div>
                      <div className="text-xs text-muted-foreground">{selectedShipment.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Contact Driver
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
