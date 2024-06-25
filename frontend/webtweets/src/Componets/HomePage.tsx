import React, { useState } from 'react';
import Countdown from './Countdown';
import BadgeCard from './BadgeCard';
import { AiOutlineFileImage } from 'react-icons/ai';

interface User {
  username: string;
  profileImageUrl?: string;
  badges: { id: string; name: string; duration: string }[];
}

interface Tweet {
  id: string;
  content: string;
}

interface LiveUser {
  username: string;
  profileImageUrl: string;
}

interface Props {
  user?: User | null; // Allow user to be null or undefined
  pastTweets: Tweet[];
  liveUsers: LiveUser[];
  timeLeft: number;
}

const HomePage: React.FC<Props> = ({ user, pastTweets, liveUsers, timeLeft }) => {
  const [suggestedTweet, setSuggestedTweet] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedLiveUsers, setSelectedLiveUsers] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>(['#RutoMustGo', '#RejectfinanceBill2023', '#MadamanoTuesday']);

  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toggleLiveUserSelection = (username: string) => {
    setSelectedLiveUsers((prevSelected) =>
      prevSelected.includes(username)
        ? prevSelected.filter((user) => user !== username)
        : [...prevSelected, username]
    );
  };

  const addHashtag = (hashtag: string) => {
    setHashtags((prevHashtags) => [...prevHashtags, hashtag]);
  };

  const handleSuggestTweet = () => {
    console.log('Suggested Tweet:', suggestedTweet, 'Image:', uploadedImage, 'Tagged Users:', selectedLiveUsers, 'Hashtags:', hashtags);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 lg:mt-8">
        <div className="lg:col-span-2 h-screen overflow-y-auto  scrollbar-hide">
          <section className="mb-4 lg:mb-8">
            <h2 className="text-xl font-bold mb-4 text-red-400">Badges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </section>
          <section className="mb-4 lg:mb-8">
            <h2 className="text-2xl font-bold mb-4">Suggest a Tweet</h2>
            <div className="relative">
              <textarea
                value={suggestedTweet}
                onChange={(e) => setSuggestedTweet(e.target.value)}
                className="w-full p-1 border rounded text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What's happening?"
              />
              <label htmlFor="file-upload" className="absolute bottom-10 right-2 cursor-pointer text-blue-500">
                <AiOutlineFileImage size={24} />
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {uploadedImage && <img src={uploadedImage} alt="Upload Preview" className="mt-4 max-h-40 rounded-lg shadow-md" />}
            <div className="mt-4">
              <input
                type="text"
                className="w-full p-2 border rounded text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add hashtags (separate with commas)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const tags = (e.target as HTMLInputElement).value.split(',').map(tag => tag.trim());
                    setHashtags(tags);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <div className="mt-2 flex flex-wrap">
                {hashtags.map((tag, index) => (
                  <span key={index} className="inline-block bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleSuggestTweet}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Suggest Tweet
            </button>
          </section>
          <section className="mb-4 lg:mb-8">
            <h2 className="text-2xl font-bold mb-4">How WebTweets Works</h2>
            <p className="mt-4">
              WebTweets allows users to suggest tweets, tag other live users, and use hashtags to increase the visibility of their tweets.
              We charge for badges to cover the cost of API access from Twitter, which is $5000 per month.
            </p>
            <p className="mt-2">
              After the countdown, suggested hashtags and user IDs will be amplified 5X on Twitter, reaching a larger audience.
              Users can upload images, tag live users, and add hashtags to their suggested tweets.
            </p>
          </section>
          <section className="mb-4 lg:mb-8">
            <h2 className="text-2xl font-bold mb-4">Suggested Hashtags</h2>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map((tag, index) => (
                <span key={index} className="inline-block bg-green-600 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">These hashtags will be amplified in the next hour.</p>
          </section>
          <section className="mb-4 lg:mb-8">
            <h2 className="text-2xl font-bold mb-4">Past Amplified Tweets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <h2 className="text-2xl font-bold mb-4">Live Users</h2>
            <div className="overflow-y-auto max-h-80 mt-4 border border-gray-700 rounded-lg">
              {liveUsers.map((liveUser) => (
                <div
                  key={liveUser.username}
                  className={`p-4 flex items-center bg-gray-800 rounded mb-4 cursor-pointer ${selectedLiveUsers.includes(liveUser.username) ? 'bg-blue-600' : ''}`}
                  onClick={() => toggleLiveUserSelection(liveUser.username)}
                >
                  <img src={liveUser.profileImageUrl} alt={liveUser.username} className="w-12 h-12 rounded-full" />
                  <span className="ml-4 font-semibold">{liveUser.username}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
