import { motion } from "framer-motion"
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  Workflow, 
  FileCheck, 
  Map,
  ArrowRight
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Decision Intelligence",
    description: "AI-powered recommendations with cost, delay, and risk comparisons. See multiple options and understand why each action is suggested.",
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
    iconBg: "bg-indigo-500/15 border-indigo-500/30",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    tag: "AI-Powered",
  },
  {
    icon: Shield,
    title: "Compliance Guardrails",
    description: "Automatic enforcement of budget limits, delivery deadlines, and policy rules. Air freight rules, SLA thresholds — all enforced automatically.",
    gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    iconColor: "text-cyan-500 dark:text-cyan-400",
    tag: "Automated",
  },
  {
    icon: AlertTriangle,
    title: "Edge Case Handling",
    description: "Intelligent detection and resolution of complex scenarios: partial delays, conflicting constraints, and cascading disruptions across your network.",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    iconColor: "text-amber-500 dark:text-amber-400",
    tag: "Smart Alerts",
  },
  {
    icon: Workflow,
    title: "Task Execution Flow",
    description: "Visual lifecycle tracking from Detection → Impact → Decision → Action → Outcome with real-time animated transitions and status updates.",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    tag: "Real-time",
  },
  {
    icon: FileCheck,
    title: "Real-Time Audit Log",
    description: "Every decision logged with event details, confidence scores, options evaluated, chosen action, and reasoning. Full transparency, always.",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    iconBg: "bg-violet-500/15 border-violet-500/30",
    iconColor: "text-violet-500 dark:text-violet-400",
    tag: "Full Audit",
  },
  {
    icon: Map,
    title: "Live Map Intelligence",
    description: "Real-time visualization of disruptions with ripple effects across shipments, warehouses, and inventory nodes across India.",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    iconBg: "bg-rose-500/15 border-rose-500/30",
    iconColor: "text-rose-500 dark:text-rose-400",
    tag: "Live Tracking",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-mesh opacity-60 pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            Capabilities
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-balance leading-tight">
            Built for Enterprise{" "}
            <span className="gradient-text">Supply Chain</span>{" "}
            Excellence
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Every feature designed to prove domain expertise, handle complexity,
            and ensure complete transparency in logistics operations.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              {/* Card gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative p-7">
                {/* Tag */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`inline-flex items-center justify-center rounded-xl p-3 border ${feature.iconBg}`}>
                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-1">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="mb-2.5 text-base font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Bottom glow line */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
