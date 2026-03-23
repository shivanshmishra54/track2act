import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ScrollText, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap,
  Filter,
  Search,
  Download,
  Calendar,
  ArrowRight,
  Eye,
  Brain,
  Shield,
  Truck,
  RefreshCw,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const auditLog = [
  {
    id: "AUD-001",
    timestamp: "2024-01-15 14:32:18",
    type: "detection",
    title: "Weather Disruption Detected",
    shipmentId: "SHP-003",
    summary: "Heavy rainfall alert on NH-44 affecting route to Bangalore",
    actor: "ai",
    outcome: "warning",
    details: {
      eventDetected: "Severe weather warning from IMD for NH-44 corridor. Precipitation rate: 45mm/hr. Visibility: <100m. Road conditions: Waterlogging reported.",
      confidenceScore: 94,
      reasoning: "Pattern matched with historical disruption data (2847 similar events). Current conditions indicate 85% probability of 4+ hour delay if original route maintained.",
    },
  },
  {
    id: "AUD-002",
    timestamp: "2024-01-15 14:32:45",
    type: "decision",
    title: "Route Alternatives Analyzed",
    shipmentId: "SHP-003",
    summary: "AI evaluated 3 alternative routes and recommended Via Anantapur",
    actor: "ai",
    outcome: "success",
    details: {
      optionsEvaluated: [
        { option: "Via Anantapur (Route A)", score: 92 },
        { option: "Wait & Proceed (Route B)", score: 65, rejected: "High uncertainty in weather clearance" },
        { option: "Air Freight Transfer (Route C)", score: 88, rejected: "Cost exceeds threshold" },
      ],
      guardrailsChecked: [
        { rule: "Budget variance < 15%", status: "pass" },
        { rule: "Cold chain maintenance", status: "warn" },
        { rule: "Delivery deadline", status: "pass" },
      ],
      reasoning: "Route A selected: Avoids weather zone entirely. 45km additional distance offset by clear weather forecast (8hr window). Cold chain risk mitigated by reduced transit time uncertainty.",
    },
  },
  {
    id: "AUD-003",
    timestamp: "2024-01-15 14:35:12",
    type: "execution",
    title: "Route Change Approved",
    shipmentId: "SHP-003",
    summary: "Operations Manager approved route deviation via Anantapur",
    actor: "user",
    actorName: "Priya Sharma",
    outcome: "success",
    details: {
      actionTaken: "Route updated in TMS. Driver notified via app. ETA recalculated. Customer auto-notified of revised timeline.",
      impact: [
        { metric: "Additional Cost", value: "+₹12,000" },
        { metric: "ETA Change", value: "+45 minutes" },
        { metric: "Delay Avoided", value: "4+ hours" },
        { metric: "Net Savings", value: "₹38,000" },
      ],
    },
  },
  {
    id: "AUD-004",
    timestamp: "2024-01-15 13:45:00",
    type: "auto-action",
    title: "Inventory Auto-Reallocation",
    shipmentId: "INV-045",
    summary: "500 units transferred from Mumbai to Pune warehouse",
    actor: "system",
    outcome: "success",
    details: {
      eventDetected: "Demand surge detected in Pune region. Projected stockout in 18 hours.",
      confidenceScore: 95,
      guardrailsChecked: [
        { rule: "Buffer stock > 20%", status: "pass" },
        { rule: "Transfer < auto-limit", status: "pass" },
      ],
      actionTaken: "Auto-executed under delegated authority. Transfer order created and dispatched.",
      impact: [
        { metric: "Units Transferred", value: "500" },
        { metric: "Transfer Cost", value: "₹15,000" },
        { metric: "Stockout Prevented", value: "Yes" },
        { metric: "Revenue Protected", value: "₹4.2L" },
      ],
    },
  },
  {
    id: "AUD-005",
    timestamp: "2024-01-15 12:20:33",
    type: "alert",
    title: "Carrier Performance Alert",
    shipmentId: "SHP-007",
    summary: "Carrier reported mechanical issues; alternatives being evaluated",
    actor: "ai",
    outcome: "pending",
    details: {
      eventDetected: "Carrier 'QuickMove Logistics' reported vehicle breakdown. Repair ETA: 4-6 hours.",
      confidenceScore: 100,
      optionsEvaluated: [
        { option: "Alpha Transport", score: 89 },
        { option: "Beta Logistics", score: 72 },
      ],
      reasoning: "Awaiting manager approval for carrier switch. Alpha Transport recommended based on reliability score (4.8/5) and immediate availability.",
    },
  },
  {
    id: "AUD-006",
    timestamp: "2024-01-15 11:05:00",
    type: "execution",
    title: "Delivery Completed",
    shipmentId: "SHP-001",
    summary: "Shipment delivered 15 minutes ahead of schedule",
    actor: "system",
    outcome: "success",
    details: {
      actionTaken: "POD captured. Invoice generated. Customer notified.",
      impact: [
        { metric: "Delivery Status", value: "On-Time" },
        { metric: "Time Buffer", value: "+15 min" },
        { metric: "Customer Rating", value: "5/5" },
      ],
    },
  },
  {
    id: "AUD-007",
    timestamp: "2024-01-15 10:30:22",
    type: "detection",
    title: "Port Congestion Alert",
    shipmentId: "SHP-012",
    summary: "JNPT Mumbai experiencing unusual congestion levels",
    actor: "ai",
    outcome: "warning",
    details: {
      eventDetected: "Port utilization at 94%. Average dwell time increased by 3.2 hours. 12 vessels queued for berth.",
      confidenceScore: 88,
      reasoning: "Recommending expedited customs clearance for high-priority shipments. Pre-booking recommended for shipments arriving in next 48 hours.",
    },
  },
]

