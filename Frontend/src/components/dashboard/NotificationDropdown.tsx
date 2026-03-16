import { Activity, CheckSquare, MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationsContext";

interface Props {
  onClose: () => void;
}

const iconMap = {
  users: Users,
  check: CheckSquare,
  activity: Activity,
  message: MessageSquare,
} as const;

const NotificationDropdown = ({ onClose }: Props) => {
  const { notifications, markAsRead } = useNotifications();
  const top = notifications.slice(0, 5);

  return (
    <div className="absolute right-0 top-12 w-80 glass-card shadow-xl z-50 overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold">Notifications</h3>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/notifications"
            onClick={onClose}
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
          <button onClick={onClose} className="text-xs text-primary hover:underline">
            Close
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {top.length === 0 ? (
          <div className="p-5 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          top.map((n) => {
            const Icon = iconMap[n.icon];
            const time =
              n.kind === "static" ? n.timeLabel : new Date(n.createdAt).toLocaleString();
            const text =
              n.kind === "static"
                ? n.text
                : `${n.freelancerName} requested to join '${n.projectTitle}' ($${n.price})`;

            return (
              <button
                type="button"
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className="w-full text-left flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-foreground">{text}</p>
                    {n.unread && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{time}</p>
                  {n.kind === "proposal" && n.status !== "pending" && (
                    <p
                      className={`text-xs mt-1 font-medium ${
                        n.status === "accepted" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {n.status === "accepted" ? "Accepted" : "Declined"}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
