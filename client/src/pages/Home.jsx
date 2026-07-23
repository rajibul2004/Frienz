import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  UserPlus,
  Users,
  Compass,
  Loader2,
  Bell,
  Globe,
  Sparkles,
} from "lucide-react";
import FriendCard from "../components/connection/FriendCard";
import NoFriendsFound from "../components/connection/NoFriendsFound";
import { connectionHooks } from "../hooks/connectionHooks";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   Skeleton loaders
───────────────────────────────────────────── */
const FriendSkeleton = () => (
  <div className="bg-white/5 milky:bg-white/50 rounded-2xl overflow-hidden border border-white/10 milky:border-gray-200 animate-pulse">
    <div className="h-16 bg-white/10 milky:bg-gray-200" />
    <div className="px-4 pb-4">
      <div className="-mt-7 w-14 h-14 rounded-full bg-white/20 milky:bg-gray-300" />
      <div className="mt-3 h-3 w-28 rounded-full bg-white/10 milky:bg-gray-200" />
      <div className="mt-2 h-2 w-20 rounded-full bg-white/10 milky:bg-gray-200" />
      <div className="mt-4 h-8 w-full rounded-xl bg-white/10 milky:bg-gray-200" />
    </div>
  </div>
);

const SuggestionSkeleton = () => (
  <div className="bg-white/5 milky:bg-white/50 rounded-2xl overflow-hidden border border-white/10 milky:border-gray-200 animate-pulse">
    <div className="h-24 bg-white/10 milky:bg-gray-200" />
    <div className="px-4 pb-4">
      <div className="-mt-8 w-16 h-16 rounded-full bg-white/20 milky:bg-gray-300" />
      <div className="mt-3 h-3 w-28 rounded-full bg-white/10 milky:bg-gray-200" />
      <div className="mt-2 h-2 w-20 rounded-full bg-white/10 milky:bg-gray-200" />
      <div className="mt-3 h-2 w-full rounded-full bg-white/10 milky:bg-gray-200" />
      <div className="mt-1 h-2 w-3/4 rounded-full bg-white/10 milky:bg-gray-200" />
      <div className="mt-4 h-9 w-full rounded-xl bg-white/10 milky:bg-gray-200" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Suggestion card
───────────────────────────────────────────── */
const SuggestionCard = ({ user, isSent, isSending, onSend }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative bg-white/5 milky:bg-white/60 backdrop-blur-xl border border-white/10 milky:border-gray-200/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 hover:border-white/20 milky:hover:border-gray-300 flex flex-col"
  >
    {/* Banner */}
    <div className="h-20 relative bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-blue-500/20 milky:from-purple-200/50 milky:to-blue-200/50 forest:from-emerald-500/20 forest:to-teal-500/20 synthwave:from-pink-500/20 synthwave:to-purple-500/20 midnight:from-slate-600/30 midnight:to-gray-500/30 aqua:from-cyan-500/20 aqua:to-teal-500/20 luxury:from-amber-500/15 luxury:to-yellow-500/15 overflow-hidden">
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-white/5" />
    </div>

    {/* Avatar */}
    <div className="relative px-4 -mt-8">
      <div className="w-16 h-16 rounded-full p-0.5 active shadow-xl">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt={user.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`)}
          />
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col px-4 pt-2 pb-4">
      <h3 className="font-bold text-base truncate leading-tight">{user.name}</h3>

      {user.location && (
        <p className="flex items-center gap-1 text-xs text-white/50 milky:text-gray-500 mt-0.5 mb-1">
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{user.location}</span>
        </p>
      )}

      {user.nativeLang && (
        <span className="mt-1 inline-flex items-center gap-1 self-start px-2 py-0.5 text-[11px] font-medium active rounded-full">
          <Globe size={9} />
          {user.nativeLang}
        </span>
      )}

      {user.bio && (
        <p className="mt-2 text-xs text-white/50 milky:text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {user.bio}
        </p>
      )}

      {/* CTA */}
      <button
        onClick={onSend}
        disabled={isSent || isSending}
        className={`mt-4 w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2
          ${isSent
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
            : "btn-primary-theme hover:scale-[1.03] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          }`}
      >
        {isSent ? (
          <><CheckCircle2 size={15} /> Requested</>
        ) : (
          <><UserPlus size={15} /> Connect</>
        )}
      </button>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Section header
───────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6 gap-4">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl active shadow-md">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-xs text-white/50 milky:text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    {action}
  </div>
);

/* ─────────────────────────────────────────────
   Home page
───────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();

  const { isLoading: isFriendsLoading, friends = [] } = connectionHooks.useGetFriends();
  const { isLoading: isRecommendationLoading, recommendedUsers = [] } = connectionHooks.useGetRecommendation();
  const { outgoingRequests: outGoingFR = [] } = connectionHooks.useGetOutgoingFR();
  const { sendFRMutation, isPending: isSending } = connectionHooks.useSendFR();

  const [outGoingFRIds, setOutgoingFRIds] = useState(new Set());

  useEffect(() => {
    if (outGoingFR && outGoingFR.length > 0) {
      const ids = new Set(outGoingFR.map((req) => req.recipient._id));
      setOutgoingFRIds(ids);
    }
  }, [outGoingFR]);

  const handleSendFR = async (userId) => {
    if (outGoingFRIds.has(userId) || isSending) return;
    await sendFRMutation(userId);
    setOutgoingFRIds((prev) => new Set(prev).add(userId));
  };

  return (
    <div className="space-y-14 pb-8">

      {/* ── Friends Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <SectionHeader
          icon={Users}
          title="Your Friends"
          subtitle={!isFriendsLoading && friends.length > 0 ? `${friends.length} connection${friends.length !== 1 ? "s" : ""}` : undefined}
          action={
            !isFriendsLoading && friends.length > 0 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate("/notification")}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white/5 milky:bg-gray-100 hover:bg-white/10 milky:hover:bg-gray-200 border border-white/10 milky:border-gray-200 rounded-xl text-white/70 milky:text-gray-600 hover:text-white milky:hover:text-gray-800 transition-all duration-200"
                >
                  <Bell size={13} />
                  Requests
                </button>
                <button
                  onClick={() => navigate("/friends")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white/60 milky:text-gray-500 hover:text-white milky:hover:text-gray-800 transition-colors group"
                >
                  See all
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )
          }
        />

        {isFriendsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <FriendSkeleton key={i} />)}
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.slice(0, 8).map((friend, i) => (
              <motion.div
                key={friend._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <FriendCard friend={friend} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Suggestions Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <SectionHeader
          icon={Sparkles}
          title="Suggested For You"
          subtitle="People you might enjoy connecting with"
        />

        {isRecommendationLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <SuggestionSkeleton key={i} />)}
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-3xl border border-white/10 milky:border-gray-200 bg-white/[0.03] milky:bg-white/40 text-center">
            <div className="p-4 rounded-full bg-white/5 milky:bg-gray-100 mb-4">
              <Compass className="w-8 h-8 text-white/30 milky:text-gray-400" />
            </div>
            <h3 className="font-semibold text-base mb-1">No suggestions yet</h3>
            <p className="text-sm text-white/40 milky:text-gray-400 max-w-xs">
              Check back soon — we'll surface the best matches for you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendedUsers.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <SuggestionCard
                  user={user}
                  isSent={outGoingFRIds.has(user._id)}
                  isSending={isSending}
                  onSend={() => handleSendFR(user._id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Home;
