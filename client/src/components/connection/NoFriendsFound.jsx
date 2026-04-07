import React from 'react'
import { Users, UserPlus, Globe } from 'lucide-react'

const NoFriendsFound = () => {
  return (
    <div className="col-span-full bg-white/5 milky:bg-gray-400/5 backdrop-blur-sm border border-white/10 milky:border-gray-900/10 rounded-2xl p-8 text-center group hover:bg-white/10 milky:hover:bg-gray-400/10 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 milky:from-gray-300/5 to-purple-500/5 milky:to-slate-300/5 animate-pulse"></div>
      
      {/* Icon with glow effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500 milky:from-gray-300 to-purple-500 milky:to-slate-300 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity animate-pulse"></div>
        <div className="relative w-24 h-24 mx-auto active rounded-full flex items-center justify-center animate-bounce">
          <Users className="w-12 h-12" />
        </div>
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-bold mb-3">
        No Friends Yet
      </h3>
      
      <p className="text-white/60 milky:text-gray-900/60 mb-6 max-w-md mx-auto">
        Connect with people below to interact with the world! 🌍
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button 
          onClick={() => window.navigateTo?.('/friends')}
          className="group/btn px-6 py-2.5 btn-primary-theme  font-medium text-sm hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          Find Friends
        </button>
        
        <button 
          onClick={() => window.navigateTo?.('/')}
          className="group/btn px-6 py-2.5 bg-white/5 milky:bg-gray-900/5 hover:bg-white/10 milky:hover:bg-gray-900/10 text-white/80 milky:text-gray-900/80 hover:text-white milky:hover:text-gray-900 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 border border-white/10 milky:border-gray-900/10 hover:border-indigo-500/30"
        >
          <Globe className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          Explore Community
        </button>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
      <div className="absolute bottom-10 right-10 w-3 h-3 bg-purple-500 rounded-full animate-ping delay-300"></div>
    </div>
  )
}

export default NoFriendsFound