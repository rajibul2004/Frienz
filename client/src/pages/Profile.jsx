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
} from "lucide-react";
import { authHooks } from "../hooks/authHooks";
import toast from "react-hot-toast";
import { APP_CONSTANTS } from "../constant/constant.js";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
const { LANGUAGES } = APP_CONSTANTS;

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    nativeLang: "",
    location: "",
    profilePic: "",
  });
  const [avatarHover, setAvatarHover] = useState(false);

  const { user, isLoading: userLoading } = authHooks.useGetUser();
  const { onboardingMutation, isPending } = authHooks.useCompleteOnboarding();
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        nativeLang: user.nativeLang || "",
        location: user.location || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    if (!user) return;
    const hasUnsavedChanges =
      formData.name !== user?.name ||
      formData.bio !== user?.bio ||
      formData.nativeLang !== user?.nativeLang ||
      formData.location !== user?.location ||
      formData.profilePic !== user?.profilePic;
    setHasChanges(hasUnsavedChanges);
  }, [formData, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.success("No changes to save");
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      await onboardingMutation({
        formData,
      });

      toast.success("Profile updated successfully! ✨");
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
      nativeLang: user?.nativeLang || "",
      location: user?.location || "",
      profilePic: user?.profilePic || "",
    });
    setIsEditing(false);
    setHasChanges(false);
    toast.success("Changes discarded");
  };

  const handleRandomAvatar = async () => {
    const idx = Math.floor(Math.random() * 35) + 1;
    const randomavatar = `https://cdn.jsdelivr.net/gh/alohe/memojis/png/memo_${idx}.png`;
    setFormData((prev) => ({ ...prev, profilePic: randomavatar }));
  };


  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative p-6 sm:p-8 border-b border-white/10">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-bold  mb-2">
                Your Profile
              </h1>
              <p className="text-white/60 milky:text-gray-900/60 text-sm">
                {isEditing
                  ? "Edit your profile information"
                  : "View your profile details"}
              </p>
            </motion.div>

            {/* Profile completion indicator */}
            {!isEditing && user && (
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1.5 bg-white/5 milky:bg-gray-900/5 border border-white/10 milky:border-gray-900/10 rounded-full">
                  <span className="text-xs text-white/60 milky:text-gray-900/60 flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-400" />
                    Profile Complete
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      {formData.profilePic ? (
                        <img
                          src={formData.profilePic}
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

                  {/* Hover overlay for editing mode */}
                  {isEditing && (
                    <AnimatePresence>
                      {avatarHover && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          onClick={handleRandomAvatar}
                        >
                          <div className="absolute inset-0 bg-black/50 milky:bg-white/50 rounded-full" />
                          <Shuffle className="w-8 h-8 relative z-10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* Random Avatar Button - only in edit mode */}
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleRandomAvatar}
                    className="group px-4 py-2 cursor-pointer bg-white/5 milky:bg-gray-900/5 hover:bg-white/10 milky:hover:bg-gray-900/10 border border-white/10 milky:border-gray-900/10 rounded-xl text-white/80 milky:text-gray-900/80 hover:text-white hover:milky:text-gray-900 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Generate Random Avatar
                  </motion.button>
                )}
              </motion.div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {!isEditing ? (
                    <div className="px-4 py-3 Input rounded-xl ">
                      {user?.name || "Not set"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl Input transition-colors"
                    />
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Bio
                  </label>
                  {!isEditing ? (
                    <div className="px-4 py-3 Input rounded-xl min-h-20">
                      {user?.bio || "No bio yet"}
                    </div>
                  ) : (
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell others about yourself..."
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl Input transition-colors resize-none"
                    />
                  )}
                </div>

                {/* Native Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Native Language
                  </label>
                  {!isEditing ? (
                    <div className="px-4 py-3 Input rounded-xl capitalize">
                      {user?.nativeLang || "Not set"}
                    </div>
                  ) : (
                    <select
                      value={formData.nativeLang}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nativeLang: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 Input rounded-xl transition-colors"
                    >
                      <option value="" className="bg-gray-800 milky:bg-gray-300">
                        Select your language
                      </option>
                      {LANGUAGES.map((lang) => (
                        <option
                          key={`native-${lang}`}
                          value={lang.toLowerCase()}
                          className="bg-gray-700 milky:bg-gray-200 capitalize"
                        >
                          {lang}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  {!isEditing ? (
                    <div className="px-4 py-3 Input rounded-xl  flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-white/40 milky:text-gray-900/40" />
                      {user?.location || "Not set"}
                    </div>
                  ) : (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 milky:text-gray-900/40" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="City, Country"
                        className="w-full pl-10 pr-4 py-3 Input rounded-xl transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                {!isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={()=> navigate("/")}
                      className="px-6 py-3 bg-white/5 milky:bg-gray-900/5 hover:bg-white/10 milky:hover:bg-gray-900/10  rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/10 milky:border-gray-900/10"
                    >
                      <Home className="w-4 h-4" />
                      Home
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 btn-primary-theme rounded-xl  transition-all duration-300 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-white/5 milky:bg-gray-900/5 hover:bg-white/10 milky:hover:bg-gray-900/10 text-white/80 milky:text-gray-900/80 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/10 milky:border-gray-900/10"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!hasChanges || isSaving}
                      className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2
                        ${
                          hasChanges && !isSaving
                            ? "btn-primary-theme "
                            : "bg-white/5 milky:bg-gray-900/5 text-white/40 milky:text-gray-900/40 cursor-not-allowed"
                        }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
