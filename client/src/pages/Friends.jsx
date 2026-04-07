import React from "react";
import {
  MapPin,
  MessageSquareIcon,
  Users,
  MoreVertical,
  Loader2,
  UserPlus,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { connectionHooks } from "../hooks/connectionHooks";
import NoFriendsFound from "../components/connection/NoFriendsFound";
import { useNavigate } from "react-router-dom";

const Friends = () => {
    const navigate =useNavigate();
  const { isLoading: isFriendsLoading, friends } =connectionHooks.useGetFriends();

  const handleChatNavigate = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  const handleProfileNavigate = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 active rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Your Friends
                </h1>
                <p className="text-white/60 milky:text-gray-900/60 text-sm mt-1">
                  Connect and chat with your friends
                </p>
              </div>
            </div>

            {/* Friend count */}
            {!isFriendsLoading && friends.length > 0 && (
              <div className="px-3 py-1.5 active rounded-xl">
                <span className="text-xs text-center text-white/80 milky:text-gray-900/80">
                  {friends.length} {friends.length === 1 ? "friend" : "friends"}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {isFriendsLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="w-10 h-10 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-white/40 milky:text-gray-900/40 mt-4">Loading your friends...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {friends.length === 0 ? (
              <motion.div variants={itemVariants} className="col-span-full">
                <NoFriendsFound />
              </motion.div>
            ) : (
              <AnimatePresence>
                {friends.map((friend) => (
                  <motion.div
                    key={friend._id}
                    variants={itemVariants}
                    layout
                    className="group bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-xl hover:bg-white/10 milky:hover:bg-gray-400/10 transition-all duration-300"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Left section - User info */}
                        <div className="flex items-center gap-3 flex-1">
                          {/* Avatar with gradient border */}
                          <div className="relative">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full active p-0.5">
                              <div className="w-full h-full rounded-full  overflow-hidden">
                                <img
                                  src={
                                    friend.profilePic || "/default-avatar.png"
                                  }
                                  alt={friend.name}
                                  className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                                  onClick={() =>
                                    handleProfileNavigate(friend._id)
                                  }
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/150";
                                  }}
                                />
                              </div>
                            </div>
                            {/* Online indicator - you can add logic for online status */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white/10"></div>
                          </div>

                          {/* User details */}
                          <div className="flex-1">
                            <h3
                              className="text-base sm:text-lg font-semibold "
                              onClick={() => handleProfileNavigate(friend._id)}
                            >
                              {friend.name}
                            </h3>

                            <div className="flex items-center gap-3 mt-1">
                              {friend.location && (
                                <span className="flex items-center gap-1 text-xs text-white/40 milky:text-gray-900/40">
                                  <MapPin size={12} />
                                  {friend.location}
                                </span>
                              )}
                            </div>

                            {/* Language badges */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {friend.nativeLang && (
                                <span className="px-2 py-0.5 text-xs active rounded-full">
                                  {friend.nativeLang}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right section - Actions */}
                        <div className="flex items-center gap-2">
                          {/* Message button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChatNavigate(friend._id)}
                            className="p-2 sm:px-4 sm:py-2 btn-primary-theme rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 shadow-lg shadow-indigo-500/25"
                          >
                            <MessageSquareIcon
                              size={16}
                            />
                            <span className="hidden sm:inline text-sm  font-medium">
                              Message
                            </span>
                          </motion.button>

                          {/* More options button */}
                          <div className="relative">
                            <button
                              className="p-2 hover:bg-white/10 milky:hover:bg-gray-900/10 rounded-lg transition-colors"
                              onClick={() => {
                                // Add dropdown logic here if needed
                              }}
                            >
                              <MoreVertical
                                size={18}
                                className="text-white/40 milky:text-gray-900/40 group-hover:text-white/60 milky:group-hover:text-gray-900/60 transition-colors"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Add friend status or last active if available */}
                      {friend.lastActive && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <span className="text-xs text-white/40">
                            Last active:{" "}
                            {new Date(friend.lastActive).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {/* Add Friend Button - Floating action button */}
        {!isFriendsLoading && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="fixed bottom-8 right-8 p-4 active rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/75 transition-all duration-300 group"
            title="Find new friends"
          >
            <UserPlus className="w-6 h-6  group-hover:rotate-90 transition-transform duration-300" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Friends;
