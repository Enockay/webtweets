import React, { useState } from 'react';
import axios from 'axios';

interface Badge {
  id: string;
  name: string;
  duration: string;
  description: string;
  price: string; // Add price field
}

interface BadgePurchaseModalProps {
  badge: Badge;
  onClose: () => void;
}

const BadgePurchaseModal: React.FC<BadgePurchaseModalProps> = ({ badge, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePurchase = async () => {
    await axios.post('http://localhost:3000/api/badges/purchase', { duration: badge.duration, phoneNumber });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Purchase {badge.name}</h2>
        <p className="text-yellow-100 mb-2">{badge.description}</p>
        <p className="text-yellow-100 mb-4 font-bold">Price: {badge.price}</p>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter M-Pesa number"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handlePurchase}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Purchase
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BadgePurchaseModal;
