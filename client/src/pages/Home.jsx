import React from "react";
import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircleIcon,
  MapPinIcon,
  UserIcon,
  UserPlusIcon,
  Users,
  Compass,
  Loader2,
} from "lucide-react";
import FriendCard from "../components/connection/FriendCard";
import NoFriendsFound from "../components/connection/NoFriendsFound";
import { connectionHooks } from "../hooks/connectionHooks";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate=useNavigate();
  const {
    isLoading: isFriendsLoading,
    friends = [],
    error: friendsError,
  } = connectionHooks.useGetFriends();
  const {
    isLoading: isRecommendationLoading,
    recommendedUsers = [],
    error: recommendationError,
  } = connectionHooks.useGetRecommendation();
  const { outgoingRequests: outGoingFR = [] } =
    connectionHooks.useGetOutgoingFR();
  const { sendFRMutation, isPending: isSending } = connectionHooks.useSendFR();

  const [outGoingFRIds, setOutgoingFRIds] = useState(new Set());

  // const { user, isLoading: isUserLoading } = authHooks.useGetUser();

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const outGoingIds = new Set();
    if (outGoingFRIds && outGoingFRIds.length > 0) {
      outGoingFRIds.forEach((req) => {
        outGoingIds.add(req.recipient._id);
      });
      setOutgoingFRIds(outGoingFRIds);
    }
  }, [outGoingFRIds]);

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
    <div>
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 active rounded-xl">
                <Users className="w-5 h-5 " />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Your Friends</h2>
            </div>

            <button
              onClick={() => handleNavigation("/notification")}
              className="hidden cursor-pointer sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 milky:text-gray-900/80 hover:text-white milky:hover:text-gray-900 transition-all duration-300 border border-white/10 milky:border-gray-900/10 "
            >
              <UserIcon size={18} />
              Friend Requests
            </button>
          </div>

          {/* See all button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => handleNavigation("/friends")}
              className="group cursor-pointer flex items-center gap-2 px-4 py-2 text-white/60 milky:text-gray-900/60 hover:text-white milky:hover:text-gray-900 transition-colors"
            >
              <span className="text-sm">See all</span>
              <ArrowRight
                size={16}
                className=" group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Friends List */}
          {isFriendsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <div>
              {friends.length === 0 ? (
                <NoFriendsFound />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {friends.slice(0, 4).map((friend) => (
                    <motion.div
                      key={friend._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FriendCard friend={friend} />
                    </motion.div>
                  ))}
                </div>
              )}{" "}
            </div>
          )}
        </motion.section>

        {/* Recommendations Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 active rounded-xl">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Meet New Friends
                </h2>
                <p className="text-white/60 milky:text-gray-900/60 text-sm mt-1">
                  Discover people who share your interests
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          {isRecommendationLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {recommendedUsers.length === 0 ? (
                <div className="col-span-full">
                  <div className="bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-2xl p-8 text-center">
                    <Compass className="w-12 h-12 text-white/20 milky:text-gray-900/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold  mb-2">
                      No recommendations available
                    </h3>
                    <p className="text-white/40 milky:text-gray-900/40">
                      Check back later for new friend suggestions!
                    </p>
                  </div>
                </div>
              ) : (
                recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outGoingFRIds.has(user._id);

                  return (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className="group bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-2xl hover:bg-white/10 milky:hover:bg-gray-400/10 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
                    >
                      {/* Header with Avatar */}
                      <div className="relative h-20 bg-linear-to-r from-white/5 milky:from-gray-900/5 to-white/10 milky:to-gray-900/10">
                        <div className="absolute -bottom-8 left-4">
                          <div className="w-16 h-16 rounded-full active p-0.5 shadow-xl">
                            <div className="w-full h-full rounded-full  overflow-hidden">
                              <img
                                src={user.profilePic || "/default-avatar.png"}
                                alt={user.name}
                                className="w-full h-full object-cover "
                                loading="lazy"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/150")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-10">
                        {/* User Info */}
                        <div className="mb-3">
                          <h3 className="font-semibold  text-lg truncate">
                            {user.name}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-white/60 milky:text-gray-900/60 text-sm mt-1">
                              <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Bio & Language */}
                        <div className="space-y-3">
                          {user.bio && (
                            <p className="text-sm text-white/60 milky:text-gray-900/60 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
                          {user.nativeLang && (
                            <span className="inline-block px-2 py-1 text-xs active rounded-full font-medium">
                              {user.nativeLang}
                            </span>
                          )}
                        </div>

                        {/* Button */}
                        <button
                          className={`w-full mt-4 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 btn-primary-theme ${
                            hasRequestBeenSent
                              ? " text-green-500  cursor-not-allowed"
                              : " hover:shadow-lg hover:shadow-gray-500/25 hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                          onClick={() =>
                            !hasRequestBeenSent &&
                            sendFRMutation(user._id) &&
                            setOutgoingFRIds((prev) =>
                              new Set(prev).add(user._id),
                            )
                          }
                          disabled={hasRequestBeenSent || isSending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon size={16} /> Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon size={16} /> Send Request
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
          {isRecommendationLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {recommendedUsers.length === 0 ? (
                <div className="col-span-full">
                  <div className="bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-2xl p-8 text-center">
                    <Compass className="w-12 h-12 text-white/20 milky:text-gray-900/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold  mb-2">
                      No recommendations available
                    </h3>
                    <p className="text-white/40 milky:text-gray-900/40">
                      Check back later for new friend suggestions!
                    </p>
                  </div>
                </div>
              ) : (
                recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outGoingFRIds.has(user._id);

                  return (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className="group bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-2xl hover:bg-white/10 milky:hover:bg-gray-400/10 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
                    >
                      {/* Header with Avatar */}
                      <div className="relative h-20 bg-linear-to-r from-white/5 milky:from-gray-900/5 to-white/10 milky:to-gray-900/10">
                        <div className="absolute -bottom-8 left-4">
                          <div className="w-16 h-16 rounded-full active p-0.5 shadow-xl">
                            <div className="w-full h-full rounded-full  overflow-hidden">
                              <img
                                src={user.profilePic || "/default-avatar.png"}
                                alt={user.name}
                                className="w-full h-full object-cover "
                                loading="lazy"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/150")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-10">
                        {/* User Info */}
                        <div className="mb-3">
                          <h3 className="font-semibold  text-lg truncate">
                            {user.name}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-white/60 milky:text-gray-900/60 text-sm mt-1">
                              <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Bio & Language */}
                        <div className="space-y-3">
                          {user.bio && (
                            <p className="text-sm text-white/60 milky:text-gray-900/60 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
                          {user.nativeLang && (
                            <span className="inline-block px-2 py-1 text-xs active rounded-full font-medium">
                              {user.nativeLang}
                            </span>
                          )}
                        </div>

                        {/* Button */}
                        <button
                          className={`w-full mt-4 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 btn-primary-theme ${
                            hasRequestBeenSent
                              ? " text-green-500  cursor-not-allowed"
                              : " hover:shadow-lg hover:shadow-gray-500/25 hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                          onClick={() =>
                            !hasRequestBeenSent &&
                            sendFRMutation(user._id) &&
                            setOutgoingFRIds((prev) =>
                              new Set(prev).add(user._id),
                            )
                          }
                          disabled={hasRequestBeenSent || isSending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon size={16} /> Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon size={16} /> Send Request
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
          {isRecommendationLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {recommendedUsers.length === 0 ? (
                <div className="col-span-full">
                  <div className="bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-2xl p-8 text-center">
                    <Compass className="w-12 h-12 text-white/20 milky:text-gray-900/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold  mb-2">
                      No recommendations available
                    </h3>
                    <p className="text-white/40 milky:text-gray-900/40">
                      Check back later for new friend suggestions!
                    </p>
                  </div>
                </div>
              ) : (
                recommendedUsers.map((user) => {
                  const hasRequestBeenSent = outGoingFRIds.has(user._id);

                  return (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className="group bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-2xl hover:bg-white/10 milky:hover:bg-gray-400/10 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
                    >
                      {/* Header with Avatar */}
                      <div className="relative h-20 bg-linear-to-r from-white/5 milky:from-gray-900/5 to-white/10 milky:to-gray-900/10">
                        <div className="absolute -bottom-8 left-4">
                          <div className="w-16 h-16 rounded-full active p-0.5 shadow-xl">
                            <div className="w-full h-full rounded-full  overflow-hidden">
                              <img
                                src={user.profilePic || "/default-avatar.png"}
                                alt={user.name}
                                className="w-full h-full object-cover "
                                loading="lazy"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/150")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-10">
                        {/* User Info */}
                        <div className="mb-3">
                          <h3 className="font-semibold  text-lg truncate">
                            {user.name}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-white/60 milky:text-gray-900/60 text-sm mt-1">
                              <MapPinIcon className="w-3 h-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Bio & Language */}
                        <div className="space-y-3">
                          {user.bio && (
                            <p className="text-sm text-white/60 milky:text-gray-900/60 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
                          {user.nativeLang && (
                            <span className="inline-block px-2 py-1 text-xs active rounded-full font-medium">
                              {user.nativeLang}
                            </span>
                          )}
                        </div>

                        {/* Button */}
                        <button
                          className={`w-full mt-4 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 btn-primary-theme ${
                            hasRequestBeenSent
                              ? " text-green-500  cursor-not-allowed"
                              : " hover:shadow-lg hover:shadow-gray-500/25 hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                          onClick={() =>
                            !hasRequestBeenSent &&
                            sendFRMutation(user._id) &&
                            setOutgoingFRIds((prev) =>
                              new Set(prev).add(user._id),
                            )
                          }
                          disabled={hasRequestBeenSent || isSending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon size={16} /> Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon size={16} /> Send Request
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Home;
