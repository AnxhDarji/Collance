import { User, Mail, Bell, Shield, Palette } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationsContext";

const Settings = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "John Doe", email: "john@example.com" };
  const [fullName, setFullName] = useState<string>(user.name ?? "");
  const [email, setEmail] = useState<string>(user.email ?? "");
  const { preferences, setPreference } = useNotifications();

  const saveProfile = () => {
    const existingStr = localStorage.getItem("user");
    const existing = existingStr ? JSON.parse(existingStr) : {};
    const next = { ...existing, name: fullName, email };
    localStorage.setItem("user", JSON.stringify(next));
    toast.success("Settings saved");
  };

  return (
  <div className="space-y-8 max-w-2xl">
    <div>
      <h1 className="font-heading text-2xl font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground text-sm">Manage your account preferences</p>
    </div>

    {/* Profile */}
    <div className="glass-card p-6 space-y-5">
      <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
        <User size={18} className="text-primary" /> Profile
      </h2>
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <button onClick={saveProfile} className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium">
        Save Changes
      </button>
    </div>

    {/* Notifications */}
    <div className="glass-card p-6 space-y-4">
      <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
        <Bell size={18} className="text-primary" /> Notifications
      </h2>
      {[
        { label: "Email notifications", key: "email" as const },
        { label: "Push notifications", key: "push" as const },
        { label: "Task reminders", key: "taskReminders" as const },
      ].map(({ label, key }) => {
        const enabled = preferences[key];
        return (
          <div key={label} className="flex items-center justify-between py-2">
            <span className="text-sm">{label}</span>
            <button
              type="button"
              aria-pressed={enabled}
              onClick={() => setPreference(key, !enabled)}
              className={`w-10 h-6 rounded-full relative transition-colors ${
                enabled ? "bg-primary/40" : "bg-primary/20"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-primary transition-transform ${
                  enabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  </div>
  );
};

export default Settings;
