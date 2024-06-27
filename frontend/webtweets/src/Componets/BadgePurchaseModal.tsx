import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useUser } from '../Componets/Context';

interface Badge {
  id: string;
  name: string;
  duration: string;
  description: string;
  priceKsh: string;
  priceUsd: string;
  benefits: string[];
}

interface BadgePurchaseModalProps {
  badge: Badge;
  onClose: () => void;
}

const BadgePurchaseModal: React.FC<BadgePurchaseModalProps> = ({ badge, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, paymentMethod } = useUser();

  const handlePurchase = async () => {
    if (!user) {
      setMessage('You need to be logged in to purchase a badge.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://webtweets-dawn-forest-2637.fly.dev/badges/purchase', {
        duration: badge.duration,
        phoneNumber: paymentMethod === 'mpesa' ? phoneNumber : null,
        description: badge.description,
        price: paymentMethod === 'paypal' ? badge.priceUsd : badge.priceKsh,
        user: user.username,
        paymentMethod
      });
      if (response.data.success) {
        setMessage('Successfully purchased the badge.');
      } else {
        setMessage('Failed to purchase the badge.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-80">
        <h4 className="text-xl font-semibold mb-4">Purchase {badge.name}</h4>
        <p className="text-yellow-100 mb-2">{badge.description}</p>
        <p className="text-yellow-100 mb-4 font-bold">
          Price: {paymentMethod === 'paypal' ? badge.priceUsd : badge.priceKsh}
        </p>
        <div className="text-yellow-100 mb-4">
          <h5 className="font-bold">Badge Benefits:</h5>
          <ul className="list-disc list-inside">
            {badge.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        {paymentMethod === 'mpesa' && (
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter M-Pesa number"
            className="w-full p-2 mb-4 border rounded text-black"
          />
        )}
        <button
          onClick={handlePurchase}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : 'Purchase'}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        {message && (
          <div className={`mt-4 p-2 rounded text-center ${message.includes('Successfully') ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgePurchaseModal;
