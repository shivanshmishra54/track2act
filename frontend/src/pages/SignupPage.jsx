import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Activity, ArrowLeft, Eye, EyeOff, Loader2, Check, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth, API } from "@/context/AuthContext"

const ROLE_LABELS = {
  "admin":       "Administrator",
  "ops-manager": "Operations Manager",
  "analyst":     "Supply Chain Analyst",
  "viewer":      "Viewer",
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "DRIVER"
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await signup(formData)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    "Real-time shipment tracking across India",
    "AI-powered decision intelligence",
    "Automated compliance guardrails",
    "Full audit trail and transparency",
  ]

  return (
    <div className="relative min-h-screen flex">
      {/* Left Visual */}
      <div className="relative hidden lg:block lg:flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <motion.div className="absolute inset-0 flex items-center justify-center p-12"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="max-w-lg">
            <div className="mb-6 inline-flex rounded-full bg-primary/10 p-4">
              <Activity className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Transform Your Supply Chain Operations</h2>
            <p className="text-muted-foreground mb-8">Join 150+ enterprises using Track2Act to optimise logistics operations across the Indian ecosystem.</p>
            <ul className="space-y-4">
              {features.map((f, i) => (
                <motion.li key={i} className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm">{f}</span>
                </motion.li>
              ))}
            </ul>

            {/* Access codes hint */}
              <div className="mt-10 p-4 rounded-xl border border-muted bg-muted/50">
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-semibold">Role Assignment</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your role will be assigned by administrator after registration. Normal users get standard access.
                </p>
              </div>
          </div>
        </motion.div>
      </div>

      {/* Right Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[540px] lg:px-20 xl:px-24">
        <motion.div className="mx-auto w-full max-w-sm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />Back to home
          </Link>
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Track<span className="text-primary">2</span>Act</span>
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">You need a valid company access code to register.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">




            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="John Doe" value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} required className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" placeholder="you@company.com" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} required className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  required className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 mt-2" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</> : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
