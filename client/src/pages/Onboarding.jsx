import React, { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Shuffle,
  User,
  FileText,
  Languages,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
// import { LANGUAGES } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import { authHooks } from "../hooks/authHooks";
import { useNavigate } from "react-router-dom";
import { APP_CONSTANTS } from "../constant/constant";
const { LANGUAGES } = APP_CONSTANTS;

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = authHooks.useGetUser();

  const [formData,setFormData]=useState({
    name:"",
    bio:"",
    nativeLang:"",
    location:"",
    profilePic:""
  })
  // const [name, setName] = useState("");
  // const [bio, setBio] = useState("");
  // const [nativeLang, setNativeLang] = useState("");
  // const [location, setLocation] = useState("");
  // const [profilePic, setProfilePic] = useState("");
  const [avatarHover, setAvatarHover] = useState(false);
  const [formStep, setFormStep] = useState(1);

  useEffect(() => {
    sessionStorage.setItem("Onboarding-State", false);
    if (user) {
      setFormData({
        ...formData,
        name: user.name || "",
        bio: user.bio || "",
        nativeLang: user.nativeLang || "",
        location: user.location || "",
        profilePic: user.profilePic || ""
      });
    }
  }, [user]);

  const { isPending, onboardingMutation } = authHooks.useCompleteOnboarding();
  const { refetch } = authHooks.useGetOnboardStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onboardingMutation({ formData });
      await refetch();

      toast.success("Profile completed successfully! 🎉");

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 35) + 1;
    const randomavatar = ` https://cdn.jsdelivr.net/gh/alohe/memojis/png/memo_${idx}.png`;
    setFormData((prev) => ({ ...prev, profilePic: randomavatar }));
  };

  // Form validation
  const isStep1Valid = formData.name.trim() !== "" && formData.bio.trim() !== "";
  const isStep2Valid = formData.nativeLang !== "" && formData.location.trim() !== "";

  return (
    <div className="items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with progress */}
          <div className="relative p-6 sm:p-8 border-b border-white/10">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Complete Your Profile
              </h1>
              <p className="text-white/60 milky:text-gray-900/60 text-sm">
                Tell us a bit about yourself to get started
              </p>
            </motion.div>

            {/* Progress Steps */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    animate={{
                      scale: formStep >= step ? 1 : 0.9,
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                            ${formStep >= step ? " btn-primary-theme" : "text-white/40 milky:text-gray-800/40"}`}
                  >
                    {formStep > step ? <Check className="w-4 h-4" /> : step}
                  </motion.div>
                  {step < 2 && (
                    <div
                      className={`w-12 h-0.5 mx-1 transition-colors duration-300
                                            ${formStep > step ? "btn-primary-theme" : "bg-white/10 milky:bg-gray-900/10"}`}
                    />
                  )}
                </div>
              ))}
            </div>
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
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full  bg-white/20 milky:bg-gray-900/10 p-1">
                    <div className="w-full h-full cursor-pointer rounded-full overflow-hidden">
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

                  {/* Hover overlay */}
                  <AnimatePresence>
                    {avatarHover && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="absolute inset-0 bg-black/50 milky:bg-white/50 rounded-full" />
                        <Camera className="w-8 h-8 relative z-10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Random Avatar Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleRandomAvatar}
                  className="group px-4 py-2 cursor-pointer bg-white/5 milky:bg-gray-900/5 hover:bg-white/10 hover:milky:bg-gray-900/10 border border-white/10 milky:border-gray-900/10 rounded-xl text-white/80 milky:text-gray-900/80 hover:text-white hover:milky:text-gray-900 transition-all duration-300 flex items-center gap-2 text-sm"
                >
                  <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Generate Random Avatar
                </motion.button>
              </motion.div>

              {/* Step 1: Basic Info */}
              <AnimatePresence mode="wait">
                {formStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 Input"
                        required
                      />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell others about yourself..."
                        rows="4"
                        className="w-full px-4 Input resize-none"
                        required
                      />
                      <p className="text-xs text-white/40 text-right">
                        {formData.bio.length}/200
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Preferences */}
                {formStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Native Language */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Native Language
                      </label>
                      <select
                        value={formData.nativeLang}
                        onChange={(e) => setFormData({ ...formData, nativeLang: e.target.value })}
                        className="w-full px-4 py-3 Input"
                        required
                      >
                        <option value="" className="bg-gray-800">
                          Select your language
                        </option>
                        {LANGUAGES.map((lang) => (
                          <option
                            key={`native-${lang}`}
                            value={lang.toLowerCase()}
                            className="bg-gray-800 milky:bg-gray-100"
                          >
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80 milky:text-gray-900/80 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 milky:text-gray-900/40" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="City, Country"
                          className="w-full pl-10 pr-4 py-3  Input"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {formStep > 1 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="flex-1 py-3 bg-white/10 milky:bg-gray-900/10 hover:bg-white/20 milky:hover:bg-gray-900/20 text-white milky:text-gray-900 rounded-xl transition-all duration-300 border border-white/20 milky:border-gray-900/20"
                  >
                    Back
                  </motion.button>
                )}

                {formStep < 2 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setFormStep(2)}
                    disabled={!isStep1Valid}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
                                            ${
                                              isStep1Valid
                                                ? "btn-primary-theme"
                                                : "bg-white/5 milky:bg-gray-900/5 text-white/40 milky:text-gray-900/40 cursor-not-allowed"
                                            }`}
                  >
                    Next
                    <Sparkles className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isPending || !isStep2Valid}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
                                            ${
                                              isStep2Valid && !isPending
                                                ? "btn-primary-theme cursor-pointer"
                                                : "bg-white/5 milky:bg-gray-900/5 text-white/40 milky:text-gray-900/40 cursor-not-allowed"
                                            }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        Complete Profile
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
