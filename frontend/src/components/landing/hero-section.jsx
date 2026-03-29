import { motion } from "framer-motion"
import { ArrowRight, Zap, Shield, BarChart3, TrendingUp, Globe, Activity } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { IndiaMap } from "./india-map"

const STATS = [
  { value: "99.7%", label: "Uptime SLA" },
  { value: "2.3s", label: "Avg Response" },
  { value: "₹45Cr", label: "Savings/Year" },
  { value: "150+", label: "Enterprises" },
]

const FEATURES = [
  { icon: Zap, text: "Real-time Intelligence" },
  { icon: Shield, text: "Compliance Guardrails" },
  { icon: BarChart3, text: "Full Auditability" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-14">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-orb absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-orb-delayed absolute top-1/4 -right-60 w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl" />
        <div className="animate-orb-slow absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/6 blur-3xl" />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-3.5rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:py-0">
          
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm shadow-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Live Command Center — India
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl leading-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Supply Chain{" "}
              <span className="gradient-text">
                Intelligence
              </span>{" "}
              for India
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="max-w-lg text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transform logistics operations with AI-powered decisions,
              real-time disruption detection, and automated compliance guardrails
              built for the Indian ecosystem.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              className="flex flex-wrap gap-2.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-secondary/70 border border-border/60 px-4 py-2 text-sm font-medium shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-default"
                >
                  <feature.icon className="h-3.5 w-3.5 text-primary" />
                  {feature.text}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all duration-300 font-semibold px-7"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-border/80 hover:border-primary/50 hover:bg-primary/5 font-semibold px-7 transition-all duration-300"
                >
                  <Activity className="h-4 w-4" />
                  Live Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-x-8 gap-y-5 pt-3 sm:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {STATS.map((stat, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <span className="text-2xl font-extrabold gradient-text sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Trust strip */}
            <motion.div
              className="flex items-center gap-3 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Shield className="h-3.5 w-3.5 text-success flex-shrink-0" />
              <span>SOC 2 Certified · ISO 27001 · GDPR Compliant · 256-bit Encryption</span>
            </motion.div>
          </div>

          {/* Right Content - Map */}
          <motion.div
            className="relative h-[420px] lg:h-[620px]"
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          >
            {/* Glow ring behind map */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/8 blur-xl scale-105" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-primary/20" />
            <div className="absolute inset-0 rounded-3xl overflow-hidden bg-secondary/20 backdrop-blur-sm">
              <IndiaMap />
            </div>
            {/* Corner glow accents */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/30 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-accent/25 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