export default function AuditLogPage() {
  const [expandedEntries, setExpandedEntries] = useState([auditLog[0].id])
  const [typeFilter, setTypeFilter] = useState("all")
  const [outcomeFilter, setOutcomeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleEntry = (id) => {
    setExpandedEntries(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const filteredLog = auditLog.filter(entry => {
    if (typeFilter !== "all" && entry.type !== typeFilter) return false
    if (outcomeFilter !== "all" && entry.outcome !== outcomeFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.shipmentId.toLowerCase().includes(query) ||
        entry.summary.toLowerCase().includes(query)
      )
    }
    return true
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case "detection": return <Eye className="w-4 h-4" />
      case "decision": return <Brain className="w-4 h-4" />
      case "execution": return <Truck className="w-4 h-4" />
      case "alert": return <AlertTriangle className="w-4 h-4" />
      case "auto-action": return <Zap className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case "detection": return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      case "decision": return "bg-primary/20 text-primary border-primary/30"
      case "execution": return "bg-success/20 text-success border-success/30"
      case "alert": return "bg-warning/20 text-warning border-warning/30"
      case "auto-action": return "bg-accent/20 text-accent border-accent/30"
      default: return ""
    }
  }

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-success" />
      case "pending": return <Clock className="w-4 h-4 text-warning" />
      case "failed": return <AlertTriangle className="w-4 h-4 text-destructive" />
      case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />
      default: return null
    }
  }

  const stats = {
    total: auditLog.length,
    detections: auditLog.filter(e => e.type === "detection").length,
    decisions: auditLog.filter(e => e.type === "decision").length,
    autoActions: auditLog.filter(e => e.type === "auto-action").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-primary" />
            Audit Log
          </h1>
          <p className="text-muted-foreground">Complete transparency into AI decisions and system actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ScrollText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Detections</p>
                <p className="text-2xl font-bold">{stats.detections}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Decisions</p>
                <p className="text-2xl font-bold">{stats.decisions}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Executed</p>
                <p className="text-2xl font-bold">{stats.autoActions}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, shipment ID, or content..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="detection">Detection</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
                <SelectItem value="execution">Execution</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="auto-action">Auto-Action</SelectItem>
              </SelectContent>
            </Select>
            <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <div className="space-y-4">
        {filteredLog.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Collapsible
              open={expandedEntries.includes(entry.id)}
              onOpenChange={() => toggleEntry(entry.id)}
            >
              <Card className={`transition-all ${expandedEntries.includes(entry.id) ? "ring-1 ring-primary/30" : ""}`}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            entry.type === "detection" ? "bg-chart-2/20" :
                            entry.type === "decision" ? "bg-primary/20" :
                            entry.type === "execution" ? "bg-success/20" :
                            entry.type === "alert" ? "bg-warning/20" :
                            "bg-accent/20"
                          }`}>
                            {getTypeIcon(entry.type)}
                          </div>
                        </div>
                        
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className="text-base">{entry.title}</CardTitle>
                            <Badge variant="outline" className={getTypeBadgeStyle(entry.type)}>
                              {entry.type.replace("-", " ")}
                            </Badge>
                            <Badge variant="outline">{entry.shipmentId}</Badge>
                          </div>
                          <CardDescription className="text-left">{entry.summary}</CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            {getOutcomeIcon(entry.outcome)}
                            <span className={`text-sm font-medium capitalize ${
                              entry.outcome === "success" ? "text-success" :
                              entry.outcome === "pending" ? "text-warning" :
                              entry.outcome === "warning" ? "text-warning" :
                              "text-destructive"
                            }`}>
                              {entry.outcome}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {entry.actor === "ai" ? "AI Agent" : entry.actor === "user" ? entry.actorName : "System"}
                          </Badge>
                          {expandedEntries.includes(entry.id) ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 border-t">
                    <div className="grid grid-cols-2 gap-6 pt-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {entry.details.eventDetected && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              Event Detected
                            </h4>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                              {entry.details.eventDetected}
                            </p>
                          </div>
                        )}

                        {entry.details.confidenceScore !== undefined && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">AI Confidence</h4>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-primary rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${entry.details.confidenceScore}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                              <span className="text-sm font-medium">{entry.details.confidenceScore}%</span>
                            </div>
                          </div>
                        )}

                        {entry.details.optionsEvaluated && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              Options Evaluated
                            </h4>
                            <div className="space-y-2">
                              {entry.details.optionsEvaluated.map((opt, i) => (
                                <div 
                                  key={i}
                                  className={`p-3 rounded-lg border ${
                                    !opt.rejected ? "bg-success/5 border-success/30" : "bg-muted/50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{opt.option}</span>
                                    <Badge variant={!opt.rejected ? "default" : "outline"}>
                                      Score: {opt.score}
                                    </Badge>
                                  </div>
                                  {opt.rejected && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Rejected: {opt.rejected}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {entry.details.guardrailsChecked && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Guardrails Checked
                            </h4>
                            <div className="space-y-2">
                              {entry.details.guardrailsChecked.map((gr, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                                  <span className="text-sm">{gr.rule}</span>
                                  <Badge 
                                    variant="outline"
                                    className={
                                      gr.status === "pass" ? "border-success text-success" :
                                      gr.status === "warn" ? "border-warning text-warning" :
                                      "border-destructive text-destructive"
                                    }
                                  >
                                    {gr.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.details.actionTaken && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              Action Taken
                            </h4>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                              {entry.details.actionTaken}
                            </p>
                          </div>
                        )}

                        {entry.details.impact && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Impact Summary</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {entry.details.impact.map((imp, i) => (
                                <div key={i} className="p-2 rounded bg-muted/50 text-center">
                                  <p className="text-xs text-muted-foreground">{imp.metric}</p>
                                  <p className={`text-sm font-medium ${
                                    imp.value.startsWith("+") && imp.metric.includes("Cost") ? "text-destructive" :
                                    imp.value.startsWith("-") || imp.value.includes("Avoided") || imp.value.includes("Savings") || imp.value.includes("Protected") ? "text-success" : ""
                                  }`}>
                                    {imp.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.details.reasoning && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">AI Reasoning</h4>
                            <p className="text-sm text-muted-foreground bg-primary/5 border border-primary/20 p-3 rounded-lg">
                              {entry.details.reasoning}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Full Details
                      </Button>
                      <Button variant="outline" size="sm">
                        View Related Events
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">
          Load More Events
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
