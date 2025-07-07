import React from 'react';

const ChatList = ({ activeTab }) => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Chat List */}
      <div className={`w-full md:w-1/3 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-300 ease-in-out md:ml-8 block`}>
        <div className="overflow-y-auto h-full custom-scrollbar">
          {/* User list UI placeholder */}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:ml-8 md:mr-4 overflow-hidden transform transition-all duration-300 ease-in-out scale-100 opacity-100`}>
        {/* Header */}
        <div className="flex-none border-b border-gray-100 p-4 flex items-center justify-between bg-white">
          <div className="flex items-center">
            <button className="md:hidden mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <img
              src={''}
              alt={''}
              className="w-12 h-12 rounded-full ring-2 ring-purple-100"
            />
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">User Name</h2>
              <p className={`text-xs text-gray-400`}>Offline</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-[80px] md:mb-0">
            <button className="p-2 hover:bg-gray-100 rounded-full">📞</button>
            <button className="p-2 hover:bg-gray-100 rounded-full">🎥</button>
            <button className="p-2 hover:bg-gray-100 rounded-full">⋮</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0 bg-gray-50">
          <div className="space-y-4">
            {/* Messages UI placeholder */}
          </div>
        </div>

        {/* Input */}
        <div className="flex-none border-t border-gray-100 p-4 bg-white">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">📎</button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200">
              📨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;


