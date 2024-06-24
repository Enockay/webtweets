import React from 'react';

interface HeaderProps {
  username: string | undefined;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">WebTweets</h1>
      {username && <div>Welcome, {username}!</div>}
    </header>
  );
};

export default Header;
