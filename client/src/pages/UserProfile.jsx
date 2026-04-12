import React, { useState, useEffect } from "react";
import {
  Camera,
  Edit3,
  Home,
  MapPin,
  Save,
  X,
  Shuffle,
  User,
  FileText,
  Languages,
  Loader2,
  Check,
  ArrowRight,
} from "lucide-react";
import { authHooks } from "../hooks/authHooks.js";
import toast from "react-hot-toast";
import { APP_CONSTANTS } from "../constant/constant.js";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
const { LANGUAGES } = APP_CONSTANTS;

const UserProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const { isLoading: userLoading, user } = authHooks.useGetUserById(userId);

  if (!userLoading) {
    console.log(user);
  }

  return (
    <div className="bg-transparent flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="w-full flex justify-end px-6 sm:px-8 p-2">
            <button className="flex justify-center items-center gap-1 text-xl">
              back <ArrowRight className="w-6 h-6"/>
            </button>
          </div>
          <div className="relative p-6 sm:p-8  border-b border-white/10">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-bold  mb-2">Profile</h1>
              <p className="text-white/60 milky:text-gray-900/60 text-sm">
                View user details
              </p>
            </motion.div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Profile Picture Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center space-y-4"
            >
              <div
                className="relative group"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                {/* Avatar container */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full active p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5 milky:bg-gray-900/5">
                        <Camera className="w-10 h-10 text-white/40 milky:text-gray-900/40" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <div className="px-4 py-3 Input rounded-xl ">
                  {user?.name || "Not set"}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </label>
                <div className="px-4 py-3 Input rounded-xl min-h-20">
                  {user?.bio || "No bio yet"}
                </div>
              </div>

              {/* Native Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Native Language
                </label>
                <div className="px-4 py-3 Input rounded-xl capitalize">
                  {user?.nativeLang || "Not set"}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <div className="px-4 py-3 Input rounded-xl  flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/40 milky:text-gray-900/40" />
                  {user?.location || "Not set"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
