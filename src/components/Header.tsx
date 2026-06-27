import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Menu, Sun, Moon } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentTabName: string;
}

export const Header = ({ sidebarOpen, setSidebarOpen, currentTabName }: HeaderProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0a0d16]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 lg:px-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none lg:hidden cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold font-outfit text-gray-900 dark:text-white">
          {currentTabName} Overview
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl border border-gray-200 dark:border-white/10 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs text-gray-400">Authenticated user:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.full_name}
          </span>
        </div>
        <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold border border-white/10 uppercase shadow-md shadow-violet-500/10">
          {user?.full_name ? user.full_name.substring(0, 2) : "US"}
        </div>
      </div>
    </header>
  );
};
