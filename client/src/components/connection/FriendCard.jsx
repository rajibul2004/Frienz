import {
  MapPin,
  MoreVertical,
  MessageCircle,
  UserMinus,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { connectionHooks } from "../../hooks/connectionHooks";

const FriendCard = ({ friend }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { removeFriendMutation } = connectionHooks.useRemoveFriend();

  const handleChatClick = () => {
    navigate(`/chat/${friend._id}`);
  };

  return (
    <div className="group relative bg-white/5 milky:bg-white/60 backdrop-blur-xl border border-white/10 milky:border-gray-200/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 hover:border-white/20 milky:hover:border-gray-300">
      {/* Top banner / cover area */}
      <div className="h-16 relative bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-pink-500/30 milky:from-indigo-200/60 milky:via-purple-200/40 milky:to-pink-200/60 forest:from-emerald-500/30 forest:to-teal-500/30 synthwave:from-pink-500/30 synthwave:to-indigo-500/30 midnight:from-slate-600/40 midnight:to-gray-600/40 aqua:from-cyan-500/30 aqua:to-teal-500/30 luxury:from-amber-500/20 luxury:to-yellow-500/20">
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5 milky:bg-gray-500/5" />
        <div className="absolute -bottom-6 -left-4 w-16 h-16 rounded-full bg-white/5 milky:bg-gray-500/5" />

        {/* Menu button */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-full bg-black/20 milky:bg-white/60 hover:bg-black/30 milky:hover:bg-white/80 backdrop-blur-sm transition-colors"
          >
            <MoreVertical size={14} className="text-white milky:text-gray-700" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 w-44 bg-gray-900/90 milky:bg-white/95 backdrop-blur-xl border border-white/10 milky:border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={() => { setShowMenu(false); navigate(`/profile/${friend._id}`); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/80 milky:text-gray-700 hover:bg-white/10 milky:hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Profile
                </button>
                <div className="h-px bg-white/10 milky:bg-gray-200 mx-2" />
                <button
                  onClick={async () => { setShowMenu(false); await removeFriendMutation(friend._id); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <UserMinus className="w-4 h-4" />
                  Unfriend
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Avatar — overlaps the banner */}
      <div className="relative px-4 -mt-7">
        <div className="w-14 h-14 rounded-full p-0.5 active shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
            <img
              src={friend.profilePic || "/default-avatar.png"}
              alt={friend.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + friend.name; }}
            />
          </div>
        </div>
        {/* Online dot */}
        <span className="absolute bottom-0 left-[3.25rem] w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-gray-900/20 shadow-sm" />
      </div>

      {/* Body */}
      <div className="px-4 pt-2 pb-4">
        <h3 className="font-bold text-base truncate leading-tight">{friend.name}</h3>

        {friend.location && (
          <p className="flex items-center gap-1 text-xs text-white/50 milky:text-gray-500 mt-0.5">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">{friend.location}</span>
          </p>
        )}

        {/* Language badge */}
        {friend.nativeLang && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium active rounded-full">
              <Globe size={9} />
              {friend.nativeLang}
            </span>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleChatClick}
          className="mt-3 w-full py-2 px-4 btn-primary-theme text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg gap-2"
        >
          <MessageCircle size={15} className="group-hover:scale-110 transition-transform" />
          Message
        </button>
      </div>
    </div>
  );
};

export default FriendCard;
