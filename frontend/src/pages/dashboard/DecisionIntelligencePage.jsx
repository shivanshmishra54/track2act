import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
  Target,
  Scale,
  ArrowRight,
  Filter,
  RefreshCw,
  History,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const decisions = [
  {
    id: "DEC-001",
    title: "Route Deviation for SHP-003",
    context: "Heavy rainfall detected on NH-44 between Hyderabad and Bangalore. Current route shows 85% chance of 4+ hour delay. Cargo: Pharmaceuticals (temperature-sensitive).",
    shipmentId: "SHP-003",
    urgency: "high",
    status: "pending",
    timestamp: "2 minutes ago",
    aiAnalysis: "Based on real-time weather data and historical patterns, I recommend Route A (via Anantapur) as it avoids the affected zone while maintaining cold chain integrity. The alternate route adds 45km but has clear weather forecasts for the next 8 hours.",
    options: [
      {
        id: "opt-1",
        title: "Route A: Via Anantapur",
        description: "Bypass affected area through Anantapur district",
        impact: { cost: "+₹12,000", delay: "+45min", risk: "Low" },
        pros: ["Avoids weather zone", "Well-maintained highway", "Multiple fuel stops"],
        cons: ["45km longer", "Additional toll charges"],
        confidence: 92,
        recommended: true,
      },
      {
        id: "opt-2",
        title: "Route B: Wait & Proceed",
        description: "Wait 2-3 hours for weather to clear, then continue original route",
        impact: { cost: "+₹5,000", delay: "+3h", risk: "Medium" },
        pros: ["Shorter distance", "Familiar route for driver"],
        cons: ["Uncertain weather clearance", "Potential cold chain risk", "Client deadline at risk"],
        confidence: 65,
      },
      {
        id: "opt-3",
        title: "Route C: Air Freight Last Mile",
        description: "Transfer cargo to air freight from nearest airport",
        impact: { cost: "+₹85,000", delay: "-2h", risk: "Low" },
        pros: ["Fastest delivery", "Guaranteed cold chain", "Weather independent"],
        cons: ["High cost", "Transfer logistics complexity"],
        confidence: 88,
      },
    ],
    guardrails: [
      { rule: "Budget variance < 15%", status: "pass" },
      { rule: "Cold chain maintenance", status: "warn" },
      { rule: "Delivery deadline compliance", status: "pass" },
    ],
  },
  {
    id: "DEC-002",
    title: "Carrier Switch for SHP-007",
    context: "Current carrier reporting mechanical issues. Alternative carriers available with varying capacity and rates.",
    shipmentId: "SHP-007",
    urgency: "medium",
    status: "pending",
    timestamp: "15 minutes ago",
    aiAnalysis: "Carrier Alpha Transport has the best combination of immediate availability, competitive pricing, and reliability score (4.8/5). They have successfully handled similar cargo 47 times in the past 6 months.",
    options: [
      {
        id: "opt-1",
        title: "Alpha Transport",
        description: "Premium carrier with immediate availability",
        impact: { cost: "+₹8,000", delay: "+1h", risk: "Low" },
        pros: ["High reliability score", "GPS tracking", "Insurance included"],
        cons: ["Slight premium", "1 hour pickup delay"],
        confidence: 89,
        recommended: true,
      },
      {
        id: "opt-2",
        title: "Beta Logistics",
        description: "Budget option with next-day pickup",
        impact: { cost: "-₹3,000", delay: "+12h", risk: "Medium" },
        pros: ["Cost savings", "Good capacity"],
        cons: ["Next day pickup only", "Lower reliability score"],
        confidence: 72,
      },
    ],
    guardrails: [
      { rule: "Carrier reliability > 4.0", status: "pass" },
      { rule: "Insurance coverage adequate", status: "pass" },
    ],
  },
  {
    id: "DEC-003",
    title: "Inventory Reallocation",
    context: "Demand surge detected in Pune region. Current stock levels insufficient to meet projected orders.",
    shipmentId: "INV-045",
    urgency: "low",
    status: "auto-executed",
    timestamp: "1 hour ago",
    aiAnalysis: "Auto-executed based on pre-approved rules. Transferred 500 units from Mumbai warehouse to Pune hub. Action within delegated authority limits.",
    options: [
      {
        id: "opt-1",
        title: "Transfer from Mumbai",
        description: "Reallocate 500 units from Mumbai warehouse",
        impact: { cost: "+₹15,000", delay: "N/A", risk: "Low" },
        pros: ["Closest warehouse", "Same-day transfer possible"],
        cons: ["Reduces Mumbai buffer stock"],
        confidence: 95,
        recommended: true,
      },
    ],
    guardrails: [
      { rule: "Buffer stock maintained > 20%", status: "pass" },
      { rule: "Transfer quantity < auto-approval limit", status: "pass" },
    ],
  },
]

const pastDecisions = [
  { id: "DEC-098", title: "Emergency reroute via Nashik", status: "approved", outcome: "success", savings: "₹45,000" },
  { id: "DEC-097", title: "Carrier switch to FastTrack", status: "approved", outcome: "success", savings: "₹12,000" },
  { id: "DEC-096", title: "Delay acceptance for weather", status: "rejected", outcome: "N/A", savings: "N/A" },
  { id: "DEC-095", title: "Priority upgrade for pharma", status: "approved", outcome: "success", savings: "₹78,000" },
]

