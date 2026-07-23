import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  LogOut,
  User,
  Home,
  ChevronDown,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import ThemeSelector from "../components/common/ThemeSelector";
import { authHooks } from "../hooks/authHooks";
import { useSocket } from "../context/SocketContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user } = authHooks.useGetUser();
  const { isPending, logoutMutation } = authHooks.useLogout();
  const { unreadCount, markAllRead } = useSocket();

  const isPublicPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/verify");

  const handleLogout = async () => {
    try {
      await logoutMutation();
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleNotificationClick = () => {
    markAllRead();
    navigate("/notification");
  };

  return (
    <nav className="sticky top-0 z-30 h-16 flex items-center px-4 sm:px-6 lg:px-8 backdrop-blur-xl bg-white/[0.04] milky:bg-white/70 border-b border-white/[0.08] milky:border-gray-200/80 shadow-sm">
      {/* Logo */}
      <button
        onClick={() => !isPublicPage && navigate("/")}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0"
      >
        <img src={assets.logo} alt="Frienz" className="h-8 w-auto" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Notifications */}
        {!isPublicPage && (
          <button
            onClick={handleNotificationClick}
            className="relative p-2.5 rounded-xl hover:bg-white/10 milky:hover:bg-gray-100 transition-colors group"
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px] text-white/60 milky:text-gray-500 group-hover:text-white milky:group-hover:text-gray-800 transition-colors" />
            {/* Unread count badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm shadow-rose-500/50"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}

        {/* Theme toggle */}
        <ThemeSelector />

        {/* Avatar + dropdown */}
        {!isPublicPage && (
          <div className="relative ml-1">
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/10 milky:hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full active p-[1.5px] shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                  <img
                    src={user?.profilePic || "/default-avatar.png"}
                    alt={user?.name || "Profile"}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/40 milky:text-gray-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 z-50 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 milky:border-gray-200 bg-gray-900/90 milky:bg-white/95 backdrop-blur-2xl"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-white/10 milky:border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full active p-[1.5px]">
                          <div className="w-full h-full rounded-full overflow-hidden">
                            <img
                              src={user?.profilePic || "/default-avatar.png"}
                              alt={user?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.src = "/default-avatar.png")}
                            />
                          </div>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-semibold text-white milky:text-gray-800 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-white/40 milky:text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      <button
                        onClick={() => { setShowProfileMenu(false); navigate("/profile"); }}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-sm text-white/80 milky:text-gray-700 hover:bg-white/10 milky:hover:bg-gray-100 transition-colors flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={() => { setShowProfileMenu(false); navigate("/"); }}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-sm text-white/80 milky:text-gray-700 hover:bg-white/10 milky:hover:bg-gray-100 transition-colors flex items-center gap-2.5"
                      >
                        <Home className="w-4 h-4" />
                        Home
                      </button>
                    </div>

                    <div className="h-px bg-white/10 milky:bg-gray-200 mx-3" />

                    <div className="p-1.5">
                      <button
                        onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                        disabled={isPending}
                        className="w-full px-3 py-2.5 rounded-xl text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2.5 disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isPending ? "Logging out…" : "Logout"}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
