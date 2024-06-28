import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useUser } from './Context';
import icon from '../assets/icon.jpg';
import LoginModal from '../Componets/pages/LoginModal'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const Header: React.FC = () => {
  const { user, setUser } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [Loading , setLoading] = useState(false);

  const navigate = useNavigate()

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    setLoading(true);
     const logoutUser = await fetch('https://webtweets-dawn-forest-2637.fly.dev/auth/logout', {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            credentials: 'include',
            body :JSON.stringify(user)
        });
     const response = await logoutUser.json();
     console.log(response);
     if(response.success){
        navigate("/login");
        setUser(null);
     }  
    };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white relative">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${icon})`, backgroundSize: 'cover' }}></div>
      <div className="relative flex items-center space-x-4">
      <center>{Loading && <ClipLoader size={30} color={"#ffffff"} loading={Loading} />}</center> 
        <div className="flex items-center">
          {user?.profileImageUrl ? (
            <img
              src={user.twitter?.profileImageUrl}
              alt={user.twitter?.username}
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={handleToggleDropdown}
            />
          ) : (
            <FaUserCircle
              className="w-10 h-10 cursor-pointer"
              onClick={handleToggleDropdown}
            />
          )}
          <span className="ml-2 cursor-pointer text-gray-700" onClick={handleToggleDropdown}>
            {user?.username}!
          </span>
        </div>
        {dropdownOpen && (
          <div className="absolute mt-16 w-48 bg-white text-black rounded-lg shadow-lg z-10">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <img
          src={icon}
          alt="Logo"
          className="w-10 h-10 rounded-full"
        />
      </div>
      {!user && (
        <button
          onClick={openLoginModal}
          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
        >
          Login
        </button>
      )}
      <LoginModal isOpen={loginModalOpen} onClose={closeLoginModal} />
    </header>
  );
};

export default Header;
