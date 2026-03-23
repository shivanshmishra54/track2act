import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-secondary/50 p-1">
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ]

  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary/50 p-1 backdrop-blur-sm">
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => setTheme(value)}
          className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            theme === value
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Switch to ${label} theme`}
        >
          {theme === value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Icon className="relative z-10 h-4 w-4" />
        </motion.button>
      ))}
    </div>
  )
}
