import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  TreesIcon,
  WavesIcon,
  Check,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const THEMES = [
  { id: "forest",    name: "Forest",    icon: TreesIcon, gradient: "from-green-500 to-emerald-500",   ring: "ring-emerald-500",   description: "Dark & earthy" },
  { id: "synthwave", name: "Synthwave", icon: Sparkles,  gradient: "from-pink-500 to-purple-600",    ring: "ring-purple-500",    description: "Retro vibes" },
  { id: "aqua",      name: "Aqua",      icon: WavesIcon, gradient: "from-cyan-400 to-blue-500",      ring: "ring-cyan-400",      description: "Fresh & clean" },
  { id: "luxury",    name: "Luxury",    icon: Sparkles,  gradient: "from-amber-400 to-yellow-500",   ring: "ring-amber-400",     description: "Elegant & rich" },
  { id: "midnight",  name: "Midnight",  icon: Moon,      gradient: "from-slate-700 to-gray-800",     ring: "ring-slate-500",     description: "Sleek dark" },
  { id: "milky",     name: "Milky",     icon: Sun,       gradient: "from-sky-300 to-indigo-300",     ring: "ring-sky-400",       description: "Clean & light" },
];

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const current = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative">
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2.5 rounded-xl cursor-pointer
          bg-white/8 hover:bg-white/15 milky:bg-gray-100 milky:hover:bg-gray-200
          border border-white/10 milky:border-gray-200
          transition-colors group"
        title="Change theme"
      >
        <Palette className="w-[18px] h-[18px] text-white/60 milky:text-gray-500 group-hover:text-white milky:group-hover:text-gray-800 transition-colors" />
        {/* Active colour dot */}
        <span
          className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br ${current.gradient} shadow-sm`}
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — closes on outside click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-64 z-50
                rounded-2xl overflow-hidden
                bg-gray-900/95 milky:bg-white/98
                border border-white/10 milky:border-gray-200
                shadow-2xl shadow-black/40 backdrop-blur-2xl"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/8 milky:border-gray-100 flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${current.gradient} flex items-center justify-center`}>
                  <current.icon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white milky:text-gray-800">Appearance</p>
                  <p className="text-[10px] text-white/40 milky:text-gray-400">Active: {current.name}</p>
                </div>
              </div>

              {/* Theme grid */}
              <div className="p-3 grid grid-cols-3 gap-2">
                {THEMES.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { setTheme(t.id); setIsOpen(false); }}
                      className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl
                        transition-all duration-200 cursor-pointer
                        ${isActive
                          ? "bg-white/10 milky:bg-gray-100 ring-2 " + t.ring
                          : "hover:bg-white/8 milky:hover:bg-gray-50"
                        }`}
                    >
                      {/* Colour swatch */}
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-md`}>
                        <Icon className="w-4 h-4 text-white drop-shadow" />
                      </div>
                      <span className="text-[11px] font-medium text-white/80 milky:text-gray-700 leading-none">
                        {t.name}
                      </span>

                      {/* Check badge */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow"
                        >
                          <Check className="w-2.5 h-2.5 text-gray-900" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
