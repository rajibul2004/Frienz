import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const NoFriendsFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative col-span-full flex flex-col items-center justify-center py-16 px-8 rounded-3xl overflow-hidden border border-white/10 milky:border-gray-200 bg-white/[0.03] milky:bg-white/60 backdrop-blur-xl text-center"
    >
      {/* Soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-20 active" />
      </div>

      {/* Icon cluster */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full active shadow-xl flex items-center justify-center">
          <Users className="w-9 h-9 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-indigo-500/80 forest:bg-emerald-500/80 synthwave:bg-pink-500/80 aqua:bg-cyan-500/80 luxury:bg-amber-500/80 flex items-center justify-center shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">No friends yet</h3>
      <p className="text-sm text-white/50 milky:text-gray-500 max-w-xs mb-8 leading-relaxed">
        Discover people below and start connecting — your first friendship is just one click away 🌍
      </p>

      <button
        onClick={() => navigate('/notification')}
        className="btn-primary-theme px-6 py-2.5 text-sm font-semibold rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Find Friends
      </button>
    </motion.div>
  );
};

export default NoFriendsFound;