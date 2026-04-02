import React, { useEffect,useState } from "react";
import {
  BellIcon,
  HomeIcon,
  Users,
  LogOutIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { authHooks } from "../hooks/authHooks";

const Sidebar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = authHooks.useGetUser();
  const { isPending, logoutMutation } = authHooks.useLogout();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const currentPath = window.location.pathname;

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await logoutMutation();
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/friends", icon: Users, label: "Friends" },
    { path: "/notification", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <aside
      className={`
            bg-base-200/50 backdrop-blur-md border-r border-white/10 milky:border-gray-900/10
            h-[calc(100vh-4rem)] sticky top-16 left-0 z-20 transition-all duration-300
            ${isCollapsed ? "w-20" : "w-64"}
        `}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-2 btn-primary-theme p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation and Profile Container */}
      <div className="flex flex-col h-full justify-between py-6 ">
        {/* Navigation Links */}
        <nav className="space-y-2 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                    transition-all duration-300 group relative
                                    ${
                                      isActive
                                        ? "active shadow-lg cursor-not-allowed"
                                        : "hover:bg-white/10 text-white/60 milky:text-gray-900/60 hover:text-white milky:hover:text-gray-900 cursor-pointer"
                                    }
                                `}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110}`}
                />

                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}

                {/* Active Indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="px-3 mt-auto">
          {/* User Profile Button */}
          <button
            onClick={() => handleNavigation("/profile")}
            className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                            transition-all duration-300 hover:bg-white/10 group
                            ${currentPath === "/profile" ? "bg-white/10" : ""}
                        `}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full active p-0.5">
                <div className="w-full h-full rounded-full bg-base-200 overflow-hidden">
                  <img
                    src={user?.profilePic || "/default-avatar.png"}
                    alt={user?.name || "Profile"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
              </div>
              {/* Online Indicator */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white/10 animate-pulse"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate max-w-30">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Online
                </p>
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mt-2
                                 hover:bg-red-500/10 text-red-400 hover:text-red-300
                                 transition-all duration-300 group cursor-pointer disabled:cursor-not-allowed disabled:text-red-400/60 disabled:hover:bg-transparent"
          >
            <LogOutIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            {!isCollapsed && (
              <span className="text-sm font-medium">
                {isPending ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
