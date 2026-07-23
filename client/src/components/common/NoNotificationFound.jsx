import { BellIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const NoNotificationFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      {/* Bell icon in gradient circle */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
        className="relative mb-5"
      >
        {/* Outer glow ring */}
        <div className="w-24 h-24 rounded-full active opacity-20 absolute inset-0 blur-xl" />
        {/* Main circle */}
        <div className="relative w-20 h-20 rounded-full active p-0.5 shadow-xl">
          <div className="w-full h-full rounded-full bg-gray-900/60 milky:bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <BellIcon className="w-9 h-9 text-white milky:text-gray-700" />
          </div>
        </div>

        {/* Sparkle dots */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-400 shadow-md"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-0.5 -left-1 w-2 h-2 rounded-full bg-blue-400 shadow-md"
        />
      </motion.div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white milky:text-gray-800 mb-2">
        All caught up!
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-white/50 milky:text-gray-500 max-w-xs leading-relaxed">
        No notifications yet — when someone sends you a request, it'll appear here.
      </p>
    </motion.div>
  );
};

export default NoNotificationFound;
