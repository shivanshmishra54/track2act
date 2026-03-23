import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Activity, Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#intelligence", label: "Intelligence" },
    { href: "#compliance", label: "Compliance" },
  ]

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Activity className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">
            Track<span className="text-primary">2</span>Act
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeSwitcher />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col gap-4 p-4">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <ThemeSwitcher />
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
