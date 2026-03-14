import { useState } from "react";
import { Plus, Copy, Users, Clock } from "lucide-react";

const mockProjects = [
  { id: "PRJ-2847", name: "E-commerce Redesign", freelancers: 4, progress: 72, updated: "2h ago" },
  { id: "PRJ-1923", name: "Mobile App MVP", freelancers: 3, progress: 45, updated: "5h ago" },
  { id: "PRJ-3021", name: "Marketing Website", freelancers: 2, progress: 90, updated: "1d ago" },
  { id: "PRJ-4105", name: "CRM Integration", freelancers: 5, progress: 20, updated: "3h ago" },
  { id: "PRJ-5512", name: "Analytics Dashboard", freelancers: 2, progress: 60, updated: "6h ago" },
];

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage your project workspaces</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="gradient-btn px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Join request card (for freelancer view) */}
      <div className="glass-card p-5">
        <h3 className="font-heading text-sm font-semibold mb-3">Join a Project</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Project ID (e.g. PRJ-2847)"
            className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap">
            Send Request
          </button>
        </div>
      </div>

      {/* Project cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockProjects.map((p) => (
          <div key={p.id} className="glass-card-hover p-5 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-heading font-semibold">{p.name}</h3>
              <button
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Copy Project ID"
              >
                <Copy size={14} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{p.id}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users size={12} /> {p.freelancers}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {p.updated}</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{p.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.progress}%`, backgroundImage: "var(--gradient-primary)" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create project modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-md p-8 mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading text-xl font-bold mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button className="flex-1 gradient-btn py-3 rounded-lg text-sm font-semibold">
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
