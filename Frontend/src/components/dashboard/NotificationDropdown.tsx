import { Users, CheckSquare, MessageSquare, Activity } from "lucide-react";

const notifications = [
  { icon: Users, text: "Alex requested to join Project Alpha", time: "2m ago" },
  { icon: CheckSquare, text: "Task 'Design UI' marked as completed", time: "15m ago" },
  { icon: Activity, text: "Task 'API Integration' status updated", time: "1h ago" },
  { icon: MessageSquare, text: "New comment on 'Landing Page' task", time: "3h ago" },
];

interface Props {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: Props) => (
  <div className="absolute right-0 top-12 w-80 glass-card shadow-xl z-50 overflow-hidden">
    <div className="p-4 border-b border-border flex items-center justify-between">
      <h3 className="font-heading text-sm font-semibold">Notifications</h3>
      <button onClick={onClose} className="text-xs text-primary hover:underline">
        Close
      </button>
    </div>
    <div className="max-h-80 overflow-y-auto">
      {notifications.map((n, i) => (
        <div key={i} className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <n.icon size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">{n.text}</p>
            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NotificationDropdown;
