import { motion } from "framer-motion"
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  IndianRupee,
  Clock,
  Plane,
  FileText,
  Lock
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

const guardrailRules = [
  {
    id: "gr1",
    name: "Budget Limit",
    description: "Single shipment rerouting cost",
    type: "budget",
    status: "pass",
    value: "₹2.8L",
    limit: "₹5L",
    icon: IndianRupee,
  },
  {
    id: "gr2",
    name: "Delivery Deadline",
    description: "Customer SLA compliance",
    type: "deadline",
    status: "pass",
    value: "26 Mar",
    limit: "28 Mar",
    icon: Clock,
  },
  {
    id: "gr3",
    name: "Air Freight Policy",
    description: "Air freight only if risk > 80%",
    type: "policy",
    status: "warning",
    value: "Risk: 45%",
    limit: "Threshold: 80%",
    icon: Plane,
  },
  {
    id: "gr4",
    name: "Multi-Vendor Approval",
    description: "Required for changes > ₹3L",
    type: "approval",
    status: "pass",
    value: "Not Required",
    limit: "< ₹3L threshold",
    icon: FileText,
  },
]

const edgeCases = [
  {
    id: "ec1",
    title: "Partial Shipment Split",
    description: "127 shipments affected, 43 can be rerouted immediately",
    resolution: "Phased rerouting: Priority items first, bulk follows",
    status: "resolved",
  },
  {
    id: "ec2",
    title: "Conflicting SLAs",
    description: "3 shipments have overlapping delivery windows",
    resolution: "Prioritized by contract value: ₹4.2Cr > ₹1.8Cr > ₹0.9Cr",
    status: "resolved",
  },
  {
    id: "ec3",
    title: "Cascading Weather Impact",
    description: "Secondary disruption detected at Chennai port",
    resolution: "Pre-emptive rerouting activated for 23 shipments",
    status: "monitoring",
  },
]

export function CompliancePanel() {
  const passCount = guardrailRules.filter((r) => r.status === "pass").length
  const totalCount = guardrailRules.length
  const complianceScore = Math.round((passCount / totalCount) * 100)

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-success/10 p-2">
            <Shield className="h-4 w-4 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Guardrails & Compliance</h3>
            <p className="text-xs text-muted-foreground">Automated policy enforcement</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success">{complianceScore}%</div>
          <div className="text-xs text-muted-foreground">Compliant</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Guardrail Rules */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Active Guardrails
          </h4>
          <div className="space-y-2">
            {guardrailRules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg border p-3 ${
                  rule.status === "pass"
                    ? "border-success/30 bg-success/5"
                    : rule.status === "warning"
                    ? "border-warning/30 bg-warning/5"
                    : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-1.5 ${
                    rule.status === "pass"
                      ? "bg-success/20"
                      : rule.status === "warning"
                      ? "bg-warning/20"
                      : "bg-destructive/20"
                  }`}>
                    <rule.icon className={`h-3.5 w-3.5 ${
                      rule.status === "pass"
                        ? "text-success"
                        : rule.status === "warning"
                        ? "text-warning"
                        : "text-destructive"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-sm font-medium">{rule.name}</h5>
                      {rule.status === "pass" ? (
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      ) : rule.status === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="font-medium">{rule.value}</span>
                      <span className="text-muted-foreground">/ {rule.limit}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Edge Cases */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Lock className="h-3 w-3" />
            Edge Case Handling
          </h4>
          <div className="space-y-2">
            {edgeCases.map((edge, index) => (
              <motion.div
                key={edge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="rounded-lg border border-border/50 bg-secondary/30 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-sm font-medium">{edge.title}</h5>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    edge.status === "resolved"
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning"
                  }`}>
                    {edge.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{edge.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span className="text-muted-foreground">{edge.resolution}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
