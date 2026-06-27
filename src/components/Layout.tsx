import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Menu } from "lucide-react";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Agent Orchestrator", path: "/orchestrator" },
    { name: "Settings", path: "/settings" },
  ];

  const currentTabName =
    navigationItems.find((item) => item.path === location.pathname)?.name ||
    "Dashboard";

  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-[#060810] flex text-gray-800 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      {/* Mobile Sidebar overlay toggler */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-violet-600 rounded-full shadow-lg text-white cursor-pointer active:scale-95 transition-transform"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar Navigation */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentTabName={currentTabName}
        />

        {/* Dynamic Page Content */}
        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default Layout;
