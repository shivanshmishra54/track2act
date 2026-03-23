import { motion } from "framer-motion"
import { useState } from "react"
import { 
  FileText, 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Clock,
  Filter,
  Search,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const auditEntries = [
  {
    id: "AUD-2024-8847",
    timestamp: "2024-03-21 14:23:25 IST",
    eventType: "action",
    title: "Reroute Initiated - Mumbai to Mundra",
    confidence: 94,
    optionsEvaluated: 3,
    chosenAction: "Reroute via Mundra Port",
    reasoning: "Lowest overall impact with 85% port capacity available and optimal road network conditions.",
    status: "pending",
    details: {
      eventDetected: "Port congestion at Mumbai/JNPT - 48hr estimated delay",
      impactAssessment: "127 shipments affected, ₹4.2Cr at risk, 23 warehouses impacted",
      alternativesConsidered: ["Wait for clearance (+48hr)", "Air freight expedite (+₹8.5L)", "Reroute via Mundra (+₹2.8L, +12hr)"],
      guardrailsChecked: ["Budget limit: PASS", "Delivery deadline: PASS", "Air freight policy: N/A", "Multi-vendor approval: NOT REQUIRED"],
    },
  },
  {
    id: "AUD-2024-8846",
    timestamp: "2024-03-21 14:23:18 IST",
    eventType: "decision",
    title: "Decision Made - Optimal Route Selected",
    confidence: 94,
    optionsEvaluated: 3,
    chosenAction: "Reroute via Mundra Port",
    reasoning: "AI analysis complete. Mundra route offers best cost-delay-risk balance. All compliance guardrails passed.",
    status: "success",
    details: {
      eventDetected: "Multiple routing options analyzed",
      impactAssessment: "Cost: +₹2.8L | Delay: +12hr | Risk: 15%",
      alternativesConsidered: ["Wait: 45% risk, +48hr", "Air: 8% risk, +₹8.5L", "Mundra: 15% risk, +₹2.8L"],
      guardrailsChecked: ["Budget compliance verified", "SLA timeline verified", "Policy rules checked"],
      outcome: "Mundra route approved for execution",
    },
  },
  {
    id: "AUD-2024-8845",
    timestamp: "2024-03-21 14:23:12 IST",
    eventType: "disruption",
    title: "Impact Analysis Complete",
    confidence: 98,
    optionsEvaluated: 0,
    chosenAction: "Impact mapping",
    reasoning: "Full supply chain impact mapped within 5 seconds of detection.",
    status: "success",
    details: {
      eventDetected: "Cascading impact analysis triggered",
      impactAssessment: "Primary: 127 shipments | Secondary: 23 warehouses | Tertiary: 8 distribution centers",
      alternativesConsidered: [],
      guardrailsChecked: ["Real-time data validation: PASS", "Historical pattern matching: 94% correlation"],
      outcome: "Impact assessment completed in 5.2 seconds",
    },
  },
  {
    id: "AUD-2024-8844",
    timestamp: "2024-03-21 14:23:07 IST",
    eventType: "disruption",
    title: "Disruption Detected - Port Congestion",
    confidence: 97,
    optionsEvaluated: 0,
    chosenAction: "Alert triggered",
    reasoning: "IoT sensors and port authority data confirmed container backlog at Mumbai/JNPT.",
    status: "success",
    details: {
      eventDetected: "Port congestion signal received from 3 data sources",
      impactAssessment: "Preliminary: 100+ shipments potentially affected",
      alternativesConsidered: [],
      guardrailsChecked: ["Data source validation: PASS", "Signal confidence: 97%"],
      outcome: "Disruption confirmed, impact analysis initiated",
    },
  },
]

function AuditEntryCard({ entry, index }) {
  const [isExpanded, setIsExpanded] = useState(index === 0)

  const eventIcons = {
    disruption: AlertTriangle,
    decision: Brain,
    action: Zap,
    compliance: CheckCircle,
  }

  const eventColors = {
    disruption: "text-warning bg-warning/10",
    decision: "text-primary bg-primary/10",
    action: "text-accent bg-accent/10",
    compliance: "text-success bg-success/10",
  }

  const statusColors = {
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    pending: "bg-primary/20 text-primary",
  }

  const Icon = eventIcons[entry.eventType]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-lg border border-border/50 bg-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className={`rounded-lg p-2 ${eventColors[entry.eventType]}`}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{entry.id}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[entry.status]}`}>
              {entry.status}
            </span>
          </div>
          <h4 className="font-medium text-sm mt-0.5 truncate">{entry.title}</h4>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs flex-shrink-0">
          <div className="text-center">
            <div className="font-bold text-primary">{entry.confidence}%</div>
            <div className="text-muted-foreground">Confidence</div>
          </div>
          {entry.optionsEvaluated > 0 && (
            <div className="text-center">
              <div className="font-bold">{entry.optionsEvaluated}</div>
              <div className="text-muted-foreground">Options</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:block">
            <Clock className="h-3 w-3 inline mr-1" />
            {entry.timestamp.split(" ")[1]}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border/50 bg-secondary/20"
        >
          <div className="p-4 space-y-4">
            {/* Reasoning */}
            <div>
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Reasoning
              </h5>
              <p className="text-sm">{entry.reasoning}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Event Detected */}
              <div>
                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Event Detected
                </h5>
                <p className="text-sm text-muted-foreground">{entry.details.eventDetected}</p>
              </div>

              {/* Impact Assessment */}
              <div>
                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Impact Assessment
                </h5>
                <p className="text-sm text-muted-foreground">{entry.details.impactAssessment}</p>
              </div>
            </div>

            {/* Alternatives Considered */}
            {entry.details.alternativesConsidered.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Options Evaluated
                </h5>
                <div className="flex flex-wrap gap-2">
                  {entry.details.alternativesConsidered.map((alt, i) => (
                    <span
                      key={i}
                      className={`rounded-md px-2 py-1 text-xs ${
                        alt.includes(entry.chosenAction.split(" ")[0])
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Guardrails Checked */}
            <div>
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Guardrails Verified
              </h5>
              <div className="flex flex-wrap gap-2">
                {entry.details.guardrailsChecked.map((guard, i) => (
                  <span
                    key={i}
                    className={`rounded-md px-2 py-1 text-xs ${
                      guard.includes("PASS") || guard.includes("verified")
                        ? "bg-success/20 text-success"
                        : guard.includes("N/A") || guard.includes("NOT REQUIRED")
                        ? "bg-secondary text-muted-foreground"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {guard}
                  </span>
                ))}
              </div>
            </div>

            {/* Outcome */}
            {entry.details.outcome && (
              <div className="rounded-lg bg-success/10 border border-success/30 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Outcome:</span>
                  <span className="text-sm text-muted-foreground">{entry.details.outcome}</span>
                </div>
              </div>
            )}

            {/* Full Timestamp */}
            <div className="text-xs text-muted-foreground border-t border-border/50 pt-3">
              Full Timestamp: {entry.timestamp}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export function AuditLog() {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Real-Time Audit Log</h3>
            <p className="text-xs text-muted-foreground">Complete decision transparency & traceability</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="h-8 w-48 pl-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 border-b border-border/50">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="text-xs text-muted-foreground">
          Live feed - {auditEntries.length} events in current session
        </span>
      </div>

      {/* Entries */}
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {auditEntries.map((entry, index) => (
          <AuditEntryCard key={entry.id} entry={entry} index={index} />
        ))}
      </div>
    </div>
  )
}
