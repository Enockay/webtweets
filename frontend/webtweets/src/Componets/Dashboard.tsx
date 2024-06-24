import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BadgeCard from './BadgeCard';
import Sidebar from './Sidebar';
import Header from './Header';
import Countdown from './Countdown';
import BadgePurchaseModal from './BadgePurchaseModal';

interface User {
  username: string;
  badges: { id: string; name: string; duration: string }[];
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [suggestedTweet, setSuggestedTweet] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [liveUsers, setLiveUsers] = useState<User[]>([]);
  const [pastTweets, setPastTweets] = useState<{ id: string; content: string }[]>([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<{ id: string; name: string; duration: string; description: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await axios.get('http://localhost:3000/api/user');
      setUser(userResponse.data);
      const liveUsersResponse = await axios.get('http://localhost:3000/api/live-users');
      setLiveUsers(liveUsersResponse.data);
      const pastTweetsResponse = await axios.get('http://localhost:3000/api/past-tweets');
      setPastTweets(pastTweetsResponse.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSuggestTweet = async () => {
    await axios.post('http://localhost:3000/api/tweets/suggest', { tweet: suggestedTweet });
    setSuggestedTweet('');
  };

  const openModal = (badge: { id: string; name: string; duration: string; description: string }) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  const badgeOptions = [
    { id: '1', name: '1 Hour Badge', duration: '1 hour', description: 'This badge gives you 1 hour of extra features.' },
    { id: '2', name: '2 Hours Badge', duration: '2 hours', description: 'This badge gives you 2 hours of extra features.' },
    { id: '3', name: '2.5 Hours Badge', duration: '2.5 hours', description: 'This badge gives you 2.5 hours of extra features.' },
    { id: '4', name: '5 Hours Badge', duration: '5 hours', description: 'This badge gives you 5 hours of extra features.' },
    { id: '5', name: '10 Hours Badge', duration: '10 hours', description: 'This badge gives you 10 hours of extra features.' },
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 lg:mt-8">
              <div className="lg:col-span-2">
                <section className="mb-4 lg:mb-8">
                  <h2 className="text-xl font-semibold">Your Badges</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {user?.badges.map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} />
                    ))}
                  </div>
                </section>
                <section className="mb-4 lg:mb-8">
                  <h2 className="text-xl font-semibold">Suggest a Tweet</h2>
                  <textarea
                    value={suggestedTweet}
                    onChange={(e) => setSuggestedTweet(e.target.value)}
                    className="w-full p-2 mt-4 border rounded text-black"
                  />
                  <button
                    onClick={handleSuggestTweet}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Suggest Tweet
                  </button>
                </section>
                <section className="mb-4 lg:mb-8">
                  <h2 className="text-xl font-semibold">How It Works</h2>
                  <p className="mt-4">
                    We charge for badges so we can purchase API access from Twitter, which costs $5000 per month.
                  </p>
                  <p className="mt-2">
                    After the countdown, suggested hashtags and user IDs will be amplified 5X on Twitter to reach a larger audience.
                  </p>
                </section>
                <section className="mb-4 lg:mb-8">
                  <h2 className="text-xl font-semibold">Past Amplified Tweets</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {pastTweets.map((tweet) => (
                      <div key={tweet.id} className="p-4 bg-gray-800 rounded shadow">
                        {tweet.content}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <div>
                <Countdown timeLeft={timeLeft} />
                <section className="mt-8">
                  <h2 className="text-xl font-semibold">Live Users</h2>
                  <div className="overflow-y-auto max-h-80 mt-4">
                    {liveUsers.map((liveUser) => (
                      <div key={liveUser.username} className="p-4 bg-gray-800 rounded shadow mb-4">
                        {liveUser.username}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        );
      case 'projects':
        return <div>Projects Section</div>;
      case 'settings':
        return <div>Settings Section</div>;
      case 'badges':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Badges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badgeOptions.map((badge) => (
                <div key={badge.id} className="p-4 bg-gray-800 rounded shadow cursor-pointer" onClick={() => openModal(badge)}>
                  <div className="text-lg font-semibold">{badge.name}</div>
                  <div className="text-gray-400">{badge.duration}</div>
                  <div className="text-gray-500 text-sm">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      <Sidebar onSectionChange={setCurrentSection} />
      <div className="flex-1 p-4 lg:p-8 lg:ml-64">
        <Header username={user?.username} />
        {renderSection()}
        {isModalOpen && selectedBadge && (
          <BadgePurchaseModal badge={selectedBadge} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
