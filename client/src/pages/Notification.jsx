import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  MapPin,
  MessageSquareIcon,
  UserCheckIcon,
  UserPlus,
  CheckCircle,
  Loader2,
  UserCheck,
  MessageCircle,
  Clock,
  Zap,
} from "lucide-react";
import { connectionHooks } from "../hooks/connectionHooks";
import { useSocket } from "../context/SocketContext";
import NoNotificationFound from "../components/common/NoNotificationFound";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const typeConfig = {
  friend_request: {
    icon: UserPlus,
    color: "bg-violet-500",
    label: "Friend Request",
  },
  friend_accepted: {
    icon: UserCheck,
    color: "bg-emerald-500",
    label: "Accepted",
  },
  message: {
    icon: MessageCircle,
    color: "bg-blue-500",
    label: "Message",
  },
};

// ─────────────────────────────────────────────
// Friend Request Card (API data)
// ─────────────────────────────────────────────
const FriendRequestCard = ({ request, onAccept, isPending }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="group relative flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-white/5 milky:bg-white/60 backdrop-blur-sm border border-white/10 milky:border-gray-200 hover:bg-white/10 milky:hover:bg-gray-50 transition-all duration-200"
  >
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      <div className="w-13 h-13 rounded-full active p-0.5">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
          <img
            src={request.sender?.profilePic || "/default-avatar.png"}
            alt={request.sender?.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
        </div>
      </div>
      {/* Type badge */}
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
        <UserPlus className="w-2.5 h-2.5 text-white" />
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm text-white milky:text-gray-800 truncate">
            {request.sender?.name}
          </p>
          <p className="text-xs text-white/60 milky:text-gray-500 mt-0.5">
            sent you a friend request
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {request.sender?.location && (
              <span className="flex items-center gap-1 text-[11px] text-white/40 milky:text-gray-400">
                <MapPin className="w-2.5 h-2.5" />
                {request.sender.location}
              </span>
            )}
            {request.sender?.nativeLang && (
              <span className="px-2 py-0.5 text-[11px] active rounded-full font-medium">
                {request.sender.nativeLang}
              </span>
            )}
          </div>
          {request.sender?.bio && (
            <p className="text-[11px] text-white/40 milky:text-gray-400 mt-1 line-clamp-1">
              {request.sender.bio}
            </p>
          )}
        </div>

        {/* Accept button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAccept(request._id)}
          disabled={isPending}
          className="flex-shrink-0 px-3 py-1.5 btn-primary-theme text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Accept
            </>
          )}
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// Activity Notification Card (real-time)
// ─────────────────────────────────────────────
const ActivityCard = ({ notif, onNavigate }) => {
  const cfg = typeConfig[notif.type] || typeConfig.message;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`group relative flex items-start gap-3 sm:gap-4 p-4 rounded-2xl backdrop-blur-sm border transition-all duration-200 ${
        notif.read
          ? "bg-white/5 milky:bg-white/60 border-white/10 milky:border-gray-200"
          : "bg-white/[0.08] milky:bg-white/80 border-white/20 milky:border-violet-200"
      } hover:bg-white/10 milky:hover:bg-gray-50`}
    >
      {/* Unread dot */}
      {!notif.read && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full active p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
            <img
              src={notif.avatar || "/default-avatar.png"}
              alt={notif.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${cfg.color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-2 h-2 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white milky:text-gray-800 truncate">
              {notif.title}
            </p>
            <p className="text-xs text-white/60 milky:text-gray-500 mt-0.5 line-clamp-2">
              {notif.body}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1 text-[11px] text-white/35 milky:text-gray-400">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo(notif.createdAt)}
              </span>
              <span className={`px-1.5 py-0.5 text-[10px] ${cfg.color} bg-opacity-20 text-white milky:text-white rounded-full font-medium`}>
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Action button */}
          {(notif.type === "message" || notif.type === "friend_accepted") && notif.data?.senderId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(`/chat/${notif.data.senderId}`)}
              className="flex-shrink-0 px-2.5 py-1.5 btn-primary-theme text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              Chat
            </motion.button>
          )}
          {notif.type === "friend_accepted" && notif.data?.acceptedBy?._id && !notif.data?.senderId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(`/chat/${notif.data.acceptedBy._id}`)}
              className="flex-shrink-0 px-2.5 py-1.5 btn-primary-theme text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              Message
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Main Notification Page
// ─────────────────────────────────────────────
const TABS = ["Friend Requests", "Activity"];

const Notification = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Friend Requests");

  const { isLoading, requests } = connectionHooks.useGetIncomingFR();
  const { isAcceptPending, acceptMutation } = connectionHooks.useAcceptFR();
  const { notifications, markAllRead } = useSocket();

  const incomingRequests = requests?.incoming?.requests || [];
  const incomingCount = requests?.incoming?.count || 0;
  const activityCount = notifications.length;

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const handleAccept = (requestId) => {
    acceptMutation(requestId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 active rounded-xl shadow-lg">
            <BellIcon className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
        </div>
        <p className="text-white/50 milky:text-gray-500 text-sm ml-12">
          Stay updated with friend requests and real-time activity
        </p>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/5 milky:bg-gray-100 border border-white/10 milky:border-gray-200 mb-6">
        {TABS.map((tab) => {
          const count = tab === "Friend Requests" ? incomingCount : activityCount;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "btn-primary-theme shadow-md"
                  : "text-white/60 milky:text-gray-500 hover:text-white milky:hover:text-gray-700 hover:bg-white/5 milky:hover:bg-white/60"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center ${
                  isActive ? "bg-white/20 text-white" : "bg-white/10 milky:bg-gray-200 text-white/70 milky:text-gray-600"
                }`}>
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {/* Friend Requests Tab */}
        {activeTab === "Friend Requests" && (
          <motion.div
            key="friend-requests"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-white/40 milky:text-gray-400" />
                <p className="text-sm text-white/40 milky:text-gray-400">Loading requests…</p>
              </div>
            ) : incomingRequests.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {incomingRequests.map((request) => (
                    <FriendRequestCard
                      key={request._id}
                      request={request}
                      onAccept={handleAccept}
                      isPending={isAcceptPending}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <NoNotificationFound />
            )}
          </motion.div>
        )}

        {/* Activity Tab */}
        {activeTab === "Activity" && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {notifications.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {notifications.map((notif) => (
                    <ActivityCard
                      key={notif.id}
                      notif={notif}
                      onNavigate={navigate}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <NoNotificationFound />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
