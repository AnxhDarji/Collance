import { useEffect, useState } from "react";
import { Activity, CheckSquare, MessageSquare, Users, X } from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationsContext";

const iconMap = {
  users: Users,
  check: CheckSquare,
  activity: Activity,
  message: MessageSquare,
} as const;

const Notifications = () => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const {
    notifications,
    markAllAsRead,
    markAsRead,
    clearNotification,
    refreshIncomingProposals,
    actOnProposal,
  } = useNotifications();

  useEffect(() => {
    refreshIncomingProposals();
  }, [refreshIncomingProposals]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-muted-foreground text-sm">Stay updated on project activity</p>
        </div>
        <button onClick={markAllAsRead} className="text-sm text-primary hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="glass-card overflow-hidden divide-y divide-border/50">
        {notifications.length === 0 ? (
          <div className="p-5 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          notifications.map((n) => {
            const Icon = iconMap[n.icon];
            const time = n.kind === "static" ? n.timeLabel : new Date(n.createdAt).toLocaleString();
            const text =
              n.kind === "static"
                ? n.text
                : `${n.freelancerName} requested to join '${n.projectTitle}' ($${n.price})`;

            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-5 transition-colors hover:bg-muted/30 ${
                  n.unread ? "bg-primary/5 border-b border-border/50" : "border-b border-border/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                  title="Mark as read"
                >
                  <Icon size={18} className="text-primary" />
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.unread ? "font-medium" : "text-muted-foreground"}`}>{text}</p>

                  {n.kind === "proposal" && (
                    <>
                      <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">"{n.message}"</p>
                      {n.status !== "pending" && (
                        <p
                          className={`text-xs mt-2 font-medium ${
                            n.status === "accepted" ? "text-success" : "text-destructive"
                          }`}
                        >
                          {n.status === "accepted" ? "Accepted" : "Declined"}
                        </p>
                      )}
                    </>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">{time}</p>
                </div>

                <div className="flex items-start gap-3 shrink-0">
                  {n.kind === "proposal" && n.status === "pending" && (
                    <div className="flex gap-2 shrink-0 self-end sm:self-center">
                      <button
                        disabled={loadingAction === n.proposalId}
                        onClick={async () => {
                          setLoadingAction(n.proposalId);
                          try {
                            await actOnProposal(n.proposalId, "reject");
                            toast.success("Proposal declined!");
                          } catch (e: unknown) {
                            toast.error(e instanceof Error ? e.message : "Failed to decline proposal");
                          } finally {
                            setLoadingAction(null);
                          }
                        }}
                        className="px-4 py-1.5 rounded-md border border-red-500/50 text-red-500 text-xs font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        disabled={loadingAction === n.proposalId}
                        onClick={async () => {
                          setLoadingAction(n.proposalId);
                          try {
                            await actOnProposal(n.proposalId, "accept");
                            toast.success("Proposal accepted!");
                          } catch (e: unknown) {
                            toast.error(e instanceof Error ? e.message : "Failed to accept proposal");
                          } finally {
                            setLoadingAction(null);
                          }
                        }}
                        className="gradient-btn px-4 py-1.5 rounded-md text-xs font-semibold disabled:opacity-50"
                      >
                        Accept
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => clearNotification(n.id)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Clear notification"
                  >
                    <X size={16} />
                  </button>

                  {n.unread && <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
