import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useUser } from '../Componets/Context';

interface Badge {
  id: string;
  name: string;
  price: string;
}

interface BadgeCardProps {
  badgeIds: string[];
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badgeIds }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [message ,setMessage] = useState('')
  const { user } = useUser();

  useEffect(() => {
    const fetchBadgeDetails = async () => {
      if (!user) {
        setError('login kindly so we capture your details');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://webtweets-dawn-forest-2637.fly.dev/badges/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: user.username, badgeIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch badges');
        }

        const data = await response.json();
       if(data.length > 0){
        setBadges(data);
        setLoading(false);
       }else{
        setLoading(false)
         setMessage("zero badges purchase one to unlock system functionalities")
       }
        
      } catch (error) {
        setError('Failed to fetch badges');
        setLoading(false);
      }
    };

    fetchBadgeDetails();
  }, [badgeIds, user]);

  if (loading) return <div className="flex justify-center items-center h-full"><ClipLoader size={30} color="blue" /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto">
      <div className="flex overflow-x-auto gap-4 py-1">
        {message && <center className='text-green-300'>{message}</center>}
        {badges.map((badge, index) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-full shadow-lg flex flex-col items-center justify-center w-20 h-20 cursor-pointer 
              ${index % 3 === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
              ${index % 3 === 1 ? 'bg-gradient-to-r from-blue-500 to-green-500' : ''}
              ${index % 3 === 2 ? 'bg-gradient-to-r from-red-500 to-yellow-500' : ''}
            `}
            onClick={() => setSelectedBadge(badge)}
          >
            <div className="text-xs font-bold text-white text-center sm:block">{badge.name}</div>
            <div className="text-slate-900 text-xs text-center sm:block">Price: {badge.price}</div>
          </div>
        ))}
      </div>

      {selectedBadge && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">{selectedBadge.name}</h2>
            <p className="text-gray-600 mb-2">Price: {selectedBadge.price}</p>
            <button onClick={() => setSelectedBadge(null)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
