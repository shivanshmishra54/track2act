import { motion } from "framer-motion"
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { IndiaMap } from "./india-map"

export function HeroSection() {
  const stats = [
    { value: "99.7%", label: "Uptime" },
    { value: "2.3s", label: "Avg Response" },
    { value: "₹45Cr", label: "Savings/Year" },
    { value: "150+", label: "Enterprises" },
  ]

  const features = [
    { icon: Zap, text: "Real-time Intelligence" },
    { icon: Shield, text: "Compliance Guardrails" },
    { icon: BarChart3, text: "Full Auditability" },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:py-0">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Live Command Center
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Supply Chain{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Intelligence
              </span>{" "}
              for India
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg text-muted-foreground text-pretty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transform your logistics operations with AI-powered decision making, 
              real-time disruption detection, and automated compliance guardrails 
              designed for the Indian ecosystem.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span>{feature.text}</span>
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
                <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2">
                  View Live Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-2xl font-bold text-primary sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Map */}
          <motion.div
            className="relative h-[400px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-border/50" />
            <IndiaMap />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
