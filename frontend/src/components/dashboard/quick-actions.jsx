import { motion } from "framer-motion"
import { Plus, RefreshCcw, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const actions = [
    { icon: Plus, label: "New Shipment", variant: "default" },
    { icon: RefreshCcw, label: "Refresh Data", variant: "outline" },
    { icon: Download, label: "Export", variant: "outline" },
    { icon: Filter, label: "Filters", variant: "outline" },
  ]

  return (
    <motion.div
      className="flex flex-wrap items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {actions.map((action, index) => (
        <Button
          key={action.label}
          variant={action.variant}
          size="sm"
          className="gap-2"
        >
          <action.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{action.label}</span>
        </Button>
      ))}
    </motion.div>
  )
}
