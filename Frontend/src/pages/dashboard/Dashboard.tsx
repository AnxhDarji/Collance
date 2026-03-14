import { Briefcase, Users, UserPlus, CheckSquare, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Total Projects", value: "12", icon: Briefcase, change: "+2 this month" },
  { label: "Active Freelancers", value: "34", icon: Users, change: "+5 this week" },
  { label: "Pending Requests", value: "7", icon: UserPlus, change: "3 new today" },
  { label: "Completed Tasks", value: "128", icon: CheckSquare, change: "+18 this week" },
];

const recentProjects = [
  { name: "E-commerce Redesign", id: "PRJ-2847", freelancers: 4, progress: 72, updated: "2h ago" },
  { name: "Mobile App MVP", id: "PRJ-1923", freelancers: 3, progress: 45, updated: "5h ago" },
  { name: "Marketing Website", id: "PRJ-3021", freelancers: 2, progress: 90, updated: "1d ago" },
];

const Dashboard = () => (
  <div className="space-y-8">
    <div>
      <h1 className="font-heading text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground text-sm">Welcome back, John. Here's your overview.</p>
    </div>

    {/* Stats */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <s.icon size={20} className="text-primary" />
            </div>
            <ArrowUpRight size={16} className="text-success" />
          </div>
          <p className="font-heading text-2xl font-bold">{s.value}</p>
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className="text-xs text-success mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {s.change}
          </p>
        </div>
      ))}
    </div>

    {/* Recent projects */}
    <div>
      <h2 className="font-heading text-lg font-semibold mb-4">Recent Projects</h2>
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Project</th>
              <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">ID</th>
              <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Freelancers</th>
              <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Progress</th>
              <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Updated</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((p) => (
              <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4 text-sm font-medium">{p.name}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{p.id}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{p.freelancers}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.progress}%`,
                          backgroundImage: "var(--gradient-primary)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{p.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{p.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Dashboard;
