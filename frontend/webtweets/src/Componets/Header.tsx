import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface HeaderProps {
  username: string | undefined;
  profileImageUrl: string | undefined;
  onLogout: () => void;
}
const icon = "../assets/icon2.jpg";
const Header: React.FC<HeaderProps> = ({ username, profileImageUrl, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white relative">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${icon})`, backgroundSize: 'cover' }}></div>
      <div className="relative flex items-center space-x-4">
        <div className="flex items-center">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={username}
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={handleToggleDropdown}
            />
          ) : (
            <FaUserCircle
              className="w-10 h-10 cursor-pointer"
              onClick={handleToggleDropdown}
            />
          )}
          <span className="ml-2 cursor-pointer text-lime-500" onClick={handleToggleDropdown}>
            {username}!
          </span>
        </div>
        {dropdownOpen && (
          <div className="relative right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {!username && (
        <a
          href="/login"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
        >
          Login
        </a>
      )}
    </header>
  );
};

export default Header;
