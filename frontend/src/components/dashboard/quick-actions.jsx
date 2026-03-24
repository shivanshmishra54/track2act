import { motion } from "framer-motion"
import { Plus, RefreshCcw, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const handleNewShipment = () => {
    window.location.href = '/dashboard/new-shipment'
  }

  return (
    <motion.div
      className="flex flex-wrap items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Button variant="default" size="sm" className="gap-2" onClick={handleNewShipment}>
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">New Shipment</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <RefreshCcw className="h-4 w-4" />
        <span className="hidden sm:inline">Refresh</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filters</span>
      </Button>
    </motion.div>
  )
}
