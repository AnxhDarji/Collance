import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type NotificationIcon = "users" | "check" | "activity" | "message";
type ProposalStatus = "pending" | "accepted" | "rejected";

export type NotificationItem =
  | {
      id: string;
      kind: "static";
      icon: NotificationIcon;
      text: string;
      timeLabel: string;
      unread: boolean;
      createdAt: string;
    }
  | {
      id: string;
      kind: "proposal";
      icon: "users";
      proposalId: string;
      freelancerName: string;
      projectTitle: string;
      price: number;
      message: string;
      status: ProposalStatus;
      unread: boolean;
      createdAt: string;
    };

type NotificationPreferenceKey = "email" | "push" | "taskReminders";
export type NotificationPreferences = Record<NotificationPreferenceKey, boolean>;

interface ProposalApiItem {
  id: string;
  freelancer_name: string;
  project_title: string;
  project_code: string;
  message: string;
  price: number;
  time: string;
  created_at: string;
}

interface NotificationsContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  preferences: NotificationPreferences;
  setPreference: (key: NotificationPreferenceKey, value: boolean) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  refreshIncomingProposals: () => Promise<void>;
  actOnProposal: (proposalId: string, action: "accept" | "reject") => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const API = "http://localhost:5000";
const PREFS_KEY = "collance.notificationPrefs.v1";

const getUserKey = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return "anonymous";
  try {
    const user = JSON.parse(userStr);
    return String(user.id ?? user.email ?? `${user.role ?? "user"}:${user.name ?? "unknown"}`);
  } catch {
    return "anonymous";
  }
};

const getSessionKey = (userKey: string) => `collance.notifications.session.v1:${userKey}`;

const getDefaultStaticNotifications = (): NotificationItem[] => {
  const now = new Date();
  const iso = now.toISOString();
  return [
    {
      id: "static-1",
      kind: "static",
      icon: "check",
      text: "Task 'Design landing page' was marked as completed by Alice",
      timeLabel: "15 minutes ago",
      unread: true,
      createdAt: iso,
    },
    {
      id: "static-2",
      kind: "static",
      icon: "activity",
      text: "Task 'API Integration' status updated to In Progress",
      timeLabel: "1 hour ago",
      unread: true,
      createdAt: iso,
    },
    {
      id: "static-3",
      kind: "static",
      icon: "message",
      text: "New comment on 'Build API endpoints' from Charlie",
      timeLabel: "3 hours ago",
      unread: false,
      createdAt: iso,
    },
    {
      id: "static-4",
      kind: "static",
      icon: "users",
      text: "Jordan Lee joined 'Mobile App MVP'",
      timeLabel: "5 hours ago",
      unread: false,
      createdAt: iso,
    },
  ];
};

const loadPreferences = (): NotificationPreferences => {
  const raw = localStorage.getItem(PREFS_KEY);
  if (!raw) return { email: true, push: true, taskReminders: true };
  try {
    const parsed = JSON.parse(raw);
    return {
      email: Boolean(parsed.email),
      push: Boolean(parsed.push),
      taskReminders: Boolean(parsed.taskReminders),
    };
  } catch {
    return { email: true, push: true, taskReminders: true };
  }
};

const loadNotifications = (sessionKey: string): NotificationItem[] => {
  const raw = sessionStorage.getItem(sessionKey);
  if (!raw) return getDefaultStaticNotifications();
  try {
    const parsed = JSON.parse(raw) as NotificationItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return getDefaultStaticNotifications();
    return parsed;
  } catch {
    return getDefaultStaticNotifications();
  }
};

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const userKeyRef = useRef<string>(getUserKey());
  const sessionKeyRef = useRef<string>(getSessionKey(userKeyRef.current));

  const [preferences, setPreferences] = useState<NotificationPreferences>(() => loadPreferences());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadNotifications(sessionKeyRef.current),
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    sessionStorage.setItem(sessionKeyRef.current, JSON.stringify(notifications));
  }, [notifications]);

  const setPreference = useCallback((key: NotificationPreferenceKey, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const upsertProposalNotifications = useCallback((incoming: ProposalApiItem[]) => {
    setNotifications((prev) => {
      const existingById = new Map(prev.map((n) => [n.id, n] as const));
      const next = [...prev];

      for (const p of incoming) {
        const id = `proposal-${p.id}`;
        const existing = existingById.get(id);
        if (existing && existing.kind === "proposal") {
          continue;
        }
        next.unshift({
          id,
          kind: "proposal",
          icon: "users",
          proposalId: p.id,
          freelancerName: p.freelancer_name,
          projectTitle: p.project_title,
          price: p.price,
          message: p.message,
          status: "pending",
          unread: true,
          createdAt: p.created_at,
        });
      }

      return next;
    });
  }, []);

  const refreshIncomingProposals = useCallback(async () => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userStr || !token) return;

    try {
      const parsed = JSON.parse(userStr) as unknown;
      const role =
        typeof parsed === "object" && parsed !== null
          ? (parsed as Record<string, unknown>).role
          : null;
      if (role !== "client") return;
    } catch {
      return;
    }

    try {
      const res = await fetch(`${API}/api/proposals/incoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as ProposalApiItem[];
      if (!Array.isArray(data)) return;
      upsertProposalNotifications(data);
    } catch {
      // ignore
    }
  }, [upsertProposalNotifications]);

  const actOnProposal = useCallback(
    async (proposalId: string, action: "accept" | "reject") => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/api/contracts/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proposalId }),
      });

      if (!res.ok) {
        let message = `Failed to ${action} proposal`;
        try {
          const error = await res.json();
          message = error.message || message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      setNotifications((prev) =>
        prev.map((n) => {
          if (n.kind !== "proposal" || n.proposalId !== proposalId) return n;
          return {
            ...n,
            status: action === "accept" ? "accepted" : "rejected",
            unread: true,
          };
        }),
      );
    },
    [],
  );

  useEffect(() => {
    refreshIncomingProposals();
    const interval = window.setInterval(refreshIncomingProposals, 15000);
    return () => window.clearInterval(interval);
  }, [refreshIncomingProposals]);

  const value: NotificationsContextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      preferences,
      setPreference,
      markAllAsRead,
      markAsRead,
      clearNotification,
      refreshIncomingProposals,
      actOnProposal,
    }),
    [
      notifications,
      unreadCount,
      preferences,
      setPreference,
      markAllAsRead,
      markAsRead,
      clearNotification,
      refreshIncomingProposals,
      actOnProposal,
    ],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
};
