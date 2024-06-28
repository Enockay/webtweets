import React from 'react';
import { useUser,Badge } from '../Componets/Context';

interface BadgeListProps {
  badgeOptions: Badge[];
  openModal: (badge: Badge) => void;
}

const BadgeList: React.FC<BadgeListProps> = ({ badgeOptions, openModal }) => {
  const { paymentMethod, setPaymentMethod } = useUser();

  return (
    <div className="bg-gray-800 min-h-screen p-6">
      <h4 className="text-center text-xl text-lime-600 font-bold mb-6">Choose Your Affordable Badge</h4>
      {paymentMethod === null ? (
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => setPaymentMethod('paypal')}
          >
            PayPal
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => setPaymentMethod('mpesa')}
          >
            MPesa
          </button>
        </div>
      ) : (
        <div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg mb-4"
            onClick={() => setPaymentMethod(null)}
          >
            Change Payment Method
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {badgeOptions.map((badge) => (
              <div
                key={badge.id}
                className="p-6 bg-white text-black rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105 flex flex-col items-center"
                onClick={() => openModal(badge)}
              >
                <div className="text-center text-lg font-semibold mb-2">{badge.name}</div>
                <div className="text-center text-sm text-gray-700 mb-4">{badge.description}</div>
                <div className="bg-blue-200 w-full text-center p-2 rounded-lg mb-2">
                  {badge.duration}
                </div>
                <div className="bg-yellow-300 p-2 rounded-full text-center w-16 h-16 flex items-center justify-center text-lg font-bold">
                  {paymentMethod === 'paypal' ? badge.priceUsd : badge.priceKsh}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeList;
