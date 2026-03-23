import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Activity, ArrowLeft, Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth, API } from "@/context/AuthContext"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [accessCodes, setAccessCodes] = useState([])
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex">
      {/* Left Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[500px] lg:px-20 xl:px-24">
        <motion.div className="mx-auto w-full max-w-sm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />Back to home
          </Link>
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Track<span className="text-primary">2</span>Act</span>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in with your email and company access code.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Access Code */}
            <div className="space-y-2">
              <Label htmlFor="access_code" className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />Company Access Code
              </Label>
              <Select value={formData.access_code} onValueChange={v => setFormData({...formData, access_code: v})}>
                <SelectTrigger id="access_code" className="h-11">
                  <SelectValue placeholder="Select your company…" />
                </SelectTrigger>
                <SelectContent>
                  {accessCodes.map(a => (
                    <SelectItem key={a.code} value={a.code}>
                      <span className="font-mono text-xs mr-2">{a.code}</span>
                      <span className="text-muted-foreground">— {a.company}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} required className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Your password"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  required className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Visual */}
      <div className="relative hidden lg:block lg:flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <motion.div className="absolute inset-0 flex items-center justify-center p-12"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="max-w-lg text-center">
            <div className="mb-6 inline-flex rounded-full bg-primary/10 p-4"><Activity className="h-12 w-12 text-primary" /></div>
            <h2 className="text-3xl font-bold mb-4">Real-Time Supply Chain Intelligence</h2>
            <p className="text-muted-foreground">Monitor shipments across India, detect disruptions instantly, and make AI-powered decisions with full compliance and auditability.</p>
            <div className="mt-8 flex justify-center gap-8">
              <div className="text-center"><div className="text-2xl font-bold text-primary">500+</div><div className="text-sm text-muted-foreground">Active Routes</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-primary">24/7</div><div className="text-sm text-muted-foreground">Monitoring</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-primary">{"<"}2s</div><div className="text-sm text-muted-foreground">Alert Time</div></div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Access restricted to authorised companies only</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
