import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus,
  Settings,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  Copy,
  Clock,
  TrendingUp,
  AlertCircle,
  FileText,
  Scale,
  Zap
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const rules = [
  {
    id: "GR-001",
    name: "Budget Variance Limit",
    description: "Prevent decisions that exceed 15% budget variance without approval",
    category: "budget",
    condition: "cost_variance > 15%",
    action: "Block & escalate to manager",
    enabled: true,
    priority: "critical",
    triggerCount: 23,
    lastTriggered: "2 hours ago",
    autoExecute: false,
  },
  {
    id: "GR-002",
    name: "Delivery Deadline Protection",
    description: "Flag any route changes that risk missing committed delivery times",
    category: "timing",
    condition: "new_eta > committed_delivery",
    action: "Alert & require justification",
    enabled: true,
    priority: "high",
    triggerCount: 45,
    lastTriggered: "30 minutes ago",
    autoExecute: false,
  },
  {
    id: "GR-003",
    name: "Air Freight Cost Cap",
    description: "Automatic approval for air freight under ₹50,000; require approval above",
    category: "budget",
    condition: "air_freight_cost > ₹50,000",
    action: "Require manager approval",
    enabled: true,
    priority: "high",
    triggerCount: 12,
    lastTriggered: "1 day ago",
    autoExecute: true,
  },
  {
    id: "GR-004",
    name: "Cold Chain Integrity",
    description: "Block any decision that risks temperature-sensitive cargo",
    category: "safety",
    condition: "temp_risk_score > 0.7",
    action: "Block & alert safety team",
    enabled: true,
    priority: "critical",
    triggerCount: 8,
    lastTriggered: "3 days ago",
    autoExecute: false,
  },
  {
    id: "GR-005",
    name: "Carrier Reliability Threshold",
    description: "Only allow carriers with rating above 4.0",
    category: "compliance",
    condition: "carrier_rating < 4.0",
    action: "Block carrier selection",
    enabled: true,
    priority: "medium",
    triggerCount: 34,
    lastTriggered: "5 hours ago",
    autoExecute: true,
  },
  {
    id: "GR-006",
    name: "Insurance Coverage Check",
    description: "Verify adequate insurance for high-value shipments",
    category: "compliance",
    condition: "shipment_value > ₹10L && !has_adequate_insurance",
    action: "Block & require insurance update",
    enabled: true,
    priority: "high",
    triggerCount: 15,
    lastTriggered: "12 hours ago",
    autoExecute: false,
  },
  {
    id: "GR-007",
    name: "Weekend Delivery Surcharge",
    description: "Auto-approve weekend deliveries under 20% surcharge",
    category: "custom",
    condition: "weekend_surcharge <= 20%",
    action: "Auto-approve",
    enabled: false,
    priority: "low",
    triggerCount: 0,
    lastTriggered: null,
    autoExecute: true,
  },
]

const violations = [
  {
    id: "VIO-001",
    rule: "Budget Variance Limit",
    shipment: "SHP-003",
    details: "Proposed route change exceeds budget by 18%",
    timestamp: "2 hours ago",
    status: "pending",
    severity: "high",
  },
  {
    id: "VIO-002",
    rule: "Delivery Deadline Protection",
    shipment: "SHP-007",
    details: "New ETA would miss committed delivery by 3 hours",
    timestamp: "30 minutes ago",
    status: "resolved",
    resolution: "Route optimized to meet deadline",
    severity: "medium",
  },
  {
    id: "VIO-003",
    rule: "Cold Chain Integrity",
    shipment: "SHP-012",
    details: "Temperature risk detected on proposed route",
    timestamp: "1 hour ago",
    status: "escalated",
    severity: "critical",
  },
]

