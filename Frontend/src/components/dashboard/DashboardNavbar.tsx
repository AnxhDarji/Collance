import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationsContext";

const DashboardNavbar = () => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const initials = user && user.name ? user.name.substring(0, 2).toUpperCase() : "JD";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key?.startsWith("collance.notifications.session.v1:")) sessionStorage.removeItem(key);
    }
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="relative w-72">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Bell size={20} className="text-muted-foreground" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
          </button>
          {showNotifs && <NotificationDropdown onClose={() => setShowNotifs(false)} />}
        </div>

        <button
          onClick={() => setShowProfileMenu((prev) => !prev)}
          className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold hover:bg-primary/30 transition-colors"
        >
          {initials}
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 top-12 w-48 rounded-lg border border-border bg-background shadow-lg py-1 z-40">
            <button
              onClick={() => {
                setShowProfileMenu(false);
                navigate("/dashboard/profile");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <User size={16} /> Profile
            </button>
            <button
              onClick={() => {
                setShowProfileMenu(false);
                navigate("/dashboard/settings");
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar;
