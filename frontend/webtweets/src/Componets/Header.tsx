import React from 'react';

interface HeaderProps {
  username: string | undefined;
  profileImageUrl: string | undefined;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, profileImageUrl, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">WebTweets</h1>
      <div className="flex items-center">
        {username ? (
          <>
            <div className="flex items-center mr-4">
              {profileImageUrl && (
                <img
                  src={profileImageUrl}
                  alt={username}
                  className="w-10 h-10 rounded-full mr-2"
                />
              )}
              <span>Welcome, {username}!</span>
            </div>
            <button 
              onClick={onLogout} 
              className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <a 
            href="/login" 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
          >
            Login
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