const edgeCases = [
  {
    id: "EC-001",
    title: "Conflicting Rules: Budget vs Deadline",
    description: "Fastest route exceeds budget, cheapest route misses deadline",
    shipment: "SHP-015",
    rules: ["Budget Variance Limit", "Delivery Deadline Protection"],
    recommendation: "Prioritize deadline for time-sensitive cargo; approve 12% budget variance",
    status: "pending",
  },
  {
    id: "EC-002",
    title: "Partial Delay Scenario",
    description: "50% of shipment can arrive on time, rest delayed by 2 hours",
    shipment: "SHP-018",
    rules: ["Delivery Deadline Protection"],
    recommendation: "Split shipment; deliver critical items first",
    status: "resolved",
  },
]

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [rulesState, setRulesState] = useState(rules)

  const toggleRule = (ruleId) => {
    setRulesState(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
  }

  const filteredRules = rulesState.filter(r => {
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    active: rulesState.filter(r => r.enabled).length,
    total: rulesState.length,
    violations: violations.filter(v => v.status === "pending").length,
    compliance: 94.2,
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "budget": return "₹"
      case "timing": return <Clock className="w-4 h-4" />
      case "safety": return <Shield className="w-4 h-4" />
      case "compliance": return <FileText className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-destructive text-destructive-foreground"
      case "high": return "bg-warning text-warning-foreground"
      case "medium": return "bg-primary text-primary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Compliance & Guardrails
          </h1>
          <p className="text-muted-foreground">Manage rules, policies, and automated compliance checks</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Rule</DialogTitle>
              <DialogDescription>Define a new compliance guardrail for your supply chain</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input placeholder="e.g., Maximum Transit Time" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="timing">Timing</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Textarea placeholder="e.g., transit_time > 48 hours" />
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Block & Escalate</SelectItem>
                    <SelectItem value="alert">Alert Only</SelectItem>
                    <SelectItem value="auto-approve">Auto-Approve if Under Limit</SelectItem>
                    <SelectItem value="require-approval">Require Manager Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Execute</Label>
                  <p className="text-xs text-muted-foreground">Automatically apply action without approval</p>
                </div>
                <Switch />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{stats.active}/{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Violations</p>
                <p className="text-2xl font-bold">{stats.violations}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{stats.compliance}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Executed Today</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="edge-cases">Edge Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search rules..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="timing">Timing</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredRules.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`transition-all ${!rule.enabled ? "opacity-60" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                          rule.category === "budget" ? "bg-chart-3/20 text-chart-3" :
                          rule.category === "timing" ? "bg-warning/20 text-warning" :
                          rule.category === "safety" ? "bg-destructive/20 text-destructive" :
                          rule.category === "compliance" ? "bg-primary/20 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {getCategoryIcon(rule.category)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{rule.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{rule.id}</Badge>
                            <Badge className={`text-xs ${getPriorityColor(rule.priority)}`}>
                              {rule.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={rule.enabled} 
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-20">Condition:</span>
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">{rule.condition}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground w-20">Action:</span>
                        <span className="text-xs">{rule.action}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Triggered: {rule.triggerCount}x</span>
                        {rule.lastTriggered && <span>Last: {rule.lastTriggered}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {rule.autoExecute && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Auto
                          </Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Violations</CardTitle>
              <CardDescription>Rule violations that require attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {violations.map((violation) => (
                <div 
                  key={violation.id}
                  className={`p-4 rounded-lg border ${
                    violation.status === "pending" ? "border-warning bg-warning/5" :
                    violation.status === "escalated" ? "border-destructive bg-destructive/5" :
                    "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {violation.severity === "critical" && <AlertCircle className="w-5 h-5 text-destructive" />}
                      {violation.severity === "high" && <AlertTriangle className="w-5 h-5 text-warning" />}
                      {violation.severity === "medium" && <AlertCircle className="w-5 h-5 text-primary" />}
                      <div>
                        <h4 className="font-medium">{violation.rule}</h4>
                        <p className="text-xs text-muted-foreground">{violation.id} - {violation.shipment}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        violation.status === "pending" ? "secondary" :
                        violation.status === "escalated" ? "destructive" : "outline"
                      }
                      className={violation.status === "pending" ? "bg-warning text-warning-foreground" : ""}
                    >
                      {violation.status}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{violation.details}</p>
                  {violation.resolution && (
                    <div className="flex items-center gap-2 text-sm text-success mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                      {violation.resolution}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{violation.timestamp}</span>
                    {violation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Dismiss</Button>
                        <Button size="sm">Review</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edge-cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Edge Cases & Conflicts
              </CardTitle>
              <CardDescription>Scenarios where multiple rules conflict or special handling is needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {edgeCases.map((ec) => (
                <div key={ec.id} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{ec.title}</h4>
                      <p className="text-xs text-muted-foreground">{ec.id} - {ec.shipment}</p>
                    </div>
                    <Badge variant={ec.status === "pending" ? "secondary" : "outline"}>
                      {ec.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{ec.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ec.rules.map((rule, i) => (
                      <Badge key={i} variant="outline">{rule}</Badge>
                    ))}
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary mb-1">AI Recommendation</p>
                    <p className="text-sm">{ec.recommendation}</p>
                  </div>
                  {ec.status === "pending" && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">Override</Button>
                      <Button size="sm">Accept Recommendation</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
