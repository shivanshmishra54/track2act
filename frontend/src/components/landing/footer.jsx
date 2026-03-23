import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              Track<span className="text-primary">2</span>Act
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#intelligence" className="hover:text-foreground transition-colors">
              Intelligence
            </a>
            <a href="#compliance" className="hover:text-foreground transition-colors">
              Compliance
            </a>
            <Link to="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        <motion.div
          className="mt-8 border-t border-border/40 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">
            Developed by{" "}
            <span className="font-medium text-foreground">Sphoorthi Mallipudi</span>
            {" "}&bull;{" "}
            <span className="font-medium text-foreground">Shivansh Mishra</span>
            {" "}&bull;{" "}
            <span className="font-medium text-foreground">Prachi Mehta</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Track2Act. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
