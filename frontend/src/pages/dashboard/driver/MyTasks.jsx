import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Clock, Search, ArrowRight, Package, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDriverShipments } from "./hooks/useDriverShipments"
import { StatusBadge } from "@/components/ui/status-badge"
import { useNavigate } from "react-router-dom"

export default function MyTasks() {
  const { shipments, pendingTasks, updateStatus } = useDriverShipments()
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const inProgress = shipments.filter(s => s.status === "IN_TRANSIT" || s.status === "AT_RISK")
  const completed = shipments.filter(s => s.status === "DELIVERED")

  const filterTasks = (list) => {
    if (!search) return list
    return list.filter(t => t.trackingNumber.toLowerCase().includes(search.toLowerCase()) || 
                           (t.originName && t.originName.toLowerCase().includes(search.toLowerCase())) ||
                           (t.destinationName && t.destinationName.toLowerCase().includes(search.toLowerCase())))
  }

  const TaskCard = ({ task, isPending }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="p-5 rounded-2xl border border-border/50 bg-card hover:bg-secondary/10 transition-colors card-shadow flex flex-col sm:flex-row gap-5"
    >
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{task.trackingNumber}</span>
            <StatusBadge status={task.status} />
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/> Assigned recently</span>
        </div>

        {/* Stepper Body */}
        <div className="relative pl-6 space-y-5 my-4">
          <div className="absolute top-1 left-[7px] bottom-1 w-[2px] bg-border/80 border-dashed border-l-2" />
          
          <div className="relative flex flex-col">
            <div className="absolute -left-6 top-0 h-4 w-4 rounded-full border-2 border-primary bg-background" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Pickup</span>
            <span className="text-sm font-medium">{task.originName || "Origin Address"}</span>
          </div>

          <div className="relative flex flex-col">
            <div className="absolute -left-6 top-0 h-4 w-4 rounded-full border-2 border-success bg-background" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Dropoff</span>
            <span className="text-sm font-medium">{task.destinationName || "Destination Address"}</span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col justify-end gap-3 sm:w-40 shrink-0 border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-5">
        <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => navigate(`/dashboard/shipment/${task.id}`)}>
          Review Data
        </Button>
        {isPending ? (
          <Button className="flex-1 sm:flex-none gap-2 shadow-md shadow-primary/20" onClick={() => updateStatus(task.id, 'IN_TRANSIT')}>
            Start Journey <Navigation className="h-3.5 w-3.5" />
          </Button>
        ) : task.status === 'DELIVERED' ? (
          <Button variant="secondary" className="flex-1 sm:flex-none pointer-events-none opacity-80" disabled>
            Completed
          </Button>
        ) : (
          <Button className="flex-1 sm:flex-none gap-2 bg-success text-white hover:bg-success/90 shadow-md shadow-success/20" onClick={() => navigate(`/dashboard/shipment/${task.id}`)}>
            View Active Map <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="flex flex-col min-h-full max-w-4xl mx-auto w-full">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 pt-6 pb-4 px-5 lg:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Actionable shipments requiring your attention</p>
          </div>
          
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search ID, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-secondary/30"
            />
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-0 py-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="pending">Pending ({filterTasks(pendingTasks).length})</TabsTrigger>
            <TabsTrigger value="progress">In Progress ({filterTasks(inProgress).length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filterTasks(completed).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <AnimatePresence>
              {filterTasks(pendingTasks).length === 0 ? (
                <div className="py-20 text-center border border-dashed rounded-xl border-border/60">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground font-medium">No pending tasks found</p>
                </div>
              ) : (
                filterTasks(pendingTasks).map(task => <TaskCard key={task.id} task={task} isPending={true} />)
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <AnimatePresence>
              {filterTasks(inProgress).length === 0 ? (
                <div className="py-20 text-center border border-dashed rounded-xl border-border/60">
                  <Navigation className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground font-medium">No shipments currently in transit</p>
                </div>
              ) : (
                filterTasks(inProgress).map(task => <TaskCard key={task.id} task={task} isPending={false} />)
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
             <AnimatePresence>
              {filterTasks(completed).length === 0 ? (
                <div className="py-20 text-center border border-dashed rounded-xl border-border/60">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground font-medium">No delivered shipments today</p>
                </div>
              ) : (
                filterTasks(completed).map(task => <TaskCard key={task.id} task={task} isPending={false} />)
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
