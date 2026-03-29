import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import {
  Settings, User, Shield, Bell, Palette, Globe,
  Save, Check, Loader2
} from "lucide-react"

const SECTION = "text-xs font-bold uppercase tracking-widest text-muted-foreground"

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()

  const [profile, setProfile] = useState({ fullName: "", email: "" })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  const [notifs, setNotifs] = useState({
    emailAlerts: false,
    pushAlerts: true,
    weeklySummary: false,
  })

  const [prefs, setPrefs] = useState({ mapView: "satellite", timezone: "Asia/Kolkata", units: "metric" })
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({ fullName: user.fullName || user.name || "", email: user.email || "" })
    }
  }, [user])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile({ fullName: profile.fullName })
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2500)
    } catch {
      // silently fail — no toast yet
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSavePrefs = async (e) => {
    e.preventDefault()
    setSavingPrefs(true)
    await new Promise((r) => setTimeout(r, 800))
    setSavingPrefs(false)
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2500)
  }

  const SaveButton = ({ loading, saved, label = "Save Changes" }) => (
    <Button
      type="submit"
      disabled={loading}
      className={`gap-2 transition-all ${
        saved ? "bg-success hover:bg-success/90 text-success-foreground" : ""
      }`}
    >
      {loading ? (
        <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</>
      ) : saved ? (
        <><Check className="h-3.5 w-3.5" />Saved!</>
      ) : (
        <><Save className="h-3.5 w-3.5" />{label}</>
      )}
    </Button>
  )

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-5 lg:p-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 lg:p-6 space-y-6 max-w-4xl">

        {/* Profile */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className={SECTION}>Profile</p>
          <Card className="border-border/60 card-shadow">
            <CardHeader className="pb-0 pt-5 px-5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs font-semibold">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="h-10 bg-background/60 border-border/70 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="h-10 bg-secondary/40 border-border/50 text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    Role:{" "}
                    <span className="font-semibold text-foreground">
                      {user?.role?.replace(/_/g, " ") || "—"}
                    </span>
                  </p>
                  <SaveButton loading={savingProfile} saved={profileSaved} label="Update Profile" />
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.section>

        {/* Security */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
        >
          <p className={SECTION}>Security</p>
          <Card className="border-border/60 card-shadow">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/40 border border-border/50">
                <div>
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-semibold">Change Password</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    type="password"
                    placeholder="Current password"
                    className="h-10 bg-background/60 border-border/70 focus-visible:ring-primary/30"
                  />
                  <Input
                    type="password"
                    placeholder="New password (min 6 chars)"
                    className="h-10 bg-background/60 border-border/70 focus-visible:ring-primary/30"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Notifications */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
        >
          <p className={SECTION}>Notifications</p>
          <Card className="border-border/60 card-shadow">
            <CardContent className="p-5 space-y-1">
              {[
                { key: "emailAlerts",   label: "Email alerts for new shipments",        desc: "Get notified via email when a shipment is created" },
                { key: "pushAlerts",    label: "Push notifications for task updates",   desc: "Real-time browser notifications" },
                { key: "weeklySummary", label: "Weekly summary reports",                desc: "A summary of activity delivered every Monday" },
              ].map((item, i) => (
                <div key={item.key}>
                  {i > 0 && <Separator className="my-3 bg-border/40" />}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifs[item.key]}
                      onCheckedChange={(v) => setNotifs({ ...notifs, [item.key]: v })}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.section>

        {/* Preferences */}
        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
        >
          <p className={SECTION}>Preferences</p>
          <Card className="border-border/60 card-shadow">
            <CardContent className="p-5">
              <form onSubmit={handleSavePrefs} className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Default Map View</Label>
                    <Select value={prefs.mapView} onValueChange={(v) => setPrefs({ ...prefs, mapView: v })}>
                      <SelectTrigger className="h-10 bg-background/60 border-border/70 focus:ring-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roadmap">Roadmap</SelectItem>
                        <SelectItem value="satellite">Satellite</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Time Zone</Label>
                    <Select value={prefs.timezone} onValueChange={(v) => setPrefs({ ...prefs, timezone: v })}>
                      <SelectTrigger className="h-10 bg-background/60 border-border/70 focus:ring-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">IST (Asia/Kolkata)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">EST (New York)</SelectItem>
                        <SelectItem value="Europe/London">GMT (London)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Units</Label>
                    <Select value={prefs.units} onValueChange={(v) => setPrefs({ ...prefs, units: v })}>
                      <SelectTrigger className="h-10 bg-background/60 border-border/70 focus:ring-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, km)</SelectItem>
                        <SelectItem value="imperial">Imperial (lb, mi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <SaveButton loading={savingPrefs} saved={prefsSaved} label="Save Preferences" />
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.section>

      </div>
    </div>
  )
}
