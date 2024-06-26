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
  badges: string[];
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
  const [userSuggestedHashtags, setUserSuggestedHashtags] = useState<string[]>([]);
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
              <BadgeCard badgeIds={user?.badges || []} />
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
                      <span>post</span>
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
          <section className="mb-4 lg:mb-8 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg text-white max-h-96 overflow-y-auto scrollbar-hide">
            <h4 className="text-xl font-bold mb-4">How WebTweets Works</h4>
            <div className="bg-white text-black p-4 rounded-lg shadow-md ">
              <h3 className="text-xl font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside">
                <li className="mb-2">
                  <strong>Suggest Tweets:</strong> WebTweets allows users to suggest tweets, tag other live users, and use hashtags to increase the visibility of their tweets.
                </li>
                <li className="mb-2">
                  <strong>Badge System:</strong> We charge for badges to cover the cost of API access from Twitter, which is $5000 per month.
                </li>
                <li className="mb-2">
                  <strong>Amplified Reach:</strong> After the countdown, suggested hashtags and user IDs will be amplified 5X on Twitter, reaching a larger audience.
                </li>
                <li className="mb-2">
                  <strong>Multimedia Support:</strong> Users can upload images, tag live users, and add hashtags to their suggested tweets.
                </li>
              </ul>
            </div>
            <div className="bg-white text-black p-4 rounded-lg shadow-md mt-4 ">
              <h3 className="text-xl font-semibold mb-2">Benefits</h3>
              <ul className="list-disc list-inside">
                <li className="mb-2">
                  WebTweets can be used to manage online platforms by automating tweets, helping you gain followers and likes on your platforms effortlessly.
                </li>
              </ul>
            </div>
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
                  className={`relative p-1 flex items-center bg-gray-800 rounded mb-2 cursor-pointer ${selectedLiveUsers.includes(liveUser.username) ? 'bg-blue-600' : ''}`}
                  onClick={() => toggleLiveUserSelection(liveUser.username)}
                >
                  <div className="relative">
                    <img src={liveUser.profileImageUrl} alt={liveUser.username} className="w-10 h-10 rounded-full" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                  </div>
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
