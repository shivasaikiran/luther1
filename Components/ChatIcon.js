import React, { useState } from 'react';
import { BsChatHeart } from 'react-icons/bs';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';

const ChatIcon = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="fixed z-50 bottom-8 right-8">
      <div className="relative">
        <BsChatHeart
          className="w-12 h-12 p-3 text-white transition-transform duration-300 ease-in-out bg-green-500 rounded-full shadow-lg cursor-pointer hover:scale-110"
          onClick={toggleExpanded}
        />
        {expanded && (
          <div className="absolute right-0 flex flex-col p-4 space-y-4 bg-white rounded-lg shadow-lg bottom-full">
            <div className="flex items-center justify-center w-12 h-12 text-green-500 bg-green-100 rounded-full cursor-pointer hover:bg-green-200">
              <FaWhatsapp size={20} />
            </div>
            <div className="flex items-center justify-center w-12 h-12 text-green-500 bg-green-100 rounded-full cursor-pointer hover:bg-green-200">
              <FaPhone size={20} />
            </div>
            <div className="flex items-center justify-center w-12 h-12 text-red-500 bg-red-100 rounded-full cursor-pointer hover:bg-red-200" onClick={toggleExpanded}>
              <RiCloseLine size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatIcon;
