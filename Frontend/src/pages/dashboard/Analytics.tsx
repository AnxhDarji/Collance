import { BarChart3, CheckSquare, Clock, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Tasks", value: 48, icon: BarChart3 },
  { label: "Completed", value: 32, icon: CheckSquare },
  { label: "Pending", value: 16, icon: Clock },
  { label: "Progress", value: "67%", icon: TrendingUp },
];

const projectStats = [
  { name: "E-commerce Redesign", total: 20, completed: 15, progress: 75 },
  { name: "Mobile App MVP", total: 15, completed: 7, progress: 47 },
  { name: "Marketing Website", total: 8, completed: 7, progress: 88 },
  { name: "CRM Integration", total: 12, completed: 3, progress: 25 },
];

const Analytics = () => (
  <div className="space-y-8">
    <div>
      <h1 className="font-heading text-2xl font-bold mb-1">Analytics</h1>
      <p className="text-muted-foreground text-sm">Project statistics and performance overview</p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card-hover p-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <s.icon size={22} className="text-primary" />
          </div>
          <p className="font-heading text-3xl font-bold">{s.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Bar chart representation */}
    <div className="glass-card p-6">
      <h2 className="font-heading text-lg font-semibold mb-6">Project Progress</h2>
      <div className="space-y-5">
        {projectStats.map((p) => (
          <div key={p.name}>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">{p.name}</span>
              <span className="text-muted-foreground">{p.completed}/{p.total} tasks</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${p.progress}%`, backgroundImage: "var(--gradient-primary)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Weekly chart */}
    <div className="glass-card p-6">
      <h2 className="font-heading text-lg font-semibold mb-6">Weekly Activity</h2>
      <div className="flex items-end gap-3 h-40">
        {[12, 8, 15, 10, 18, 6, 14].map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${(val / 18) * 100}%`,
                backgroundImage: "var(--gradient-primary)",
                opacity: 0.7 + (val / 18) * 0.3,
              }}
            />
            <span className="text-xs text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Analytics;
