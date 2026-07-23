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
  ArrowRight,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { authHooks } from "../hooks/authHooks";
import { useNavigate } from "react-router-dom";
import { APP_CONSTANTS } from "../constant/constant";
const { LANGUAGES } = APP_CONSTANTS;

// Step metadata
const STEPS = [
  {
    title: "Your Identity",
    subtitle: "Tell us who you are — name, photo & bio",
  },
  {
    title: "Your World",
    subtitle: "Where are you from and what language do you speak?",
  },
];

// Slide animation variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.15 },
  }),
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = authHooks.useGetUser();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    nativeLang: "",
    location: "",
    profilePic: "",
  });
  const [formStep, setFormStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [avatarHover, setAvatarHover] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("Onboarding-State", false);
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

  // Fixed: removed leading space from URL
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 35) + 1;
    const randomavatar = `https://cdn.jsdelivr.net/gh/alohe/memojis/png/memo_${idx}.png`;
    setFormData((prev) => ({ ...prev, profilePic: randomavatar }));
  };

  const isStep1Valid = formData.name.trim() !== "" && formData.bio.trim() !== "";
  const isStep2Valid = formData.nativeLang !== "" && formData.location.trim() !== "";

  const goNext = () => {
    setDirection(1);
    setFormStep(2);
  };

  const goBack = () => {
    setDirection(-1);
    setFormStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Card */}
        <div className="rounded-3xl border border-white/10 milky:border-gray-200 bg-white/[0.06] milky:bg-white/80 backdrop-blur-2xl shadow-2xl shadow-black/20 overflow-hidden">

          {/* ── Header ── */}
          <div className="relative px-6 pt-8 pb-6 border-b border-white/10 milky:border-gray-200 bg-gradient-to-b from-white/[0.03] to-transparent">
            {/* Brand */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl active flex items-center justify-center shadow-lg">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white/70 milky:text-gray-500 tracking-wide">
                  Frienz
                </span>
              </div>
            </div>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={formStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-6"
              >
                <h1 className="text-xl sm:text-2xl font-bold mb-1">
                  {STEPS[formStep - 1].title}
                </h1>
                <p className="text-sm text-white/50 milky:text-gray-500">
                  {STEPS[formStep - 1].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-0">
              {[1, 2].map((step, i) => (
                <div key={step} className="flex items-center">
                  {/* Step circle */}
                  <motion.div
                    animate={{ scale: formStep >= step ? 1 : 0.9 }}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      formStep > step
                        ? "btn-primary-theme shadow-md"
                        : formStep === step
                        ? "btn-primary-theme shadow-lg ring-2 ring-white/20"
                        : "bg-white/10 milky:bg-gray-100 text-white/40 milky:text-gray-400"
                    }`}
                  >
                    {formStep > step ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      step
                    )}
                  </motion.div>

                  {/* Connector line (only between steps) */}
                  {step < 2 && (
                    <div className="relative w-16 h-0.5 mx-1 bg-white/10 milky:bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 btn-primary-theme rounded-full"
                        initial={false}
                        animate={{ scaleX: formStep > step ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Step label */}
            <p className="text-center text-[11px] text-white/30 milky:text-gray-400 mt-3">
              Step {formStep} of 2
            </p>
          </div>

          {/* ── Form Body ── */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-0">

              {/* ── Avatar (always visible) ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 mb-6"
              >
                {/* Avatar circle */}
                <div
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                >
                  <div className="w-28 h-28 rounded-full active p-1 shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white/10 milky:bg-gray-100">
                      {formData.profilePic ? (
                        <img
                          src={formData.profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-10 h-10 text-white/30 milky:text-gray-400" />
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
                        className="absolute inset-0 flex items-center justify-center rounded-full"
                      >
                        <div className="absolute inset-0 bg-black/50 milky:bg-white/60 rounded-full" />
                        <Camera className="w-7 h-7 relative z-10 text-white milky:text-gray-700" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Shuffle button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleRandomAvatar}
                  className="group flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-white/5 milky:bg-gray-50 hover:bg-white/10 milky:hover:bg-gray-100 border border-white/10 milky:border-gray-200 text-white/70 milky:text-gray-600 hover:text-white milky:hover:text-gray-800 transition-all duration-200 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  Shuffle Avatar
                </motion.button>
              </motion.div>

              {/* ── Step Fields (animated slide) ── */}
              <div className="relative overflow-hidden min-h-[200px]">
                <AnimatePresence mode="wait" custom={direction}>
                  {formStep === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-4"
                    >
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 milky:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 Input rounded-xl"
                          required
                        />
                      </div>

                      {/* Bio */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 milky:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          Bio
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bio: e.target.value.slice(0, 200),
                            })
                          }
                          placeholder="Tell others about yourself…"
                          rows={4}
                          className="w-full px-4 py-3 Input rounded-xl resize-none"
                          required
                        />
                        <div className="flex justify-end">
                          <span
                            className={`text-[11px] tabular-nums ${
                              formData.bio.length >= 180
                                ? "text-rose-400"
                                : "text-white/30 milky:text-gray-400"
                            }`}
                          >
                            {formData.bio.length}/200
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-4"
                    >
                      {/* Native Language */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 milky:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Languages className="w-3.5 h-3.5" />
                          Native Language
                        </label>
                        <select
                          value={formData.nativeLang}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nativeLang: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 Input rounded-xl"
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
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 milky:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 milky:text-gray-400" />
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: e.target.value,
                              })
                            }
                            placeholder="City, Country"
                            className="w-full pl-10 pr-4 py-3 Input rounded-xl"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Navigation Buttons ── */}
              <div className="flex gap-3 pt-6">
                <AnimatePresence>
                  {formStep > 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      type="button"
                      onClick={goBack}
                      className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/8 milky:bg-gray-100 hover:bg-white/15 milky:hover:bg-gray-200 text-white/80 milky:text-gray-700 border border-white/10 milky:border-gray-200 transition-all duration-200 cursor-pointer"
                    >
                      Back
                    </motion.button>
                  )}
                </AnimatePresence>

                {formStep < 2 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={goNext}
                    disabled={!isStep1Valid}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      isStep1Valid
                        ? "btn-primary-theme shadow-lg cursor-pointer"
                        : "bg-white/5 milky:bg-gray-100 text-white/30 milky:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isPending || !isStep2Valid}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      isStep2Valid && !isPending
                        ? "btn-primary-theme shadow-lg cursor-pointer"
                        : "bg-white/5 milky:bg-gray-100 text-white/30 milky:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Completing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Complete Profile
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
