import { Dot, MapPin, Settings, MoreVertical, MessageCircle } from 'lucide-react'
import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const FriendCard = ({friend}) => {
    const navigate=useNavigate();
  
  const handleChatClick = () => {
    navigate(`/chat/${friend._id}`)
  };

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
      
      <div className="p-4 relative">
        {/* User info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar with status indicator */}
            <div className="relative">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
                <div className="w-full h-full rounded-full bg-base-200 overflow-hidden">
                  <img 
                    src={friend.profilePic || '/default-avatar.png'} 
                    alt={friend.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
              </div>
              {/* Online indicator - you can add logic for online status */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-200"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm lg:text-base font-semibold text-white truncate">
                {friend.name}
              </h3>
              <p className="flex items-center gap-1 text-xs text-white/60">
                <MapPin size={12} className="flex-shrink-0" />
                <span className="truncate">{friend.location || 'Location not set'}</span>
              </p>
            </div>
          </div>
          
          {/* Menu button */}
          <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical size={18} className="text-white/60" />
          </button>
        </div>
        
        {/* Language badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium">
            {friend.nativeLang}
          </span>
          {friend.learningLang && (
            <span className="px-2 py-0.5 text-xs bg-white/10 text-white/80 rounded-full">
              Learning: {friend.learningLang}
            </span>
          )}
        </div>
        
        {/* Message button */}
        <button 
          onClick={handleChatClick}
          className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <MessageCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
          Message
        </button>
      </div>
    </div>
  )
}

export default FriendCard