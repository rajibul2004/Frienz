import React from "react";
import NoNotificationFound from "../components/common/NoNotificationFound";
import {
  BellIcon,
  ClockIcon,
  MapPin,
  MessageSquareIcon,
  UserCheckIcon,
  UserPlus,
  CheckCircle,
  Loader2,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { connectionHooks } from "../hooks/connectionHooks";

import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const { isLoading: isGetting, requests } = connectionHooks.useGetIncomingFR();
  const { error, isPending, acceptMutation } = connectionHooks.useAcceptFR();

  const incomingRequests = requests?.incoming || [];
  const acceptedRequests = requests?.accepted || [];

  const handleAccept = (requestId) => {
    acceptMutation(requestId);
  };

  const handleChatNavigate = (userId) => {
    navigate(`/chat/${userId}`);
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 active rounded-xl">
            <BellIcon className="w-5 h-5 " />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold ">Notifications</h1>
        </div>
        <p className="text-white/60 milky:text-gray-900/60 text-sm ml-12">
          Stay updated with your friend requests and connections
        </p>
      </motion.div>

      {/* Loading State */}
      {isGetting ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-white/40 milky:text-gray-900/40">
            Loading notifications...
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Friend Requests Section */}
          {incomingRequests.count > 0 && (
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 active rounded-lg">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold">Friend Requests</h2>
                </div>
                <span className="px-2 py-1 text-xs active  rounded-full">
                  {incomingRequests.count} new
                </span>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {incomingRequests.requests?.map((request) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-xl hover:bg-white/10 milky:hover:bg-gray-400/10  transition-all duration-300"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 sm:gap-4">
                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full active p-0.5">
                                <div className="w-full h-full rounded-full bg-base-200 overflow-hidden">
                                  <img
                                    src={
                                      request.sender.profilePic ||
                                      "/default-avatar.png"
                                    }
                                    alt={request.sender.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/150";
                                    }}
                                  />
                                </div>
                              </div>
                              {/* Online indicator (optional) */}
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white/10 milky:border-gray-900/10"></div>
                            </div>

                            {/* User Info */}
                            <div>
                              <h3 className="font-semibold">
                                {request.sender.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {request.sender.location && (
                                  <span className="flex items-center gap-1 text-xs text-white/40 milky:text-gray-900/40">
                                    <MapPin size={10} />
                                    {request.sender.location}
                                  </span>
                                )}
                                {request.sender.nativeLang && (
                                  <span className="px-2 py-0.5 text-xs active rounded-full">
                                    {request.sender.nativeLang}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Accept Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAccept(request._id)}
                            disabled={isPending}
                            className="px-4 py-2 btn-primary-theme cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Accept
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* New Connections Section */}
          {acceptedRequests.count > 0 && (
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 active rounded-lg">
                  <Users className="w-4 h-4 " />
                </div>
                <h2 className="text-lg font-semibold">New Connections</h2>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {acceptedRequests.requests?.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-xl hover:bg-white/10 milky:hover:bg-gray-400/10 transition-all duration-300"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full active p-0.5">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                  <img
                                    src={
                                      notification.recipient.profilePic ||
                                      "/default-avatar.png"
                                    }
                                    alt={notification.recipient.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Notification Content */}
                            <div>
                              <h3 className="font-semibold ">
                                {notification.recipient.name}
                              </h3>
                              <p className="text-sm text-white/60 milky:text-gray-900/60">
                                accepted your friend request
                              </p>
                              <div className="flex items-center gap-1 text-xs text-white/40 milky:text-gray-900/40 mt-1">
                                <ClockIcon size={12} />
                                <span>recently</span>
                              </div>
                            </div>
                          </div>

                          {/* Chat Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleChatNavigate(notification.recipient._id)
                            }
                            className="px-3 py-1.5 btn-primary-theme text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-1"
                          >
                            <MessageSquareIcon size={12} />
                            Message
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* Empty State */}
          {incomingRequests.count === 0 && acceptedRequests.count === 0 && (
            <motion.div variants={itemVariants} className="col-span-full">
              <NoNotificationFound />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Notification;
