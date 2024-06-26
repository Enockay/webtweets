import React, { useState } from 'react';
import axios from 'axios';
import Countdown from './Countdown';
import BadgeCard from './BadgeCard';
import { AiOutlineFileImage } from 'react-icons/ai';
import { FaRetweet } from 'react-icons/fa';
import { BsArrowRightShort } from 'react-icons/bs';

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
  user?: User | null;
  pastTweets: Tweet[];
  liveUsers: LiveUser[];
  timeLeft: number;
}

const HomePage: React.FC<Props> = ({ user, pastTweets, liveUsers, timeLeft }) => {
  const [suggestedTweet, setSuggestedTweet] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedLiveUsers, setSelectedLiveUsers] = useState<string[]>([]);
  const [userSuggestedHashtags, setUserSuggestedHashtags] = useState<string[]>(['RutoMustGo', 'RejectFinanceBill2023', 'MaandamanoTuesday']);
  const [chatGptResponse, setChatGptResponse] = useState<string>('');

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

  const handleSuggestTweet = async () => {
    console.log('Suggested Tweet:', suggestedTweet, 'Image:', uploadedImage, 'Tagged Users:', selectedLiveUsers);

    // Extract hashtags from the tweet and update user-suggested hashtags
    const hashtagsInTweet = suggestedTweet.match(/#\w+/g) || [];
    const newHashtags = hashtagsInTweet.map((tag) => tag.slice(1));
    setUserSuggestedHashtags((prevHashtags) => Array.from(new Set([...prevHashtags, ...newHashtags])));

    // Make API call to ChatGPT for tweet suggestions
    try {
      const response = await axios.post('/api/chatgpt/suggest-tweet', { suggestedTweet });
      setChatGptResponse(response.data.suggestion);
    } catch (error) {
      console.error('Error suggesting tweet:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 lg:mt-8">
        <div className="lg:col-span-2 h-screen overflow-y-auto scrollbar-hide">
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
            <div className="relative flex items-center">
              <div className="relative group">
                <button className="text-blue-500 mr-2">@</button>
                <div className="absolute bg-white text-black border rounded-lg shadow-md p-2 hidden group-hover:block">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2">
                      <AiOutlineFileImage size={24} />
                      <span>Upload Image</span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button className="flex items-center space-x-2" onClick={() => alert('Retweet')}>
                      <FaRetweet size={24} />
                      <span>Retweet</span>
                    </button>
                    <div className="flex flex-col">
                      {userSuggestedHashtags.map((hashtag, index) => (
                        <button key={index} className="flex items-center space-x-2" onClick={() => setSuggestedTweet((prevTweet) => `${prevTweet} #${hashtag}`)}>
                          <span>#</span>
                          <span>{hashtag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <input
                value={suggestedTweet}
                onChange={(e) => setSuggestedTweet(e.target.value)}
                className="w-full p-2 border rounded text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What's happening?"
              />
              <button
                onClick={handleSuggestTweet}
                className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
              >
                <BsArrowRightShort size={24} />
              </button>
            </div>
            {uploadedImage && <img src={uploadedImage} alt="Upload Preview" className="mt-4 max-h-40 rounded-lg shadow-md" />}
            {chatGptResponse && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-bold mb-2">ChatGPT Suggestion</h3>
                <p>{chatGptResponse}</p>
              </div>
            )}
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
              {userSuggestedHashtags.map((tag, index) => (
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
        <div className='max-h-screen overflow-y-auto scrollbar-hide border-'>
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
