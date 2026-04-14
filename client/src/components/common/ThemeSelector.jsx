import  { useState, useContext } from "react";
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

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);

  const themes = [
    {
      id: "forest",
      name: "Forest",
      icon: TreesIcon,
      color: "from-green-500 to-emerald-500",
      description: "Dark & earthy",
    },
    {
      id: "synthwave",
      name: "Synthwave",
      icon: Sparkles,
      color: "from-pink-500 to-purple-500",
      description: "Retro vibes",
    },
    {
      id: "aqua",
      name: "Aqua",
      icon: WavesIcon,
      color: "from-cyan-500 to-blue-500",
      description: "Fresh & clean",
    },
    {
      id: "luxury",
      name: "Luxury",
      icon: Sparkles,
      color: "from-amber-500 to-yellow-500",
      description: "Elegant & rich",
    },
     {
      id: "midnight",
      name: "Midnight",
      icon: Moon,
      color: "from-slate-900 to-gray-800",
      description: "Modern dark theme",
    },
    {
      id: "milky",
      name: "Milky",
      icon: Sun,
      color: "from-blue-100/60 to-indigo-200/60",
      description: "Clean & minimal",
    }
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl cursor-pointer bg-gray-900/90 hover:bg-gray-800/90 milky:bg-gray-200 milky:hover:bg-gray-300 border  group"
        title="Change theme"
      >
        <Palette className="w-5 h-5 text-base-content/60 group-hover:text-base-content transition-all" />
        <span
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-linear-to-r ${currentTheme.color} animate-pulse`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-72 z-50"
            >
              <div className="active backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-base-300">
                  <h3 className="text-sm font-semibold text-base-content flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    Choose Theme
                  </h3>
                  <p className="text-xs text-base-content/60 mt-1">
                    Customize your experience
                  </p>
                </div>

                <div className="p-3 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((t) => {
                      const Icon = t.icon;
                      const isActive = theme === t.id;

                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTheme(t.id)}
                          className={`relative p-3 rounded-xl transition-all duration-300 group
                            ${
                              isActive
                                ? `bg-linear-to-r ${t.color} text-white milky:text-gray-800 shadow-lg`
                                : "bg-base-100 hover:bg-base-300 text-base-content"
                            }
                            border ${isActive ? "border-transparent" : "border-base-300"}
                          `}
                        >
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-1 right-1"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}

                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r ${t.color} flex items-center justify-center mb-2`}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-medium mb-0.5 text-base-content">
                              {t.name}
                            </span>
                            <span className="text-[10px] text-base-content/60">
                              {t.description}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
