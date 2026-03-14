import { useState, useEffect } from "react";
import { Briefcase, Users, UserPlus, CheckSquare, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Total Projects", value: "12", icon: Briefcase, change: "+2 this month" },
  { label: "Active Freelancers", value: "34", icon: Users, change: "+5 this week" },
  { label: "Pending Requests", value: "7", icon: UserPlus, change: "3 new today" },
  { label: "Completed Tasks", value: "128", icon: CheckSquare, change: "+18 this week" },
];

interface Contract {
  id: string;
  project_title: string;
  project_code: string;
  client_name: string;
  freelancer_name: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "John" };
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contracts/my-contracts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contracts", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {user.name}. Here's your overview.</p>
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

      {/* Active Contracts / Recent projects */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">
          {user.role === "client" ? "Active Freelancers" : "Active Contracts"}
        </h2>
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Project</th>
                <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {user.role === "client" ? "Freelancer" : "Client"}
                </th>
                <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Started</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium">{c.project_title}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground font-mono bg-muted p-1 rounded inline-block mt-2 ml-5">{c.project_code}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{user.role === "client" ? c.freelancer_name : c.client_name}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-success/10 text-success capitalize">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No active contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
