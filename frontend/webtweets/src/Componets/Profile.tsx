import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useUser } from './Context'; // Adjust the import path based on your project structure

const Profile: React.FC = () => {
  const { user } = useUser();

  const isDataComplete = user && user.tiktok && user.twitter && user.instagram && user.tiktok.likes !== undefined && user.twitter.likes !== undefined && user.instagram.likes !== undefined && user.tiktok.followers !== undefined && user.twitter.followers !== undefined && user.instagram.followers !== undefined;

  const socialMediaData = user ? [
    { platform: 'TikTok', ...user.tiktok, color: '#69C9D0', icon: faTiktok },
    { platform: 'Twitter', ...user.twitter, color: '#1DA1F2', icon: faTwitter },
    { platform: 'Instagram', ...user.instagram, color: '#E4405F', icon: faInstagram },
  ] : [];

  // Generate labels for the past 5 years
  const getLast60Months = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    let labels = [];
    for (let i = 59; i >= 0; i--) {
      let date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(`${months[date.getMonth()]} ${date.getFullYear()}`);
    }
    return labels;
  };

  const timeLabels = getLast60Months();

  const likesData = user ? [
    user.tiktok?.likes ?? 0,
    user.twitter?.likes ?? 0,
    user.instagram?.likes ?? 0,
  ] : [];
  const followersData = user ? [
    user.tiktok?.followers ?? 0,
    user.twitter?.followers ?? 0,
    user.instagram?.followers ?? 0,
  ] : [];

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
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x' as const, // Explicitly specifying the mode as 'x'
        },
        pan: {
          enabled: true,
          mode: 'x' as const, // Explicitly specifying the mode as 'x'
        },
      },
    },
  };

  return (
    <div className="bg-slate-500 rounded-lg shadow-lg p-4">
      {user ? (
        <>
          {!isDataComplete && (
            <div className="alert mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-3">
              <p>Some data is missing. Please <a href="/link-account" className="underline text-red-700">link your account</a> to provide complete information.</p>
            </div>
          )}

          {/* Social Media Stats */}
          <div className="">
            {socialMediaData.map((platformData, index) => (
              <div key={index} className="flex bg-gray-100 rounded-lg p-1 text-center shadow-sm mb-3 justify-center align-middle" style={{ borderColor: platformData.color, borderWidth: 2 }}>
                <div className="flex flex-col justify-center items-center mr-1">
                  <FontAwesomeIcon icon={platformData.icon} size="2x" style={{ color: platformData.color }} />
                </div>
                <div>
                  <p className="text-gray-600 mt-2">Likes: <span className="font-bold">{platformData.likes ?? 0}</span></p>
                  <p className="text-gray-600">Followers: <span className="font-bold">{platformData.followers ?? 0}</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* Line Graph */}
          <div className="mt-8">
            <h6 className="font-extralight mb-4 text-green-200">Likes and Followers Over Time</h6>
            <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
              <div className="relative h-64">
                <Line data={chartData} options={chartOptions} plugins={[zoomPlugin]} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <h5 className="text-xl mb-4 text-red-200 font-light">You are not logged in. Please log in to view your social media statistics.</h5>
      )}
    </div>
  );
};

export default Profile;
