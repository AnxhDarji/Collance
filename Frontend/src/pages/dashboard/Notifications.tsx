import { useState, useEffect } from "react";
import { Users, CheckSquare, Activity, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Proposal {
  id: string;
  freelancer_name: string;
  project_title: string;
  project_code: string;
  message: string;
  price: number;
  time: string;
  created_at: string;
}

const mockNotifications = [
  { icon: CheckSquare, text: "Task 'Design landing page' was marked as completed by Alice", time: "15 minutes ago", unread: true },
  { icon: Activity, text: "Task 'API Integration' status updated to In Progress", time: "1 hour ago", unread: true },
  { icon: MessageSquare, text: "New comment on 'Build API endpoints' from Charlie", time: "3 hours ago", unread: false },
  { icon: Users, text: "Jordan Lee joined 'Mobile App MVP'", time: "5 hours ago", unread: false },
  { icon: CheckSquare, text: "Task 'Write unit tests' was marked as completed by Bob", time: "1 day ago", unread: false },
  { icon: Activity, text: "Project 'Marketing Website' is 90% complete", time: "1 day ago", unread: false },
];

const Notifications = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.role === "client") {
      fetchProposals();
    }
  }, [user?.role]);

  const fetchProposals = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/proposals/incoming", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProposals(data);
      }
    } catch (error) {
      console.error("Failed to fetch proposals", error);
    }
  };

  const handleAction = async (proposalId: string, action: "accept" | "reject") => {
    setLoadingAction(proposalId);
    try {
      const res = await fetch(`http://localhost:5000/api/contracts/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ proposalId })
      });

      if (res.ok) {
        toast.success(`Proposal ${action}ed!`);
        fetchProposals();
      } else {
        const error = await res.json();
        toast.error(error.message || `Failed to ${action} proposal`);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground text-sm">Stay updated on project activity</p>
        </div>
        <button className="text-sm text-primary hover:underline">Mark all as read</button>
      </div>

      <div className="glass-card overflow-hidden divide-y divide-border/50">

        {/* Dynamic Project Requests for Clients */}
        {user?.role === "client" && proposals.map((p) => (
          <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 transition-colors hover:bg-muted/30 bg-primary/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                <span className="font-bold">{p.freelancer_name}</span> requested to join <span className="font-bold">'{p.project_title}'</span> (${p.price})
              </p>
              <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">"{p.message}"</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(p.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-2 shrink-0 self-end sm:self-center mt-3 sm:mt-0">
              <button
                disabled={loadingAction === p.id}
                onClick={() => handleAction(p.id, "reject")}
                className="px-4 py-1.5 rounded-md border border-red-500/50 text-red-500 text-xs font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                disabled={loadingAction === p.id}
                onClick={() => handleAction(p.id, "accept")}
                className="gradient-btn px-4 py-1.5 rounded-md text-xs font-semibold disabled:opacity-50"
              >
                Accept
              </button>
            </div>
          </div>
        ))}

        {user?.role === "client" && proposals.length === 0 && (
           <div className="p-5 text-center text-sm text-muted-foreground">
             No pending project join requests
           </div>
        )}

        {/* Existing Mock Notifications */}
        <div className="border-t-[8px] border-border/50">
          {mockNotifications.map((n, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 p-5 transition-colors hover:bg-muted/30 ${
                n.unread ? "bg-primary/5 border-b border-border/50" : "border-b border-border/50"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <n.icon size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.unread ? "font-medium" : "text-muted-foreground"}`}>{n.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {n.unread && <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
