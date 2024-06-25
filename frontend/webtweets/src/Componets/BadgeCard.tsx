import React from 'react';

interface BadgeCardProps {
  badge: { id: string; name: string; duration: string };
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div>{badge.name}</div>
      <div className="text-gray-400">{badge.duration}</div>
    </div>
  );
};

export default BadgeCard;
