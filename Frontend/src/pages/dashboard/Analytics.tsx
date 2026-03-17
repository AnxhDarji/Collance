import { BarChart3, CheckSquare, Clock, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "@/lib/api";

type BackendStatus = "not_started" | "in_progress" | "completed";

interface Project {
  id: number;
  title: string;
  project_code: string;
  created_at?: string;
}

interface Contract {
  id: string;
  project_title: string;
  project_code: string;
  client_name: string;
  freelancer_name: string;
  status: string;
  created_at: string;
}

interface Task {
  id: string;
  task_name: string;
  project_code: string;
  status: BackendStatus;
  created_at: string;
}

const Analytics = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        if (user?.role === "client") {
          const [projectsRes, contractsRes] = await Promise.all([
            fetch(buildApiUrl("/api/projects/my-projects"), { headers }),
            fetch(buildApiUrl("/api/contracts/my-contracts"), { headers }),
          ]);

          const nextProjects = projectsRes.ok ? ((await projectsRes.json()) as Project[]) : [];
          const nextContracts = contractsRes.ok ? ((await contractsRes.json()) as Contract[]) : [];

          const taskFetches = Array.isArray(nextProjects)
            ? nextProjects.map((p) => fetch(buildApiUrl(`/api/tasks/project/${p.id}`), { headers }))
            : [];
          const taskResponses = await Promise.all(taskFetches);

          const allTasks: Task[] = [];
          for (const r of taskResponses) {
            if (!r.ok) continue;
            const data = (await r.json()) as Task[];
            if (Array.isArray(data)) allTasks.push(...data);
          }

          if (cancelled) return;
          setProjects(Array.isArray(nextProjects) ? nextProjects : []);
          setContracts(Array.isArray(nextContracts) ? nextContracts : []);
          setTasks(allTasks);
        } else {
          const [tasksRes, contractsRes] = await Promise.all([
            fetch(buildApiUrl("/api/tasks/mytasks"), { headers }),
            fetch(buildApiUrl("/api/contracts/my-contracts"), { headers }),
          ]);

          const nextTasks = tasksRes.ok ? ((await tasksRes.json()) as Task[]) : [];
          const nextContracts = contractsRes.ok ? ((await contractsRes.json()) as Contract[]) : [];

          if (cancelled) return;
          setProjects([]);
          setContracts(Array.isArray(nextContracts) ? nextContracts : []);
          setTasks(Array.isArray(nextTasks) ? nextTasks : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [headers, token, user?.role]);

  const computed = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const totalProjects =
      user?.role === "client"
        ? projects.length
        : new Set(
            (contracts.length ? contracts.map((c) => c.project_code) : tasks.map((t) => t.project_code)).filter(
              Boolean,
            ),
          ).size;

    const activeFreelancers =
      user?.role === "client"
        ? new Set(contracts.map((c) => c.freelancer_name).filter(Boolean)).size
        : 0;

    const stats = [
      { label: "Total Projects", value: totalProjects, icon: BarChart3 },
      { label: "Active Freelancers", value: activeFreelancers, icon: TrendingUp },
      { label: "Completed Tasks", value: completedTasks, icon: CheckSquare },
      { label: "Pending Tasks", value: pendingTasks, icon: Clock },
    ];

    const progressByProject = (() => {
      if (user?.role !== "client") return [];
      const byProjectCode = new Map<string, Task[]>();
      for (const t of tasks) {
        const key = t.project_code;
        if (!key) continue;
        const arr = byProjectCode.get(key) ?? [];
        arr.push(t);
        byProjectCode.set(key, arr);
      }

      return projects
        .slice()
        .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")))
        .slice(0, 4)
        .map((p) => {
          const projectTasks = byProjectCode.get(p.project_code) ?? [];
          const total = projectTasks.length;
          const completed = projectTasks.filter((t) => t.status === "completed").length;
          const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
          return { name: p.title, total, completed, progress: pct };
        });
    })();

    const weekly = (() => {
      const now = new Date();
      const monIndex = (now.getDay() + 6) % 7; // Mon=0..Sun=6
      const start = new Date(now);
      start.setDate(now.getDate() - monIndex);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      const buckets = Array.from({ length: 7 }, () => 0);
      for (const t of tasks) {
        const d = new Date(t.created_at);
        if (Number.isNaN(d.getTime())) continue;
        if (d < start || d >= end) continue;
        const idx = (d.getDay() + 6) % 7;
        buckets[idx]++;
      }
      const max = Math.max(...buckets, 1);
      return { buckets, max };
    })();

    return { stats, progressByProject, weekly, progress };
  }, [contracts, projects, tasks, user?.role]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-muted-foreground text-sm">Project statistics and performance overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {computed.stats.map((s) => (
          <div key={s.label} className="glass-card-hover p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <s.icon size={22} className="text-primary" />
            </div>
            <p className="font-heading text-3xl font-bold">{loading ? "—" : s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart representation */}
      <div className="glass-card p-6">
        <h2 className="font-heading text-lg font-semibold mb-6">Project Progress</h2>
        {user?.role !== "client" ? (
          <p className="text-sm text-muted-foreground">Project progress is available for client accounts.</p>
        ) : (
          <div className="space-y-5">
            {computed.progressByProject.length === 0 ? (
              <p className="text-sm text-muted-foreground">No project task data available yet.</p>
            ) : (
              computed.progressByProject.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground">
                      {p.completed}/{p.total} tasks
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${p.progress}%`, backgroundImage: "var(--gradient-primary)" }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Weekly chart */}
      <div className="glass-card p-6">
        <h2 className="font-heading text-lg font-semibold mb-6">Weekly Activity</h2>
        <div className="flex items-end gap-3 h-40">
          {computed.weekly.buckets.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${(val / computed.weekly.max) * 100}%`,
                  backgroundImage: "var(--gradient-primary)",
                  opacity: 0.7 + (val / computed.weekly.max) * 0.3,
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
};

export default Analytics;
