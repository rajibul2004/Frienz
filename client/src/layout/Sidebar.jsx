import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  Users,
  BellIcon,
  LogOutIcon,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { authHooks } from "../hooks/authHooks";

const NAV_ITEMS = [
  { path: "/",             icon: HomeIcon,       label: "Home" },
  { path: "/friends",      icon: Users,          label: "Friends" },
  { path: "/notification", icon: BellIcon,       label: "Notifications" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = authHooks.useGetUser();
  const { isPending, logoutMutation } = authHooks.useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation();
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <aside className="group/sidebar fixed top-16 left-0 h-[calc(100vh-4rem)] z-20 flex flex-col
      w-[4.5rem] hover:w-56 transition-all duration-300 ease-in-out overflow-hidden
      backdrop-blur-xl bg-white/[0.04] milky:bg-white/70
      border-r border-white/[0.08] milky:border-gray-200/80
      shadow-xl shadow-black/5">

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 px-2 pt-5">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl w-full
                transition-all duration-200 group/item cursor-pointer text-left
                ${isActive
                  ? "active shadow-lg text-white"
                  : "text-white/55 milky:text-gray-500 hover:bg-white/10 milky:hover:bg-gray-100 hover:text-white milky:hover:text-gray-800"
                }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0 transition-transform group-hover/item:scale-110" />
              <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 overflow-hidden">
                {label}
              </span>
              {/* Active pill indicator */}
              {isActive && (
                <motion.span
                  layoutId="sidebarActivePill"
                  className="absolute right-2 w-1 h-4 rounded-full bg-white/60"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section: avatar + logout */}
      <div className="px-2 pb-5 flex flex-col gap-1">
        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl w-full
            transition-all duration-200 cursor-pointer text-left
            ${location.pathname === "/profile"
              ? "bg-white/10 milky:bg-gray-100"
              : "hover:bg-white/10 milky:hover:bg-gray-100"
            }`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-7 h-7 rounded-full active p-[1.5px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                <img
                  src={user?.profilePic || "/default-avatar.png"}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
              </div>
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-gray-900/50 shadow-sm" />
          </div>
          <div className="overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            <p className="text-sm font-semibold text-white milky:text-gray-800 truncate max-w-[120px]">
              {user?.name || "My Profile"}
            </p>
            <p className="text-[10px] text-emerald-400 font-medium">● Online</p>
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl w-full
            text-red-400 hover:bg-red-500/10 hover:text-red-300
            transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <LogOutIcon className="w-[18px] h-[18px] shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            {isPending ? "Logging out…" : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
