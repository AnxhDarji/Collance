import { User, Mail, Bell, Shield, Palette } from "lucide-react";

const Settings = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "John Doe", email: "john@example.com" };

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
            defaultValue={user.name}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
          <input
            defaultValue={user.email}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <button className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium">Save Changes</button>
    </div>

    {/* Notifications */}
    <div className="glass-card p-6 space-y-4">
      <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
        <Bell size={18} className="text-primary" /> Notifications
      </h2>
      {["Email notifications", "Push notifications", "Task reminders"].map((label) => (
        <div key={label} className="flex items-center justify-between py-2">
          <span className="text-sm">{label}</span>
          <button className="w-10 h-6 rounded-full bg-primary/20 relative transition-colors">
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary transition-transform" />
          </button>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Settings;
