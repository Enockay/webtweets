import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Profile: React.FC = () => {
  // Dummy data for likes and followers
  const socialMediaData = [
    { platform: 'TikTok', likes: 5000, followers: 15000, color: '#69C9D0', icon: faTiktok },
    { platform: 'Twitter', likes: 2000, followers: 10000, color: '#1DA1F2', icon: faTwitter },
    { platform: 'Instagram', likes: 1000, followers: 5000, color: '#E4405F', icon: faInstagram },
  ];

  // Dummy data for line graph (likes and followers over time)
  const timeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const likesData = [1000, 2000, 3000, 2500, 3500, 4000];
  const followersData = [5000, 6000, 7000, 6500, 8000, 9000];

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Likes',
        data: likesData,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Followers',
        data: followersData,
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-slate-500 rounded-lg shadow-lg p-4">
      <h5 className="text-xl mb-4 text-green-200 font-light">Social Media Statistics</h5>

      {/* Social Media Stats */}
      <div className="">
        {socialMediaData.map((platformData, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-2 text-center shadow-sm mb-4" style={{ borderColor: platformData.color, borderWidth: 2 }}>
            <FontAwesomeIcon icon={platformData.icon} size="2x" style={{ color: platformData.color }} />
            <p className="text-gray-600">Likes: <span className="font-bold">{platformData.likes}</span></p>
            <p className="text-gray-600">Followers: <span className="font-bold">{platformData.followers}</span></p>
          </div>
        ))}
      </div>

      {/* Line Graph */}
      <div className="w-full max-w-screen-lg mx-auto">
        <h6 className="font-extralight mb-4 text-green-200">Likes and Followers Over Time</h6>
        <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
          <div className="relative h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
