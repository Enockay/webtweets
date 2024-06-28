import React, { useState } from 'react';
import axios from 'axios';
import Countdown from './Countdown';
import BadgeCard from './BadgeCard';
import { AiOutlineFileImage } from 'react-icons/ai';
import { FaRetweet } from 'react-icons/fa';
import {User } from './Context';
import { BsArrowRightShort } from 'react-icons/bs';
import Profile from './Profile';


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
  const [isProfileVisible, setIsProfileVisible] = useState(false);

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
        {/* Live Users Section */}
        <div className="lg:order-last lg:col-span-1 lg:max-h-screen lg:overflow-y-auto lg:scrollbar-hide">
          <Countdown timeLeft={timeLeft} />
          <section className="mt-8 lg:mt-0">
            <h4 className="text-xl font-bold mb-4">Live Users</h4>
            <div className="flex mt-4 bg-emerald-400 rounded p-1">
              {liveUsers.map((liveUser, index) => (
                <div
                  key={liveUser.username}
                  className={`relative flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-900 ${selectedLiveUsers.includes(liveUser.username) ? 'bg-blue-600' : ''}`}
                  style={{ marginLeft: index === 0 ? '0' : '-10px' }}
                  onClick={() => toggleLiveUserSelection(liveUser.username)}
                >
                  <img
                    src={liveUser.profileImageUrl}
                    alt={liveUser.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                </div>
              ))}
            </div>
            {/* Toggle Profile Button */}

          </section>
          <div>
            {/* Toggle Profile Button (visible only on small screens) */}
            <button
              onClick={() => setIsProfileVisible(!isProfileVisible)}
              className="mt-4 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
            >
              {isProfileVisible ? 'Hide Profile' : 'View Profile'}
            </button>

            {/* Profile Component (always visible on large screens, toggleable on small screens) */}
            <div className={`mt-4 ${isProfileVisible ? 'block' : 'hidden'} lg:block`}>
              <Profile />
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="lg:col-span-2 h-screen overflow-y-auto scrollbar-hide">
          <section className="mb-4 lg:mb-8">
            <h3 className="font-bold mb-4 text-red-400">Badges</h3>
            <div className="max-w-96">
              <BadgeCard badgeIds={user?.badges || []} />
            </div>
          </section>
          <section className="mb-4 lg:mb-8">
            <h4 className="text-xl font-bold mb-4 text-green-600">Suggest a Tweet</h4>
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
          <section className="mb-4 lg:mb-8">
            <h4 className="text-xl font-bold mb-4">Suggested Hashtags</h4>
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
            <h4 className="text-xl font-bold mb-4">Past Amplified Tweets</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pastTweets.map((tweet) => (
                <div key={tweet.id} className="p-4 bg-gray-800 rounded shadow">
                  {tweet.content}
                </div>
              ))}
            </div>
          </section>
          <section className="mb-4 lg:mb-8 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg text-white max-h-96 overflow-y-auto scrollbar-hide md:h-screen">
            <h4 className="text-xl font-bold mb-4">How WebTweets Works</h4>
            <div className="bg-white text-black p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside">
                <li className="mb-2">
                  <strong>Suggest Tweets:</strong> WebTweets allows users to suggest tweets, tag other live users, and use hashtags to increase the visibility of their tweets.
                </li>
                <li className="mb-2">
                  <strong>Upload Images:</strong> Users can upload images to be included in their suggested tweets.
                </li>
                <li className="mb-2">
                  <strong>ChatGPT Suggestions:</strong> WebTweets can provide tweet suggestions based on user input, using AI-powered ChatGPT.
                </li>
              </ul>
            </div>
            <div className="bg-white text-black p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-semibold mb-2">About WebTweets</h3>
              <ul className="list-disc list-inside">
                <li className="mb-2">
                  WebTweets is designed to help users get their tweets noticed, particularly those from underrepresented communities and voices.
                </li>
                <li className="mb-2">
                  By amplifying suggested hashtags and user IDs, WebTweets can help raise awareness about important issues and causes.
                </li>
                <li className="mb-2">
                  Our platform provides a space for users to connect and collaborate, making it easier to amplify important messages.
                </li>
              </ul>
            </div>
            <div className="bg-white text-black p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-semibold mb-2">Conclusion</h3>
              <p>
                WebTweets is committed to providing a platform that amplifies underrepresented voices and helps users get their messages heard. By using WebTweets, you can suggest tweets, tag live users, and use hashtags to increase the visibility of your tweets. Join us today and be a part of the WebTweets community!
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
