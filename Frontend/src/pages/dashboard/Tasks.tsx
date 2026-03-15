import { useState, useEffect } from "react";
import { MessageSquare, Calendar, User, Plus, Briefcase } from "lucide-react";

type BackendStatus = "not_started" | "in_progress" | "completed";

interface Task {
  id: string;
  task_name: string;
  freelancer_name: string;
  client_name: string;
  project_code: string;
  status: BackendStatus;
  comment?: string;
  created_at: string;
}

interface Project {
  id: number;
  title: string;
  project_code: string;
}

interface Freelancer {
  id: string;
  name: string;
}

const columns: { key: BackendStatus; label: string; color: string }[] = [
  { key: "not_started", label: "Todo", color: "bg-muted-foreground" },
  { key: "in_progress", label: "In Progress", color: "bg-primary" },
  { key: "completed", label: "Completed", color: "bg-success" },
];

const statusOptions: { value: BackendStatus; label: string }[] = [
  { value: "not_started", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const statusBadge: Record<BackendStatus, JSX.Element> = {
  not_started: <span className="status-todo">Todo</span>,
  in_progress: <span className="status-progress">In Progress</span>,
  completed: <span className="status-completed">Completed</span>,
};

const API = "http://localhost:5000";

const Tasks = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");
  const isClient = user?.role === "client";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState<BackendStatus | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
    const saved = localStorage.getItem("selectedProject");
    return saved ? JSON.parse(saved) : null;
  });
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isClient) {
      fetchProjects();
      if (selectedProject) {
        fetchTasks(selectedProject.id);
        fetchFreelancers(selectedProject.id);
      }
    } else {
      fetchMyTasks();
    }
  }, []);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchProjects = async () => {
    const res = await fetch(`${API}/api/projects/my-projects`, { headers });
    if (res.ok) setProjects(await res.json());
  };

  const fetchMyTasks = async () => {
    const res = await fetch(`${API}/api/tasks/mytasks`, { headers });
    if (res.ok) setTasks(await res.json());
  };

  const fetchFreelancers = async (projectId: number) => {
    setLoadingFreelancers(true);
    try {
      const res = await fetch(`${API}/api/tasks/freelancers/${projectId}`, { headers });
      if (res.ok) setFreelancers(await res.json());
    } finally {
      setLoadingFreelancers(false);
    }
  };

  const fetchTasks = async (projectId: number) => {
    const res = await fetch(`${API}/api/tasks/project/${projectId}`, { headers });
    if (res.ok) setTasks(await res.json());
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedFreelancer || !taskName) return;
    setAssigning(true);
    try {
      const res = await fetch(`${API}/api/tasks/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectId: selectedProject.id,
          projectCode: selectedProject.project_code,
          taskName,
          freelancerId: selectedFreelancer,
        }),
      });
      if (res.ok) {
        setTaskName("");
        setSelectedFreelancer("");
        fetchTasks(selectedProject.id);
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to assign task");
      }
    } finally {
      setAssigning(false);
    }
  };

  const openTask = (task: Task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setComment(task.comment ?? "");
  };

  const handleSave = async () => {
    if (!selectedTask || !newStatus) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/tasks/update/${selectedTask.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus, comment }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Failed to update task");
        return;
      }
      const updated: Task = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
      setSelectedTask(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Task Board</h1>
        <p className="text-muted-foreground text-sm">Manage and track project tasks</p>
      </div>

      {/* Client: Assign Task Panel */}
      {isClient && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> Assign Task
          </h3>

          <select
            value={selectedProject?.id ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              const p = projects.find((p) => p.id === id) ?? null;
              setSelectedProject(p);
              if (p) localStorage.setItem("selectedProject", JSON.stringify(p));
              else localStorage.removeItem("selectedProject");
              setFreelancers([]);
              setSelectedFreelancer("");
              setTaskName("");
              setTasks([]);
              if (p) {
                fetchFreelancers(p.id);
                fetchTasks(p.id);
              }
            }}
            className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {selectedProject && (
            <form onSubmit={handleAssignTask} className="flex flex-col gap-3">
              {loadingFreelancers ? (
                <p className="text-xs text-muted-foreground">Loading freelancers...</p>
              ) : freelancers.length === 0 ? (
                <p className="text-xs text-muted-foreground">No freelancers on this project yet.</p>
              ) : (
                <select
                  required
                  value={selectedFreelancer}
                  onChange={(e) => setSelectedFreelancer(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select a freelancer</option>
                  {freelancers.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              )}

              {selectedFreelancer && (
                <input
                  type="text"
                  required
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Task name"
                  className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}

              {selectedFreelancer && taskName && (
                <button
                  type="submit"
                  disabled={assigning}
                  className="gradient-btn w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign Task"}
                </button>
              )}
            </form>
          )}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-5 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.key} className="kanban-column">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
              <h3 className="font-heading text-sm font-semibold">{col.label}</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {tasks.filter((t) => t.status === col.key).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks
                .filter((t) => t.status === col.key)
                .map((task) => (
                  <div
                    key={task.id}
                    className="glass-card-hover p-4 cursor-pointer"
                    onClick={() => openTask(task)}
                  >
                    <h4 className="text-sm font-medium mb-3">{task.task_name}</h4>

                    {/* Client card: show freelancer name */}
                    {isClient && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <User size={12} /> {task.freelancer_name}
                      </div>
                    )}

                    {/* Freelancer card: show project code + client name */}
                    {!isClient && (
                      <div className="space-y-1 mb-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Briefcase size={12} /> {task.project_code}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User size={12} /> by {task.client_name}
                        </div>
                      </div>
                    )}

                    <div className="mt-2">{statusBadge[task.status]}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task detail modal — unified for both roles */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedTask(null)}
        >
          <div className="glass-card w-full max-w-lg p-8 mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold mb-4">{selectedTask.task_name}</h2>

            {/* Task meta */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User size={14} />
                <span>Assigned to: <span className="text-foreground font-medium">{selectedTask.freelancer_name}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>Assigned on: <span className="text-foreground font-medium">{new Date(selectedTask.created_at).toLocaleDateString()}</span></span>
              </div>
              <div className="pt-1">{statusBadge[selectedTask.status]}</div>
            </div>

            {/* Comment — read-only for client, editable for freelancer */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1">
                <MessageSquare size={14} /> Freelancer Comment
              </label>
              {isClient ? (
                <div className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm min-h-[72px]">
                  {selectedTask.comment
                    ? <span className="text-foreground">{selectedTask.comment}</span>
                    : <span className="text-muted-foreground italic">No comment yet.</span>
                  }
                </div>
              ) : (
                selectedTask.status !== "completed" && (
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                )
              )}
            </div>

            {/* Freelancer-only: status update */}
            {!isClient && selectedTask.status !== "completed" && (
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Update Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setNewStatus(opt.value)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                        newStatus === opt.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30 hover:bg-primary/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isClient && selectedTask.status === "completed" && (
              <p className="text-sm text-muted-foreground mb-6 italic">This task is completed and cannot be modified.</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Close
              </button>
              {!isClient && selectedTask.status !== "completed" && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 gradient-btn py-3 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
