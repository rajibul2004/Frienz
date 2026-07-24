import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  User,
  Info,
  Search,
  Pin,
  Bell,
  MapPin,
  Languages,
  Calendar,
  Trash2,
  Copy,
  Reply,
  Smile,
  Image as ImageIcon,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  Clock,
  Volume2,
  VolumeX,
  Maximize2,
  Users,
  Settings,
  LogOut,
  Flag,
  Shield,
  Star,
  Download,
  Share2,
  Link as LinkIcon,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useChat } from "../hooks/useChat";
import MessageBubble from "../components/chat/MessageBubble";
import { authHooks } from "../hooks/authHooks";
import { chatApis } from "../api/chatApis";
import TypingIndicator from "../components/chat/TypingIndicator";

const Chat = () => {
  const navigate = useNavigate();
  const { id: recipientId } = useParams();

  // const [scrollDirection, setScrollDirection] = useState("down");

  const {
    recipient,
    isOnline,
    messages,
    sendMessage,
    loading: messagesLoading,
    sendTyping,
    isTyping,
    retryMessage,
  } = useChat(recipientId);
  const { user } = authHooks.useGetUser();

  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [inputMessage, setInputMessage] = useState("");

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom on new messages
  // useEffect(() => {
  //   if (scrollDirection === "down") {
  //     scrollToBottom();
  //   }
  // }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    return (
      container.scrollHeight - container.scrollTop - container.clientHeight < 80
    );
  };

  useEffect(() => {
    if (isNearBottom()) {
      const timeout = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [messages]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || inputMessage.trim() === "") return;

    sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), "h:mm a");
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((msg) => {
      const date = format(new Date(msg.createdAt), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col bg-white/5 milky:bg-gray-50/50 md:rounded-3xl md:shadow-2xl md:border md:border-white/10 milky:md:border-gray-200/50 overflow-hidden lg:max-w-4xl mx-auto h-[100dvh] md:h-[calc(100dvh-4rem)] md:my-4 z-10 w-full relative">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20 milky:to-gray-200/50 pointer-events-none z-0" />
      {/* Header */}
      <div className="flex items-center justify-between px-2 md:px-5 py-2 md:py-3 bg-white/10 milky:bg-white/70 backdrop-blur-2xl border-b border-white/10 milky:border-gray-200/60 shadow-sm h-fit z-20">
        {/* Left Section */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-1.5 md:p-2 hover:bg-secondary-theme rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="size-9 md:size-11 rounded-full active p-[2px] shadow-md bg-linear-to-br from-primary-theme to-accent">
              <img
                src={recipient?.profilePic || "/default-avatar.png"}
                alt={recipient?.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-gray-900 milky:border-white shadow-sm">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold">{recipient?.name}</h3>
            <p className="text-xs opacity-70 flex items-center gap-1">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1 md:p-2 rounded-full hidden md:flex"
          >
            <Search className="size-5" />
          </button>

          {/* Info Button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 md:p-2 rounded-full hidden md:flex"
          >
            <Info className="size-5" />
          </button>

          {/* Pinned Messages Button */}
          <button
            onClick={() => setShowPinned(!showPinned)}
            className="p-1 md:p-2 rounded-full relative hidden md:flex"
          >
            <Pin className="size-5" />
            {/* {pinnedMessages.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 active rounded-full" />
            )} */}
          </button>

          {/* Audio Call Button */}
          <button
            onClick={() => handleStartCall("audio")}
            className="p-1 md:p-2 rounded-full"
          >
            <Phone className="size-5" />
          </button>

          {/* Video Call Button */}
          <button
            onClick={() => handleStartCall("video")}
            className="p-1 md:p-2 rounded-full hidden md:flex"
          >
            <Video className="size-5" />
          </button>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 md:p-2 rounded-full"
            >
              <MoreVertical className="size-5" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-2 top-full mt-2 w-56 bg-gray-900/90 milky:bg-white/95 backdrop-blur-2xl border border-white/10 milky:border-gray-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => navigate(`/profile/${recipientId}`)}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer hover:bg-white/10 milky:hover:bg-gray-100 transition-colors text-white milky:text-gray-800"
                    >
                      <User className="w-4 h-4 text-primary-theme" />
                      View Profile
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer hover:bg-white/10 milky:hover:bg-gray-100 transition-colors text-white milky:text-gray-800">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Favorite
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer hover:bg-white/10 milky:hover:bg-gray-100 transition-colors text-white milky:text-gray-800">
                      <Bell className="w-4 h-4 text-orange-400" />
                      Mute Notifications
                    </button>
                    {/* Mobile Only Menu Items */}
                    <button onClick={() => setShowSearch(true)} className="w-full px-4 py-3 text-left text-sm flex md:hidden items-center gap-2 cursor-pointer">
                      <Search className="w-4 h-4" />
                      Search Messages
                    </button>
                    <button onClick={() => setShowInfo(true)} className="w-full px-4 py-3 text-left text-sm flex md:hidden items-center gap-2 cursor-pointer">
                      <Info className="w-4 h-4" />
                      Chat Info
                    </button>
                    <button onClick={() => setShowPinned(true)} className="w-full px-4 py-3 text-left text-sm flex md:hidden items-center gap-2 cursor-pointer">
                      <Pin className="w-4 h-4" />
                      Pinned Messages
                    </button>
                    <button onClick={() => handleStartCall("video")} className="w-full px-4 py-3 text-left text-sm flex md:hidden items-center gap-2 cursor-pointer">
                      <Video className="w-4 h-4" />
                      Video Call
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer hover:bg-white/10 milky:hover:bg-gray-100 transition-colors text-white milky:text-gray-800">
                      <Shield className="w-4 h-4 text-gray-400" />
                      Block User
                    </button>
                    <div className="border-t border-gray-400/40 my-1" />
                    <button className="w-full px-4 py-3 text-left text-sm text-red-400 bg-red-500/20 hover:bg-red-500/40 transition-colors flex items-center gap-2 cursor-pointer">
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/10 milky:border-gray-200/50 bg-black/20 milky:bg-white/40 backdrop-blur-md relative z-10"
          >
            <div className="p-3 md:p-4 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 milky:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-4 py-2 bg-white/10 milky:bg-white border border-white/20 milky:border-gray-200 rounded-xl placeholder-white/50 milky:placeholder-gray-400 focus:outline-none focus:border-primary-theme focus:ring-1 focus:ring-primary-theme transition-all text-sm"
                />
              </div>
              <button className="px-4 py-2 bg-linear-to-br from-primary-theme to-accent text-white rounded-xl shadow-md hover:shadow-lg transition-all text-sm font-medium">
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* main content */}
      <div className="  flex flex-col relative flex-1 overflow-hidden">
        <div
          ref={messagesContainerRef}
          className="flex flex-col overflow-y-auto p-4 pb-24 md:pb-28 space-y-4 no-scrollbar size-full z-10"
        >
          {messagesLoading? (
            <div className="flex items-center justify-center size-full">
              <div className="w-8 h-8 border-3  border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 && !isTyping? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20  rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-10 h-10 text-secondary-theme" />
              </div>
              <h3 className="text-lg font-semibold text-primary-theme mb-2">
                No messages yet
              </h3>
              <p className="text-secondary-theme text-sm max-w-xs">
                Send a message to start chatting with {recipient?.name}!
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-2">
                  <div className="border rounded-full px-3 text-center">
                    <span className="text-xs opacity-70">
                      {formatDateHeader(date)}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  {msgs.map((message) => (
                    <div id={`message-${message._id}`} key={message._id}>
                      <MessageBubble
                        message={message}
                        isOwn={message.from._id === user?._id}
                        onRetry={retryMessage}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          {isTyping && (
            // <div className="flex">
              <TypingIndicator name={recipient?.name} />
            // </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Pinned Messages Modal */}
        <AnimatePresence>
          {showPinned && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPinned(false)}
                className="absolute inset-0 z-40 bg-black/40 milky:bg-white/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm max-h-[80%] bg-gray-900/90 milky:bg-white/95 backdrop-blur-2xl border border-white/20 milky:border-gray-200/50 shadow-2xl z-50 flex flex-col rounded-3xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-5 border-b border-white/10 milky:border-gray-200/50">
                  <h3 className="font-bold flex items-center gap-2 milky:text-gray-900 text-white text-lg">
                    <Pin className="w-5 h-5 text-primary-theme" />
                    Pinned Messages
                  </h3>
                  <button
                    onClick={() => setShowPinned(false)}
                    className="p-1.5 hover:bg-white/10 milky:hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Pinned Messages Content */}
                  <div className="text-center text-white/50 milky:text-gray-500 py-10">
                    No pinned messages yet.
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Chat Info Modal */}
        <AnimatePresence>
          {showInfo && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInfo(false)}
                className="absolute inset-0 z-40 bg-black/40 milky:bg-white/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-gray-900/90 milky:bg-white/95 backdrop-blur-2xl border border-white/20 milky:border-gray-200/50 shadow-2xl z-50 flex flex-col rounded-3xl overflow-hidden"
              >
                {/* Header background color/gradient */}
                <div className="h-32 bg-linear-to-br from-primary-theme/80 to-accent/80 relative">
                  <button
                    onClick={() => setShowInfo(false)}
                    className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 px-6 pb-6 pt-0 relative">
                  {/* User Avatar overlapping header */}
                  <div className="text-center -mt-12 mb-4">
                    <div className="w-24 h-24 rounded-full bg-gray-900 milky:bg-white p-1.5 shadow-xl mx-auto relative">
                      <img
                        src={recipient?.profilePic || "/default-avatar.png"}
                        alt={recipient?.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                      {isOnline && (
                        <div className="absolute bottom-1 right-1 size-4 bg-green-500 rounded-full border-2 border-gray-900 milky:border-white shadow-sm"></div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mt-2 text-white milky:text-gray-900">{recipient?.name}</h3>
                    <p className="text-white/60 milky:text-gray-500 text-sm mt-0.5">
                      {recipient?.bio || "No bio yet"}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/5 milky:bg-gray-100/80 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                      <MapPin className="w-5 h-5 text-primary-theme mb-1" />
                      <p className="text-xs text-white/50 milky:text-gray-500">Location</p>
                      <p className="text-sm font-medium text-white milky:text-gray-800 line-clamp-1">{recipient?.location || "N/A"}</p>
                    </div>
                    <div className="bg-white/5 milky:bg-gray-100/80 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                      <Languages className="w-5 h-5 text-accent mb-1" />
                      <p className="text-xs text-white/50 milky:text-gray-500">Language</p>
                      <p className="text-sm font-medium text-white milky:text-gray-800 line-clamp-1">{recipient?.nativeLang || "N/A"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-white/10 milky:bg-gray-100 hover:bg-white/20 milky:hover:bg-gray-200 border border-white/10 milky:border-gray-200 transition-colors rounded-xl font-medium text-sm flex justify-center items-center gap-2 text-white milky:text-gray-800">
                      <User className="w-4 h-4" />
                      View Full Profile
                    </button>
                    <button className="w-full py-3 bg-red-500/10 milky:bg-red-50 text-red-500 hover:bg-red-500/20 milky:hover:bg-red-100 transition-colors border border-red-500/20 milky:border-red-200 rounded-xl font-medium text-sm flex justify-center items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Block & Clear History
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 w-full p-2 md:p-4 z-20 bg-linear-to-t from-gray-900/80 milky:from-white/80 to-transparent pointer-events-none flex justify-center">
        <div className="flex items-center gap-1 md:gap-2 bg-white/10 milky:bg-white/90 backdrop-blur-2xl border border-white/20 milky:border-gray-300 shadow-2xl rounded-3xl p-1 md:p-1.5 w-full max-w-3xl pointer-events-auto">
          {/* Attach Button */}
          <button className="p-2 md:p-2.5 rounded-full hidden sm:flex hover:bg-white/10 milky:hover:bg-gray-100 text-white/70 milky:text-gray-500 transition-colors">
            <Paperclip className="size-5" />
          </button>
          <input
            type="file"
            accept="image/*,video/*,application/pdf"
            className="hidden"
          />

          {/* Image Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 md:p-2.5 rounded-full hover:bg-white/10 milky:hover:bg-gray-100 text-white/70 milky:text-gray-500 transition-colors"
          >
            <ImageIcon className="size-5" />
          </button>

          {/* Emoji Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 md:p-2.5 rounded-full hover:bg-white/10 milky:hover:bg-gray-100 text-white/70 milky:text-gray-500 transition-colors"
            >
              <Smile className="size-5" />
            </button>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="absolute bottom-[calc(100%+1rem)] left-0 md:-left-4 z-50 shadow-2xl"
                >
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setInputMessage((prev) => prev + emojiData.emoji);
                    }}
                    theme="auto"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message Input */}
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              sendTyping?.();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Message..."
            rows={1}
            className="flex-1 bg-transparent text-white milky:text-gray-800 placeholder-white/50 milky:placeholder-gray-400 resize-none max-h-24 px-3 py-2.5 outline-none no-scrollbar text-sm md:text-base"
            style={{ minHeight: "40px" }}
          />

          {/* Voice Button */}
          <button className="p-2 md:p-2.5 rounded-full text-white/70 milky:text-gray-500 hover:bg-white/10 milky:hover:bg-gray-100 transition-colors">
            <Mic className="size-5" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            className="p-2 md:p-2.5 rounded-full bg-linear-to-br from-primary-theme to-accent text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Send className="size-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