export default function DecisionIntelligencePage() {
  const [selectedDecision, setSelectedDecision] = useState(decisions[0])
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredDecisions = decisions.filter(d => {
    if (filter === "all") return true
    return d.status === filter
  })

  const handleApprove = (optionId) => {
    setSelectedOption(optionId)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Decision Intelligence
          </h1>
          <p className="text-muted-foreground">AI-powered recommendations for supply chain decisions</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Decisions</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="auto-executed">Auto-Executed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            History
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
                <p className="text-sm text-muted-foreground">Pending Decisions</p>
                <p className="text-2xl font-bold">{decisions.filter(d => d.status === "pending").length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Executed Today</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings (MTD)</p>
                <p className="text-2xl font-bold">₹4.2L</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Decision List */}
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Decisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredDecisions.map((decision) => (
                <motion.div
                  key={decision.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setSelectedDecision(decision)
                    setSelectedOption(null)
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDecision?.id === decision.id 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={decision.urgency === "high" ? "destructive" : decision.urgency === "medium" ? "secondary" : "outline"}
                        className={decision.urgency === "high" ? "" : decision.urgency === "medium" ? "bg-warning text-warning-foreground" : ""}
                      >
                        {decision.urgency}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{decision.id}</span>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        decision.status === "pending" ? "border-warning text-warning" :
                        decision.status === "approved" ? "border-success text-success" :
                        decision.status === "auto-executed" ? "border-primary text-primary" : ""
                      }
                    >
                      {decision.status === "auto-executed" ? "auto" : decision.status}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-1">{decision.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{decision.context}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{decision.shipmentId}</span>
                    <span>{decision.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Past Decisions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pastDecisions.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    {d.outcome === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.id}</p>
                    </div>
                  </div>
                  {d.savings !== "N/A" && (
                    <Badge variant="outline" className="text-success border-success">
                      {d.savings} saved
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Decision Details */}
        <div className="col-span-8">
          <AnimatePresence mode="wait">
            {selectedDecision && (
              <motion.div
                key={selectedDecision.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Context Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {selectedDecision.title}
                          <Badge 
                            variant={selectedDecision.urgency === "high" ? "destructive" : "secondary"}
                            className={selectedDecision.urgency === "medium" ? "bg-warning text-warning-foreground" : ""}
                          >
                            {selectedDecision.urgency} priority
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">{selectedDecision.shipmentId} - {selectedDecision.timestamp}</CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          selectedDecision.status === "pending" ? "border-warning text-warning" :
                          selectedDecision.status === "approved" ? "border-success text-success" :
                          selectedDecision.status === "auto-executed" ? "border-primary text-primary" : ""
                        }
                      >
                        {selectedDecision.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        Situation Context
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedDecision.context}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        AI Analysis
                      </h4>
                      <p className="text-sm">{selectedDecision.aiAnalysis}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Scale className="w-5 h-5" />
                      Recommended Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedDecision.options.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.005 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedOption === option.id 
                            ? "border-primary bg-primary/5" 
                            : option.recommended 
                              ? "border-success/50 bg-success/5" 
                              : "border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{option.title}</h4>
                            {option.recommended && (
                              <Badge className="bg-success text-success-foreground">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Confidence</span>
                            <Badge variant="outline">{option.confidence}%</Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                        
                        {/* Impact Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-background rounded-lg p-3 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Cost Impact</p>
                            <p className={`font-semibold ${option.impact.cost.startsWith("+") ? "text-destructive" : "text-success"}`}>
                              {option.impact.cost}
                            </p>
                          </div>
                          <div className="bg-background rounded-lg p-3 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Time Impact</p>
                            <p className={`font-semibold ${option.impact.delay.startsWith("+") ? "text-warning" : option.impact.delay.startsWith("-") ? "text-success" : ""}`}>
                              {option.impact.delay}
                            </p>
                          </div>
                          <div className="bg-background rounded-lg p-3 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                            <p className={`font-semibold ${option.impact.risk === "Low" ? "text-success" : option.impact.risk === "Medium" ? "text-warning" : "text-destructive"}`}>
                              {option.impact.risk}
                            </p>
                          </div>
                        </div>

                        {/* Pros & Cons */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-medium text-success mb-2">Advantages</p>
                            <ul className="space-y-1">
                              {option.pros.map((pro, i) => (
                                <li key={i} className="text-xs flex items-center gap-2">
                                  <CheckCircle2 className="w-3 h-3 text-success" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-destructive mb-2">Considerations</p>
                            <ul className="space-y-1">
                              {option.cons.map((con, i) => (
                                <li key={i} className="text-xs flex items-center gap-2">
                                  <XCircle className="w-3 h-3 text-destructive" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Confidence Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">AI Confidence</span>
                            <span className="font-medium">{option.confidence}%</span>
                          </div>
                          <Progress value={option.confidence} className="h-2" />
                        </div>

                        {selectedDecision.status === "pending" && (
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              variant={selectedOption === option.id ? "default" : "outline"}
                              onClick={() => handleApprove(option.id)}
                            >
                              {selectedOption === option.id ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Selected
                                </>
                              ) : (
                                <>
                                  Select Option
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Guardrails Check */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Guardrails Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedDecision.guardrails.map((guardrail, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            {guardrail.status === "pass" && <CheckCircle2 className="w-5 h-5 text-success" />}
                            {guardrail.status === "warn" && <AlertTriangle className="w-5 h-5 text-warning" />}
                            {guardrail.status === "fail" && <XCircle className="w-5 h-5 text-destructive" />}
                            <span className="text-sm">{guardrail.rule}</span>
                          </div>
                          <Badge 
                            variant="outline"
                            className={
                              guardrail.status === "pass" ? "border-success text-success" :
                              guardrail.status === "warn" ? "border-warning text-warning" : "border-destructive text-destructive"
                            }
                          >
                            {guardrail.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Action & Feedback */}
                {selectedDecision.status === "pending" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Take Action</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Add notes or feedback (optional)</label>
                        <Textarea 
                          placeholder="Enter any additional context or reasoning..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button className="flex-1" disabled={!selectedOption}>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve & Execute
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="ghost">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Request More Info
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
