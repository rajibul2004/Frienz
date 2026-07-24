import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
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

const MessageBubble = ({ message, isOwn, onRetry }) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showFullPicker, setShowFullPicker] = useState(false);
  const [reaction, setReaction] = useState(null);

  const handleRetry = () => {
    onRetry?.(message._id);
  };

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
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => setShowActions((prev) => !prev)}
    >
      <div className="relative max-w-[70%]">
        {/* Main Message Bubble */}
        <div
          className={`relative px-4 py-2 shadow-md transition-all ${
            isOwn
              ? `bg-linear-to-br from-primary-theme to-accent text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm ${
                  message.failed ? "opacity-70" : ""
                }`
              : "bg-white/10 milky:bg-white/80 backdrop-blur-md border border-white/20 milky:border-gray-200 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm"
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
            className={`flex items-center gap-1 mt-1 ${
              isOwn ? "justify-end text-white/80" : "justify-start text-white/60 milky:text-gray-500"
            }`}
          >
            <span className="text-[10px] font-medium tracking-wide">
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
              className={`absolute -top-10 flex gap-1 z-50 p-1 bg-card-theme border border-white/20 milky:border-gray-200 rounded-full shadow-lg ${
                isOwn ? "right-0" : "left-0"
              }`}
            >
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="p-1.5 bg-card-theme border border-theme rounded-full cursor-pointer transition-colors hover:bg-secondary-theme"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>

              {/* Reaction Button */}
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1.5 bg-card-theme border border-theme rounded-full cursor-pointer transition-colors hover:bg-secondary-theme"
                  title="React"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {/* Reactions Popup */}
                <AnimatePresence>
                  {showReactions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className={`absolute bottom-full mb-2 flex gap-1 p-1 bg-card-theme border border-theme rounded-full shadow-xl z-[60] overflow-x-auto max-w-[80vw] no-scrollbar ${
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
                      <button
                        onClick={() => setShowFullPicker(!showFullPicker)}
                        className="p-1 hover:bg-secondary-theme rounded-full transition-colors text-lg flex items-center justify-center w-8 h-8 text-white/50"
                      >
                        +
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showFullPicker && showReactions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className={`absolute bottom-full mb-14 z-[70] shadow-2xl ${
                        isOwn ? "right-0" : "left-0"
                      }`}
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) => {
                          setShowFullPicker(false);
                          setShowReactions(false);
                          setReaction(emojiData.emoji);
                          if (message.onReact) {
                            message.onReact(message._id, emojiData.emoji);
                          }
                          toast.success(`Reacted with ${emojiData.emoji}`);
                        }}
                        theme="auto"
                      />
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
                  <Trash2 className="w-4 h-4 text-error" />
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
