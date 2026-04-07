import React, { useState } from "react";
import { BellIcon, LogOutIcon, Home, User, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ThemeSelector from "../components/common/ThemeSelector";
import { authHooks } from "../hooks/authHooks";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {
    user,
    isLoading: userLoading,
    isAuthenticated,
  } = authHooks.useGetUser();
  const { error, isPending, logoutMutation } = authHooks.useLogout();

  const currentPath = window.location.pathname;
  const isLogin = currentPath?.startsWith("/login");
  const isSignup = currentPath?.startsWith("/signup");
  const isVerifyPage = currentPath?.startsWith("/verify");
  const isReset = currentPath?.startsWith("/reset-password")

  const handleLogout = async () => {
    try {
      await logoutMutation();
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const publicPages = isLogin || isVerifyPage || isSignup || isReset;

  return (
    <nav className="bg-base-200/50 backdrop-blur-md border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => !publicPages && handleNavigation("/")}
            className="hover:opacity-80 transition-opacity"
          >
            <img src={assets.logo} alt="Frienz" className="h-8 w-auto" />
          </button>

          {/* Right side icons */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            {!publicPages && (
              <button
                onClick={() => handleNavigation("/notification")}
                className="p-2 hover:bg-base-300 rounded-xl transition-all duration-300 group relative"
                title="Notifications"
              >
                <BellIcon className="w-5 h-5 text-base-content/60 group-hover:text-base-content group-hover:scale-110 transition-all" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
            )}

            {/* Theme Selector */}
            <div className="p-2 hover:bg-base-300 rounded-xl transition-all duration-300">
              <ThemeSelector />
            </div>

            {/* Profile with Dropdown */}
            {!publicPages && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1  rounded-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full active p-0.5">
                    <div className="w-full h-full rounded-full bg-base-200 overflow-hidden">
                      <img
                        src={user?.profilePic || "/default-avatar.png"}
                        alt={user?.name || "Profile"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-base-content/40 ${showProfileMenu ? 'rotate-180' : ''} transition-colors`} />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-pointer"
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <div className="bg-gray-900 milky:bg-white absolute right-0 mt-2 w-56  backdrop-blur-xl border rounded-xl shadow-2xl overflow-hidden z-50">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-base-300">
                        <p className="text-sm font-medium text-base-content">
                          {user?.name}
                        </p>
                        <p className="text-xs text-base-content/40 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleNavigation("/profile");
                        }}
                        className="w-full px-4 py-3 cursor-pointer text-left text-sm text-base-content/80 hover:bg-base-300 transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleNavigation("/");
                        }}
                        className="w-full px-4 py-3 cursor-pointer text-left text-sm text-base-content/80 hover:bg-base-300 transition-colors flex items-center gap-2"
                      >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </button>

                      <div className="border-t border-base-300 my-1"></div>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-3 cursor-pointer text-left text-sm text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        disabled={isPending}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        <span>{isPending ? "Logging out..." : "Logout"}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
