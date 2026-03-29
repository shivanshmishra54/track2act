import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { HelpCircle, MessageSquare, AlertTriangle, Package, MapPin, Clock, Send, CheckCircle } from "lucide-react"

export default function Support() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("report")
  const [formData, setFormData] = useState({
    shipmentId: "",
    subject: "",
    category: "general",
    priority: "medium",
    description: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: "delayed", label: "Delayed Delivery", icon: Clock },
    { id: "damaged", label: "Damaged Package", icon: Package },
    { id: "missing", label: "Missing Items", icon: AlertTriangle },
    { id: "address", label: "Address Issue", icon: MapPin },
    { id: "general", label: "General Inquiry", icon: HelpCircle },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => {
        setFormData({ shipmentId: "", subject: "", category: "general", priority: "medium", description: "" })
        setSubmitted(false)
      }, 3500)
    }, 1500)
  }

  const PRIORITY_CONFIG = {
    low:    { label: "Low",    active: "bg-success/15 border-success/40 text-success" },
    medium: { label: "Medium", active: "bg-warning/15 border-warning/40 text-warning-foreground" },
    high:   { label: "High",   active: "bg-destructive/15 border-destructive/40 text-destructive" },
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Support & Reporting</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            We're here to help. Report issues or get answers to common questions.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex gap-2 mb-8 border-b border-border/50"
        >
          {["report", "faq"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-t-lg font-semibold text-sm transition-all -mb-px border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab === "report" ? "Report Issue" : "FAQ"}
            </button>
          ))}
        </motion.div>

        {/* Report Issue Tab */}
        {activeTab === "report" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card className="border-border/60 card-shadow overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-secondary/20 pb-5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15">
                    <Send className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Create a Support Ticket
                </CardTitle>
                <CardDescription>Let us know what's wrong and we'll help fix it</CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Success Banner */}
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-start gap-3 rounded-xl bg-success/10 border border-success/25 px-4 py-4"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-success text-sm">Ticket Created Successfully!</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Our support team will contact you within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shipment ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Shipment Tracking Number{" "}
                      <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. T2A-123456789"
                      value={formData.shipmentId}
                      onChange={(e) => setFormData({ ...formData, shipmentId: e.target.value })}
                      className="h-10 font-mono bg-background/60 border-border/70 focus-visible:ring-primary/30"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Issue Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        const isSelected = formData.category === cat.id
                        return (
                          <motion.button
                            key={cat.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFormData({ ...formData, category: cat.id })}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                            />
                            <span
                              className={`text-xs font-semibold ${
                                isSelected ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {cat.label}
                            </span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Priority Level</label>
                    <div className="flex gap-2.5">
                      {Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: val })}
                          className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                            formData.priority === val
                              ? cfg.active
                              : "border-border/60 bg-card text-muted-foreground hover:border-border"
                          }`}
                        >
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Subject <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="h-10 bg-background/60 border-border/70 focus-visible:ring-primary/30"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Detailed Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Please provide detailed information about your issue..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={5}
                      className="bg-background/60 border-border/70 focus-visible:ring-primary/30 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading || !formData.subject || !formData.description}
                    className="w-full h-11 font-semibold gap-2 shadow-md hover:shadow-primary/25 transition-all"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Support Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="space-y-3"
          >
            {faqItems.map((item, idx) => (
              <FAQCard key={idx} item={item} index={idx} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function FAQCard({ item, index }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden card-shadow hover:card-shadow-lg transition-all">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-5 flex items-start justify-between gap-4 hover:bg-secondary/30 transition-colors text-left"
        >
          <h3 className="text-sm font-semibold text-foreground leading-relaxed">{item.question}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-0.5"
          >
            <HelpCircle className={`w-4 h-4 transition-colors ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
          </motion.div>
        </button>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
            {item.answer}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const faqItems = [
  {
    question: "How do I track my shipment?",
    answer:
      "You can track your shipment using the tracking number provided in your confirmation email. Visit the 'Track Shipment' page and enter your tracking number to see real-time updates.",
  },
  {
    question: "What should I do if my shipment is delayed?",
    answer:
      "If your shipment is delayed, you can report it through the Support page. Select 'Delayed Delivery' as the issue category and provide your tracking number. Our team will investigate and contact you within 24 hours.",
  },
  {
    question: "How can I report a damaged package?",
    answer:
      "If you receive a damaged package, open a support ticket immediately with photos of the damage. Select 'Damaged Package' as the category. Keep the original packaging as proof for insurance claims.",
  },
  {
    question: "What are your delivery timelines?",
    answer:
      "Delivery times vary by location. Standard deliveries are typically 3–5 business days within India. Express options are available for urgent shipments. Check your shipment details for the estimated delivery date.",
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "If your shipment hasn't been dispatched yet, you can request an address change through a support ticket. If it's already in transit, you can provide delivery instructions, but address changes may not be possible.",
  },
  {
    question: "How do I get a refund or return?",
    answer:
      "Please contact our support team with your tracking number and order details. We'll guide you through the return process. Refunds are typically processed within 7–10 business days after the package is received.",
  },
]
