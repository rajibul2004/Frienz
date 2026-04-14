import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useChat } from "../hooks/useChat";

const Chat = () => {
  const navigate = useNavigate();
  const { id: recipientId } = useParams();

  const { recipient, isOnline, messages, sendMessage } = useChat(recipientId);

  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPinned, setShowPinned] = useState(false);

  const [inputMessage, setInputMessage] = useState("");

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || inputMessage.trim() === "") return;

    sendMessage(inputMessage, recipientId);
    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className=" flex flex-col justify-between bg-white/10 milky:bg-gray-900/10 overflow-hidden  lg:max-w-4xl mx-auto h-full z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-2 md:px-4 py-1.5 md:py-3 bg-white/20 milky:bg-gray-900/20 backdrop-blur-md border-b border-white/30 milky:border-gray-900/30 shadow-sm h-fit">
        {/* Left Section */}
        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-secondary-theme rounded-xl transition-colors hidden md:inline"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="size-8 md:size-10 rounded-full active p-0.5">
              <img
                src={recipient?.profilePic || "/default-avatar.png"}
                alt={recipient?.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-card-theme animate-pulse" />
            )}
          </div>

          <div>
            <h3 className="font-semibold">{recipient?.name}</h3>
            <p className="text-xs text-secondary-theme flex items-center gap-1">
              {isOnline ? <>Online</> : <>Offline</>}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1 md:p-2 rounded-full"
          >
            <Search className="size-3 md:size-5" />
          </button>

          {/* Info Button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 md:p-2 rounded-full"
          >
            <Info className="size-3 md:size-5" />
          </button>

          {/* Pinned Messages Button */}
          <button
            onClick={() => setShowPinned(!showPinned)}
            className="p-1 md:p-2 rounded-full relative"
          >
            <Pin className="size-3 md:size-5" />
            {/* {pinnedMessages.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 active rounded-full" />
            )} */}
          </button>

          {/* Audio Call Button */}
          <button
            onClick={() => handleStartCall("audio")}
            className="p-1 md:p-2 rounded-full"
          >
            <Phone className="size-3 md:size-5" />
          </button>

          {/* Video Call Button */}
          <button
            onClick={() => handleStartCall("video")}
            className="p-1 md:p-2 rounded-full"
          >
            <Video className="size-3 md:size-5" />
          </button>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 md:p-2 rounded-full"
            >
              <MoreVertical className="size-3 md:size-5" />
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
                    className="fixed right-4 top-10 md:top-14 md:right-8 w-56 active rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <button
                      onClick={() => navigate(`/profile/${recipientId}`)}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer">
                      <Star className="w-4 h-4" />
                      Favorite
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer">
                      <Bell className="w-4 h-4" />
                      Mute Notifications
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 cursor-pointer">
                      <Shield className="w-4 h-4" />
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
            className="border-b border-white/30 milky:border-gray-900/30"
          >
            <div className="p-3 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-4 py-2  border border-white/30 milky:border-gray-900/30 rounded-xl placeholder-white/60 milky:placeholder-gray-900/60 focus:outline-none focus:border-white milky:focus:border-gray-900"
                />
              </div>
              <button className="px-4 py-2 btn-primary-theme rounded-xl  transition-colors">
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* main content */}
      <div className="size-full flex flex-col relative flex-1 overflow-hidden">
        <div
          ref={messagesContainerRef}
          className="flex flex-col overflow-y-auto p-4 space-y-4 no-scrollbar "
        >
          {messages.length === 0 ? (
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
            messages.map((msg) => (
              <div className="flex flex-col gap-2">
                <p className="text-sm">{msg}</p>
              </div>
            ))
          )}
        </div>
        {/* Pinned Messages Sidebar */}
        <AnimatePresence>
          {showPinned && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 active border-l border-white/10 shadow-xl z-30 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-900/30 milky:border-white/30">
                <h3 className="font-semibold flex items-center gap-2 milky:text-gray-900 text-white">
                  <Pin className="w-4 h-4" />
                  Pinned Messages
                </h3>
                <button
                  onClick={() => setShowPinned(false)}
                  className="p-1 hover:bg-secondary-theme rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-primary-theme" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Pinned Messages */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Chat Info Sidebar */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 active border-l border-white/10 shadow-xl z-30 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-900/30 milky:border-white/30">
                <h3 className="font-semibold milky:text-gray-900 text-white">Chat Info</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-linear-to-r from-gray-400 to-slate-400 p-1 mx-auto mb-3">
                    <img
                      src={recipient?.profilePic || "/default-avatar.png"}
                      alt={recipient?.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">
                    {recipient?.name}
                  </h3>
                  <p className="text-white/60 milky:text-gray-900/60 text-sm">
                    {recipient?.bio || "No bio yet"}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3">
                    <MapPin className="w-4 h-4 text-white/60 milky:text-gray-900/60" />
                    <div>
                      <p className="text-xs text-white/60 milky:text-gray-900/60">Location</p>
                      <p className="text-sm ">
                        {recipient?.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3">
                    <Languages className="w-4 h-4 text-white/60 milky:text-gray-900/60" />
                    <div>
                      <p className="text-xs text-white/60 milky:text-gray-900/60">Language</p>
                      <p className="text-sm ">
                        {recipient?.nativeLang || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 ">
                    <Calendar className="w-4 h-4 text-white/60 milky:text-gray-900/60" />
                    <div>
                      <p className="text-xs text-white/60 milky:text-gray-900/60">
                        Member Since
                      </p>
                      <p className="text-sm text-primary-theme">
                          {recipient?.memberSince}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2">
                  <button className="w-full py-2 bg-gray-400/60 rounded-xl">
                    Share Contact
                  </button>
                  <button className="w-full py-2 bg-red-400/20 text-red-500 rounded-xl hover:bg-red-400/40 transition-colors cursor-pointer">
                    Clear Chat History
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/30 milky:border-gray-900/30 shadow-sm  bg-white/20 milky:bg-gray-900/20 backdrop-blur-md p-1.5 md:p-3 h-fit">
        <div className="flex items-center gap-1">
          {/* Attach Button */}
          <button className="p-1 md:p-2 rounded-xl">
            <Paperclip className="size-3 md:size-5" />
          </button>
          <input
            type="file"
            accept="image/*,video/*,application/pdf"
            className="hidden"
          />

          {/* Image Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 md:p-2 rounded-xl "
          >
            <ImageIcon className="size-3 md:size-5" />
          </button>

          {/* Emoji Button */}
          <div className="relative">
            <button className="p-1 md:p-2  rounded-xl ">
              <Smile className="size-3 md:size-5" />
            </button>
          </div>

          {/* Message Input */}
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-2 py-1 md:px-4 md:py-2 Input rounded-xl    resize-none max-h-18 md:max-h-32"
            style={{ minHeight: "44px" }}
          />

          {/* Voice / Send Button */}
          <button
            onClick={handleSendMessage}
            className="p-1 md:p-2 rounded-full"
          >
            <Send className="size-3 md:size-5" />
          </button>

          <button
            className={`p-2 rounded-xl transition-colors ${"bg-error text-white animate-pulse"}`}
          >
            <Mic className="size-3 md:size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
