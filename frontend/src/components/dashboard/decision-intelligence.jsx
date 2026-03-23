import { motion } from "framer-motion"
import { useState } from "react"
import { 
  Brain, 
  Route, 
  Clock, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const currentDisruption = {
  id: "DR-2024-1847",
  title: "Port Congestion at Mumbai/JNPT",
  severity: "high",
  affectedShipments: 127,
  estimatedImpact: "₹4.2Cr",
}

const decisionOptions = [
  {
    id: "opt1",
    action: "Reroute via Mundra Port",
    description: "Divert shipments to alternate port with available capacity",
    cost: "+₹2.8L",
    delay: "+12 hrs",
    risk: 15,
    confidence: 94,
    recommended: true,
    reasoning: "Lowest overall impact. Mundra has 85% capacity available. Road network optimal.",
  },
  {
    id: "opt2",
    action: "Wait for Clearance",
    description: "Hold position and wait for port backlog to clear",
    cost: "₹0",
    delay: "+48 hrs",
    risk: 45,
    confidence: 72,
    recommended: false,
    reasoning: "No additional cost but significant delivery delays. Risk of further congestion.",
  },
  {
    id: "opt3",
    action: "Expedite via Air Freight",
    description: "Transfer critical cargo to air for urgent deliveries",
    cost: "+₹8.5L",
    delay: "-24 hrs",
    risk: 8,
    confidence: 98,
    recommended: false,
    reasoning: "Fastest resolution but exceeds budget threshold. Requires compliance override.",
  },
]

export function DecisionIntelligencePanel() {
  const [selectedOption, setSelectedOption] = useState("opt1")
  const [isExecuting, setIsExecuting] = useState(false)

  const handleExecute = async () => {
    setIsExecuting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsExecuting(false)
  }

  return (
    <div className="h-full rounded-xl border border-border/50 bg-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Decision Intelligence</h3>
            <p className="text-xs text-muted-foreground">AI-powered recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Processing
        </div>
      </div>

      {/* Current Disruption */}
      <div className="border-b border-border/50 p-4 bg-destructive/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">{currentDisruption.id}</span>
              <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-medium text-destructive uppercase">
                {currentDisruption.severity}
              </span>
            </div>
            <h4 className="font-medium text-sm mt-1">{currentDisruption.title}</h4>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{currentDisruption.affectedShipments} shipments</span>
              <span>Impact: {currentDisruption.estimatedImpact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {decisionOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedOption(option.id)}
            className={`relative rounded-lg border p-3 cursor-pointer transition-all ${
              selectedOption === option.id
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-border"
            } ${option.recommended ? "ring-1 ring-primary/30" : ""}`}
          >
            {option.recommended && (
              <div className="absolute -top-2 left-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                Recommended
              </div>
            )}

            <div className="flex items-start justify-between gap-2 mt-1">
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-sm flex items-center gap-2">
                  {option.action}
                  {selectedOption === option.id && (
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  )}
                </h5>
                <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
              </div>
              <div className="text-right text-xs flex-shrink-0">
                <div className="font-medium">{option.confidence}%</div>
                <div className="text-muted-foreground">confidence</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded bg-secondary/50 px-2 py-1.5 text-center">
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{option.cost}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Cost</div>
              </div>
              <div className="rounded bg-secondary/50 px-2 py-1.5 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{option.delay}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Delay</div>
              </div>
              <div className="rounded bg-secondary/50 px-2 py-1.5 text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{option.risk}%</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Risk</div>
              </div>
            </div>

            {selectedOption === option.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 rounded bg-secondary/30 p-2"
              >
                <div className="flex items-start gap-2">
                  <Zap className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{option.reasoning}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="border-t border-border/50 p-4">
        <Button
          className="w-full gap-2"
          disabled={!selectedOption || isExecuting}
          onClick={handleExecute}
        >
          {isExecuting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Executing Decision...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Execute Selected Action
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
