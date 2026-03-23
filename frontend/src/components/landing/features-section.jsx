import { motion } from "framer-motion"
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  Workflow, 
  FileCheck, 
  Map 
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Decision Intelligence",
    description: "AI-powered recommendations with cost, delay, and risk comparisons. See multiple options and understand why each action is suggested.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Shield,
    title: "Compliance Guardrails",
    description: "Automatic enforcement of budget limits, delivery deadlines, and policy rules like 'Air freight not allowed above ₹5L unless risk > 80%'.",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: AlertTriangle,
    title: "Edge Case Handling",
    description: "Intelligent detection and resolution of complex scenarios: partial delays, conflicting constraints, and cascading disruptions.",
    color: "from-warning/20 to-warning/5",
  },
  {
    icon: Workflow,
    title: "Task Execution Flow",
    description: "Visual lifecycle tracking from Detection → Impact → Decision → Action → Outcome with animated transitions.",
    color: "from-success/20 to-success/5",
  },
  {
    icon: FileCheck,
    title: "Real-Time Audit Log",
    description: "Every decision logged with event details, confidence scores, options evaluated, chosen action, and reasoning.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Map,
    title: "Live Map Intelligence",
    description: "Real-time visualization of disruptions with ripple effects across shipments, warehouses, and inventory nodes.",
    color: "from-accent/20 to-accent/5",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-medium text-primary">Capabilities</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Built for Enterprise Supply Chain Excellence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Every feature designed to prove domain expertise, handle complexity, 
            and ensure complete transparency in logistics operations.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3`}>
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
