import { useState, useEffect } from "react";
import { Plus, Copy, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { buildApiUrl } from "@/lib/api";

interface Project {
  id: string;
  project_code: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
}

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const [joinCode, setJoinCode] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [joinPrice, setJoinPrice] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.role === "client") {
      fetchProjects();
    }
  }, [user?.role]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/projects/my-projects"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("/api/projects/create"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, budget: Number(budget) })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Project created! Code: ${data.project_code}`);
        setShowModal(false);
        setTitle("");
        setDescription("");
        setBudget("");
        fetchProjects();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create project");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || !joinMessage || !joinPrice) {
      toast.error("Please fill all fields to join.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("/api/proposals/request"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectCode: joinCode,
          message: joinMessage,
          price: Number(joinPrice)
        })
      });

      if (res.ok) {
        toast.success("Request sent to client successfully!");
        setJoinCode("");
        setJoinMessage("");
        setJoinPrice("");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to send request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Project code copied to clipboard!");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage your project workspaces</p>
        </div>
        {user?.role === "client" && (
          <button
            onClick={() => setShowModal(true)}
            className="gradient-btn px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {user?.role === "freelancer" && (
        <div className="glass-card p-5">
          <h3 className="font-heading text-sm font-semibold mb-3">Join a Project</h3>
          <form onSubmit={handleJoinProject} className="flex flex-col gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter Project Code (e.g. PRJ-JD-1234)"
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <textarea
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="Why are you a good fit?"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground bg-transparent resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={joinPrice}
                onChange={(e) => setJoinPrice(e.target.value)}
                placeholder="Proposed Price ($)"
                className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button disabled={loading} type="submit" className="gradient-btn px-8 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap disabled:opacity-50">
                {loading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {user?.role === "client" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p.id} className="glass-card-hover p-5 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-heading font-semibold line-clamp-1">{p.title}</h3>
                <button
                  onClick={() => copyToClipboard(p.project_code)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Copy Project Code"
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-mono bg-muted p-1 rounded w-fit">{p.project_code}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">${p.budget}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
             <p className="text-muted-foreground text-sm col-span-full">You haven't created any projects yet.</p>
          )}
        </div>
      )}

      {/* Create project modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md p-8 mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the project..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Budget ($)</label>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 gradient-btn py-3 rounded-lg text-sm font-semibold disabled:opacity-50">
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
