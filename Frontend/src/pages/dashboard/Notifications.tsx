import { Bell, Users, CheckSquare, MessageSquare, Activity } from "lucide-react";

const notifications = [
  { icon: Users, text: "Alex Smith requested to join 'E-commerce Redesign'", time: "2 minutes ago", unread: true },
  { icon: CheckSquare, text: "Task 'Design landing page' was marked as completed by Alice", time: "15 minutes ago", unread: true },
  { icon: Activity, text: "Task 'API Integration' status updated to In Progress", time: "1 hour ago", unread: true },
  { icon: MessageSquare, text: "New comment on 'Build API endpoints' from Charlie", time: "3 hours ago", unread: false },
  { icon: Users, text: "Jordan Lee joined 'Mobile App MVP'", time: "5 hours ago", unread: false },
  { icon: CheckSquare, text: "Task 'Write unit tests' was marked as completed by Bob", time: "1 day ago", unread: false },
  { icon: Activity, text: "Project 'Marketing Website' is 90% complete", time: "1 day ago", unread: false },
];

const Notifications = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Notifications</h1>
        <p className="text-muted-foreground text-sm">Stay updated on project activity</p>
      </div>
      <button className="text-sm text-primary hover:underline">Mark all as read</button>
    </div>

    <div className="glass-card overflow-hidden divide-y divide-border/50">
      {notifications.map((n, i) => (
        <div
          key={i}
          className={`flex items-start gap-4 p-5 transition-colors hover:bg-muted/30 ${
            n.unread ? "bg-primary/5" : ""
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
);

export default Notifications;
