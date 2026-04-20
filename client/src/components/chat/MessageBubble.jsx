import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCheck,
  Copy,
  Reply,
  Trash2,
  Smile,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const MessageBubble = ({ message, isOwn }) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reaction, setReaction] = useState(null);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return format(date, "h:mm a");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message);
    toast.success("Message copied!");
    setShowActions(false);
  };

  // Message type rendering
  const renderMessageContent = () => {
    switch (message.type) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={message.message}
              alt="Shared image"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.message, "_blank")}
            />
          </div>
        );
      case "file":
        return (
          <div className="flex items-center gap-2 p-2 bg-card-theme rounded-lg">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Trash2 className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-theme truncate">
                {message.fileName || "File"}
              </p>
              <p className="text-xs text-secondary-theme">
                {message.fileSize || "Unknown size"}
              </p>
            </div>
            <button
              onClick={() => window.open(message.message, "_blank")}
              className="p-1.5 bg-accent text-white rounded-lg text-xs"
            >
              Download
            </button>
          </div>
        );
      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
        );
    }
  };

  const getStatusIcon = () => {
    if (!isOwn) return null;

    // Failed message - show retry button
    if (message.failed) {
      return (
        <button
          onClick={handleRetry}
          className="text-error hover:text-error/80 transition-colors ml-1"
          title="Retry sending"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      );
    }

    if (message.status==="pending") {
      return (
        <div className="w-3 h-3 rounded-full border border-gray-400 animate-spin ml-1" />
      );
    }
    if (message.status === "read") {
      return <CheckCheck className="w-3 h-3 link-text ml-1" />;
    }
    if (message.status === "delivered") {
      return <CheckCheck className="w-3 h-3 ml-1" />;
    }
    return <Check className="w-3 h-3 ml-1" />;
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => setShowActions((prev) => !prev)}
    >
      <div className="relative max-w-[70%]">
        {/* Main Message Bubble */}
        <div
          className={`relative rounded-2xl px-3 py-1 shadow-sm transition-all ${
            isOwn
              ? `active rounded-br-sm ${message.failed ? "opacity-70" : ""}`
              : "bg-white/5 milky:bg-gray-400/60 border border-white/40 milky:border-gray-900/40 rounded-bl-sm"
          }`}
        >
          {/* Sender Name (for group chats) */}
          {!isOwn && message.from?.name && (
            <p className="text-[10px] font-semibold link-text mb-0.1">
              {message.from.name}
            </p>
          )}

          {/* Message Content */}
          {renderMessageContent()}

          {/* Message Metadata */}
          <div
            className={`flex items-center gap-0.5 mt-0.5 ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-[8px] opacity-70">
              {formatTime(message.createdAt)}
            </span>
            {getStatusIcon()}
          </div>
        </div>

        {/* Message Actions (on hover) - Don't show for failed messages */}
        {!message.failed && showActions && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute top-1/5 -translate-y-1/5 flex gap-1 ${
                isOwn ? "-left-30" : "-right-22"
              }`}
            >
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="p-1.5 bg-card-theme border border-theme rounded-full cursor-pointer transition-colors hover:bg-secondary-theme"
                title="Copy"
              >
                <Copy className="w-3 h-3" />
              </button>

              {/* Reaction Button */}
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1.5 bg-card-theme border border-theme rounded-full cursor-pointer transition-colors hover:bg-secondary-theme"
                  title="React"
                >
                  <Smile className="w-3 h-3" />
                </button>

                {/* Reactions Popup */}
                <AnimatePresence>
                  {showReactions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className={`absolute bottom-full mb-2 flex gap-1 p-1 bg-card-theme border border-theme rounded-full shadow-lg ${
                        isOwn ? "right-0" : "left-0"
                      }`}
                    >
                      {[
                        "❤️",
                        "😂",
                        "😮",
                        "😢",
                        "👍",
                        "👎",
                        "🎉",
                        "🔥",
                        "😍",
                      ].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setShowReactions(false);
                            setReaction(emoji);
                            // Call reaction callback if provided
                            if (message.onReact) {
                              message.onReact(message._id, emoji);
                            }
                            toast.success(`Reacted with ${emoji}`);
                          }}
                          className="p-1 hover:bg-secondary-theme rounded-full transition-colors text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delete Button (only for own messages) */}
              {isOwn && (
                <button
                  className="p-1.5 bg-card-theme border border-theme rounded-full cursor-pointer transition-colors hover:bg-error/10 hover:border-error/30"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-error" />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
