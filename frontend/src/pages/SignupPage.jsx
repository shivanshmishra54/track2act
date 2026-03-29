import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Activity, Eye, EyeOff, Loader2, Shield, Lock, Mail, User, ArrowRight, Zap, BarChart3, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"

const FEATURES = [
  { icon: Zap,       text: "Real-time Shipment Intelligence",  sub: "Track every package across India, live" },
  { icon: Shield,    text: "Automated Compliance Guardrails",  sub: "Stay audit-ready at all times" },
  { icon: BarChart3, text: "AI-Powered Decision Engine",       sub: "Disruption alerts before they happen" },
  { icon: Globe,     text: "Pan-India Logistics Network",      sub: "150+ enterprises and growing" },
]

const STATS = [
  { value: "99.7%", label: "Uptime SLA" },
  { value: "2.3s",  label: "Avg Response" },
  { value: "₹45Cr", label: "Savings/Year" },
  { value: "150+",  label: "Enterprises" },
]

const STRENGTH_CONFIG = [
  { label: "Too short", color: "bg-destructive" },
  { label: "Weak", color: "bg-orange-500" },
  { label: "Fair", color: "bg-warning" },
  { label: "Good", color: "bg-blue-500" },
  { label: "Strong", color: "bg-success" },
]

const passwordStrength = (pwd) => {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState("")
  const [formData, setFormData]         = useState({ name: "", email: "", password: "" })

  const strength = passwordStrength(formData.password)
  const strengthInfo = formData.password ? STRENGTH_CONFIG[strength] : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!formData.name.trim()) { setError("Full name is required"); setIsLoading(false); return }
    if (!formData.email.trim()) { setError("Email is required"); setIsLoading(false); return }
    if (!formData.password || formData.password.length < 6) { setError("Password must be at least 6 characters"); setIsLoading(false); return }

    try {
      await signup({ fullName: formData.name, email: formData.email, password: formData.password, role: "CUSTOMER" })
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen pt-14">

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <motion.div
        className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-12"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Track<span className="text-indigo-400">2</span>Act
          </span>
        </div>

        {/* Main copy */}
        <div className="relative space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
              Supply Chain<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Intelligence
              </span>
              {" "}for India
            </h2>
            <p className="text-base text-slate-400 max-w-md leading-relaxed">
              Join 150+ enterprises transforming their logistics operations with AI-powered decisions and real-time tracking.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <f.icon className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          className="relative grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {STATS.map((s, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center backdrop-blur-sm">
              <p className="text-lg font-extrabold text-white">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL (FORM) ─────────────────────────────── */}
      <motion.div
        className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Mobile logo (shown only when left panel hidden) */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Track<span className="gradient-text">2</span>Act
          </span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">Sign up to get started with Track2Act</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              className="flex items-start gap-2.5 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11 pl-10 bg-secondary/40 border-border/70 focus-visible:ring-primary/30 focus-visible:border-primary/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-11 pl-10 bg-secondary/40 border-border/70 focus-visible:ring-primary/30 focus-visible:border-primary/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11 pl-10 pr-11 bg-secondary/40 border-border/70 focus-visible:ring-primary/30 focus-visible:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password strength bar */}
              {formData.password && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(s => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          s <= strength ? strengthInfo?.color : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{strengthInfo?.label}</p>
                </div>
              )}
            </div>

            {/* Role note */}
            <div className="rounded-xl bg-secondary/60 border border-border/60 p-3.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>Your account will be created with standard access. Admin will assign your role.</span>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 font-semibold gap-2 shadow-md hover:shadow-primary/25 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</>
              ) : (
                <>Create Account<ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  )
}
