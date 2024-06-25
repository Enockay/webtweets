import React from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
}

interface BadgeListProps {
  badgeOptions: Badge[];
  openModal: (badge: Badge) => void;
}

const BadgeList: React.FC<BadgeListProps> = ({ badgeOptions, openModal }) => {
  return (
    <div className='bg-blue-900'>
      <h3 className="text-center text-xl text-orange-300 font-semibold m-4">Support Us With Badges</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
        {badgeOptions.map((badge) => (
          <div
            key={badge.id}
            className="p-4 text-white shadow cursor-pointer transform transition-transform hover:scale-105 flex flex-col items-center"
            onClick={() => openModal(badge)}
          >
            <div className="relative bg-white text-black rounded-t-lg p-4 flex flex-col items-center w-full">
              <div className="text-center text-xs font-semibold mb-1">{badge.name}</div>
              <div className="text-center text-sm text-gray-600">{badge.description}</div>
            </div>
            <div className="w-full relative">
              <div className={`p-2 w-full text-center text-sm mt-2 ${badge.name === 'Easiest To Use' || badge.name === 'Leader' ? 'bg-orange-500' : 'bg-blue-700'}`}>
                {badge.duration}
                <div className="bg-yellow-400 p-1 text-center absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 text-sm text-black font-bold mt-2 rounded-bl-lg rounded-br-lg">
                {badge.price}
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <center className='text-yellow-400'>
        <h4>#Our Voices Must Be Heard</h4>
      </center>
    </div>
  );
};

export default BadgeList;
