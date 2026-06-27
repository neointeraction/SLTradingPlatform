import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import {
  LayoutDashboard,
  Cpu,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Agent Orchestrator", icon: Cpu, path: "/orchestrator" },
    { name: "Auto Trade Agent", icon: Zap, path: "/auto-trade" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 lg:sticky lg:top-0 lg:h-screen z-40 w-64 shrink-0 bg-white dark:bg-[#0a0d16] border-r border-gray-200 dark:border-white/5 flex flex-col justify-between transition-all duration-300 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/10">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-outfit font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              StopLoss AI
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false); // Close on mobile navigation
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/5 to-indigo-600/5 dark:from-violet-600/10 dark:to-indigo-600/10 text-violet-600 dark:text-violet-400 border-l-2 border-violet-600 dark:border-violet-500 pl-[14px]"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-violet-600 dark:text-violet-400" : "text-gray-400"}`}
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Card & Logout inside Sidebar footer */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold border border-gray-200 dark:border-white/5 uppercase">
            {user?.full_name ? user.full_name[0] : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
              {user?.full_name || "Admin User"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {user?.email || "admin@mail.com"}
            </p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="danger"
          className="w-full flex items-center justify-center gap-2 py-2.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};
