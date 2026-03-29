import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSupportTickets } from "./hooks/useSupportTickets"
import { useCustomerShipments } from "./hooks/useCustomerShipments"
import { MessageSquare, Plus, CheckCircle, Clock, AlertCircle, Maximize2, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

export default function SupportHub() {
  const { state } = useLocation()
  const { tickets, loading, createTicket, replyToTicket } = useSupportTickets()
  const { shipments } = useCustomerShipments()
  
  const [activeTicket, setActiveTicket] = useState(null)
  const [formingTicket, setFormingTicket] = useState(false)
  const [replyText, setReplyText] = useState("")

  const [newTicket, setNewTicket] = useState({
    issueType: "DELAY",
    shipmentId: state?.autoFillShipmentId || "",
    description: ""
  })

  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeTicket?.messages])

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!newTicket.description.trim()) return
    await createTicket({
        ...newTicket, 
        shipmentId: newTicket.shipmentId || null
    })
    setFormingTicket(false)
    setNewTicket(prev => ({ ...prev, description: "" }))
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !activeTicket) return
    await replyToTicket(activeTicket.id, replyText)
    setReplyText("")
    // Optimistic local update is handled natively by the hook re-fetching fast
  }

  const getStatusIcon = (status) => {
    if (status === 'RESOLVED') return <CheckCircle className="w-4 h-4 text-success" />
    if (status === 'IN_PROGRESS') return <Clock className="w-4 h-4 text-primary" />
    return <AlertCircle className="w-4 h-4 text-amber-500" />
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden w-full relative">
      <AnimatePresence>
        {formingTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="w-full max-w-lg bg-card border border-border/60 rounded-3xl shadow-2xl p-6 relative">
              <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setFormingTicket(false)}><X className="w-5 h-5"/></Button>
              <h2 className="text-2xl font-black mb-2">Create Ticket</h2>
              <p className="text-muted-foreground text-sm mb-6 pb-6 border-b border-border/40">Our technical officers will review and respond momentarily.</p>
              
              <form onSubmit={handleCreateTicket} className="space-y-4">
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Linked Shipment (Optional)</label>
                    <select 
                      className="w-full h-11 bg-secondary/20 border border-border/60 rounded-lg px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      value={newTicket.shipmentId}
                      onChange={e => setNewTicket({...newTicket, shipmentId: e.target.value})}
                    >
                      <option value="">-- Do not link --</option>
                      {shipments.map(s => <option key={s.id} value={s.id}>{s.trackingNumber} - {s.destinationName}</option>)}
                    </select>
                 </div>
                 
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Issue Category</label>
                    <select 
                      className="w-full h-11 bg-secondary/20 border border-border/60 rounded-lg px-3 text-sm focus:border-primary"
                      value={newTicket.issueType}
                      onChange={e => setNewTicket({...newTicket, issueType: e.target.value})}
                    >
                      <option value="DELAY">Unexpected Delay</option>
                      <option value="NOT_DELIVERED">Marked Delivered but Not Received</option>
                      <option value="DAMAGED">Cargo Damaged</option>
                      <option value="WRONG_LOCATION">Delivered to Wrong Address</option>
                      <option value="OTHER">Other Inquiry / Billing</option>
                    </select>
                 </div>

                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Detailed Description</label>
                    <textarea 
                      className="w-full h-32 bg-secondary/20 border border-border/60 rounded-lg p-3 text-sm focus:border-primary resize-none placeholder:text-muted-foreground/60"
                      placeholder="Please explicitly detail the concern here..."
                      value={newTicket.description}
                      onChange={e => setNewTicket({...newTicket, description: e.target.value})}
                      required
                    />
                 </div>

                 <Button type="submit" className="w-full h-12 font-bold mt-2">Submit Support Engine</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Left Sidebar - Ticket List */}
      <div className={`w-full md:w-80 lg:w-[400px] border-r border-border/60 bg-secondary/10 flex flex-col transition-transform ${activeTicket ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 pb-4 border-b border-border/40 flex justify-between items-center bg-card">
          <h2 className="font-bold text-lg tracking-tight">Support Ledger</h2>
          <Button size="icon" variant="outline" onClick={() => setFormingTicket(true)} className="rounded-full bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
            <Plus className="w-5 h-5 flex-shrink-0" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-secondary/30 animate-pulse rounded-xl" />)}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 h-full text-center">
               <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
               <p className="font-bold">No Records</p>
               <p className="text-xs text-muted-foreground max-w-[200px] mx-auto mt-1">Start a thread if assistance is needed.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/20">
              {tickets.map(t => (
                 <button 
                  key={t.id} 
                  onClick={() => setActiveTicket(t)}
                  className={`p-5 text-left transition-all ${activeTicket?.id === t.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-secondary/20 border-l-4 border-l-transparent'}`}
                 >
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-muted-foreground tracking-widest">{t.issueType.replace("_", " ")}</span>
                     {getStatusIcon(t.status)}
                   </div>
                   <p className="text-sm font-medium line-clamp-2 text-foreground/90">{t.description}</p>
                   {t.shipmentId && <p className="text-[10px] text-primary/70 font-mono mt-2 flex items-center gap-1"><Maximize2 className="w-3 h-3"/> T2A Linked</p>}
                 </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Thread Chat UI */}
      <div className={`flex-1 flex flex-col bg-background relative ${!activeTicket ? 'hidden md:flex' : 'flex'}`}>
        {!activeTicket && (
          <div className="h-full w-full flex items-center justify-center text-center">
            <div className="max-w-sm">
               <div className="w-16 h-16 bg-secondary/30 rounded-2xl mx-auto flex items-center justify-center mb-6">
                 <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
               </div>
               <h3 className="text-xl font-bold tracking-tight mb-2">Select a Thread</h3>
               <p className="text-muted-foreground text-sm">Review administration comms securely from the left panel.</p>
            </div>
          </div>
        )}

        {activeTicket && (
          <>
            <div className="h-16 px-6 border-b border-border/40 bg-card/50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                 <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setActiveTicket(null)}>
                   <ArrowLeft className="w-5 h-5" />
                 </Button>
                 <div>
                   <h2 className="font-bold tracking-tight text-sm">Thread: {activeTicket.issueType}</h2>
                   <p className="text-[10px] text-muted-foreground uppercase">{activeTicket.status}</p>
                 </div>
               </div>
               <StatusBadge status={activeTicket.status === 'RESOLVED' ? 'DELIVERED' : 'PENDING'} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTicket.messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.isAdminReply ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${m.isAdminReply ? 'bg-card border border-border/60 rounded-tl-sm' : 'bg-primary text-primary-foreground rounded-br-sm'}`}>
                     <div className="flex items-center justify-between gap-4 mb-2 opacity-80">
                        <span className="text-xs font-bold uppercase tracking-widest">{m.senderName}</span>
                        <span className="text-[10px]">{new Date(m.sentAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                     </div>
                     <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border/40 bg-background shrink-0">
               <form onSubmit={handleReply} className="flex gap-2 max-w-4xl mx-auto relative group">
                  <Input 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={activeTicket.status === 'RESOLVED' ? "Thread marked resolved. Reply to reopen..." : "Type reply..."}
                    className="flex-1 h-14 bg-secondary/30 border-primary/20 pr-16 focus-visible:ring-primary/20 transition-all rounded-full"
                  />
                  <Button type="submit" size="icon" disabled={!replyText.trim()} className="absolute right-2 top-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 transition-all">
                    <Send className="w-4 h-4" />
                  </Button>
               </form>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
