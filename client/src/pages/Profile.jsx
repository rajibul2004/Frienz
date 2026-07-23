import { useState, useEffect } from "react";
import {
  Camera,
  Edit3,
  MapPin,
  Save,
  X,
  Shuffle,
  User,
  FileText,
  Languages,
  Loader2,
  Mail,
  Globe,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { authHooks } from "../hooks/authHooks";
import toast from "react-hot-toast";
import { APP_CONSTANTS } from "../constant/constant.js";
import { motion, AnimatePresence } from "framer-motion";
const { LANGUAGES } = APP_CONSTANTS;

/* ── small helper ── */
const Field = ({ icon: Icon, label, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40 milky:text-gray-400">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    {children}
  </div>
);

const DisplayValue = ({ value, placeholder, multiline }) =>
  multiline ? (
    <p className="text-sm text-white/80 milky:text-gray-700 leading-relaxed min-h-[3rem]">
      {value || <span className="text-white/30 milky:text-gray-400 italic">{placeholder}</span>}
    </p>
  ) : (
    <p className="text-sm font-medium text-white/90 milky:text-gray-800">
      {value || <span className="text-white/30 milky:text-gray-400 italic">{placeholder}</span>}
    </p>
  );

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);

  const [formData, setFormData] = useState({
    name: "", bio: "", nativeLang: "", location: "", profilePic: "",
  });

  const { user, isLoading: userLoading } = authHooks.useGetUser();
  const { onboardingMutation } = authHooks.useCompleteOnboarding();

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

  useEffect(() => {
    if (!user) return;
    setHasChanges(
      formData.name !== user.name ||
      formData.bio !== (user.bio || "") ||
      formData.nativeLang !== (user.nativeLang || "") ||
      formData.location !== (user.location || "") ||
      formData.profilePic !== (user.profilePic || "")
    );
  }, [formData, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) { toast("No changes to save"); setIsEditing(false); return; }
    setIsSaving(true);
    try {
      await onboardingMutation({ formData });
      toast.success("Profile updated ✨");
      setIsEditing(false);
      setHasChanges(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "", bio: user?.bio || "",
      nativeLang: user?.nativeLang || "", location: user?.location || "",
      profilePic: user?.profilePic || "",
    });
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 35) + 1;
    setFormData((p) => ({ ...p, profilePic: `https://cdn.jsdelivr.net/gh/alohe/memojis/png/memo_${idx}.png` }));
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 animate-spin text-white/40 milky:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <form onSubmit={handleSubmit}>
          {/* ── Card ── */}
          <div className="rounded-3xl overflow-hidden border border-white/10 milky:border-gray-200 bg-white/[0.04] milky:bg-white/80 backdrop-blur-2xl shadow-2xl shadow-black/20">

            {/* ── Hero banner + avatar ── */}
            <div className="relative h-36 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 milky:from-indigo-200/70 milky:via-purple-100/60 milky:to-pink-200/70 forest:from-emerald-500/30 forest:to-teal-400/30 synthwave:from-pink-500/30 synthwave:to-purple-600/30 midnight:from-slate-600/40 midnight:to-gray-700/40 aqua:from-cyan-500/30 aqua:to-blue-500/30 luxury:from-amber-500/25 luxury:to-yellow-400/25">
              {/* Decorative orbs */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-6 left-10 w-28 h-28 rounded-full bg-white/5 blur-xl" />

              {/* Edit / View badge */}
              <div className="absolute top-4 right-4">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 milky:bg-white/70 backdrop-blur-md text-xs font-semibold text-white milky:text-gray-700 border border-white/20"
                    >
                      <Edit3 className="w-3 h-3" />
                      Editing
                    </motion.div>
                  ) : (
                    <motion.button
                      key="edit-btn"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full btn-primary-theme text-xs font-semibold shadow-lg cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit Profile
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Avatar (overlapping banner) ── */}
            <div className="px-6 sm:px-8 -mt-14 mb-4 flex items-end gap-4">
              <div
                className="relative flex-shrink-0"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="w-28 h-28 rounded-full active p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                    {formData.profilePic ? (
                      <img
                        src={formData.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white/30" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Shuffle overlay in edit mode */}
                {isEditing && (
                  <AnimatePresence>
                    {avatarHover && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleRandomAvatar}
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/55 cursor-pointer"
                      >
                        <Shuffle className="w-6 h-6 text-white mb-0.5" />
                        <span className="text-white text-[10px] font-semibold">Shuffle</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                )}

                {/* Online dot */}
                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900/30 shadow-sm" />
              </div>

              {/* Name + meta (view mode only) */}
              {!isEditing && (
                <div className="pb-2">
                  <h1 className="text-xl font-bold leading-tight">{user?.name || "—"}</h1>
                  {user?.location && (
                    <p className="flex items-center gap-1 text-sm text-white/50 milky:text-gray-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {user.location}
                    </p>
                  )}
                  {user?.nativeLang && (
                    <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold active rounded-full">
                      <Globe className="w-3 h-3" />
                      {user.nativeLang}
                    </span>
                  )}
                </div>
              )}

              {/* Random avatar button (edit mode) */}
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handleRandomAvatar}
                  className="mb-2 flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl
                    bg-white/8 hover:bg-white/15 milky:bg-gray-100 milky:hover:bg-gray-200
                    border border-white/10 milky:border-gray-200
                    text-white/70 milky:text-gray-600 hover:text-white milky:hover:text-gray-800
                    transition-all duration-200 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Random avatar
                </motion.button>
              )}
            </div>

            {/* ── Fields ── */}
            <div className="px-6 sm:px-8 pb-8 space-y-6">
              {/* Divider */}
              <div className="h-px bg-white/8 milky:bg-gray-100" />

              {/* Name */}
              <Field icon={User} label="Full Name">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 Input rounded-xl text-sm"
                  />
                ) : (
                  <DisplayValue value={user?.name} placeholder="Not set" />
                )}
              </Field>

              {/* Email (read-only always) */}
              <Field icon={Mail} label="Email">
                <p className="text-sm font-medium text-white/70 milky:text-gray-600">{user?.email}</p>
              </Field>

              {/* Bio */}
              <Field icon={FileText} label="Bio">
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell others about yourself…"
                    rows={3}
                    className="w-full px-4 py-2.5 Input rounded-xl text-sm resize-none"
                  />
                ) : (
                  <DisplayValue value={user?.bio} placeholder="No bio yet" multiline />
                )}
              </Field>

              {/* Native Language */}
              <Field icon={Languages} label="Native Language">
                {isEditing ? (
                  <select
                    value={formData.nativeLang}
                    onChange={(e) => setFormData((p) => ({ ...p, nativeLang: e.target.value }))}
                    className="w-full px-4 py-2.5 Input rounded-xl text-sm"
                  >
                    <option value="" className="bg-gray-800 milky:bg-white">Select a language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()} className="bg-gray-800 milky:bg-white capitalize">
                        {lang}
                      </option>
                    ))}
                  </select>
                ) : (
                  <DisplayValue value={user?.nativeLang} placeholder="Not set" />
                )}
              </Field>

              {/* Location */}
              <Field icon={MapPin} label="Location">
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 milky:text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                      placeholder="City, Country"
                      className="w-full pl-10 pr-4 py-2.5 Input rounded-xl text-sm"
                    />
                  </div>
                ) : (
                  <DisplayValue value={user?.location} placeholder="Not set" />
                )}
              </Field>

              {/* ── Action buttons (edit mode) ── */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center justify-end gap-3 pt-2"
                  >
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                        bg-white/5 milky:bg-gray-100 hover:bg-white/10 milky:hover:bg-gray-200
                        border border-white/10 milky:border-gray-200
                        text-white/70 milky:text-gray-600 transition-all duration-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>

                    <motion.button
                      whileHover={hasChanges && !isSaving ? { scale: 1.03 } : {}}
                      whileTap={hasChanges && !isSaving ? { scale: 0.97 } : {}}
                      type="submit"
                      disabled={!hasChanges || isSaving}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                        transition-all duration-200 cursor-pointer
                        ${hasChanges && !isSaving
                          ? "btn-primary-theme shadow-lg"
                          : "bg-white/5 milky:bg-gray-100 text-white/30 milky:text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {isSaving ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                      ) : hasChanges ? (
                        <><Save className="w-4 h-4" /> Save Changes</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Up to date</>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
