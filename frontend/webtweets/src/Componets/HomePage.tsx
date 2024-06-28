import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countdown from './Countdown';
import BadgeCard from './BadgeCard';
import { AiOutlineFileImage } from 'react-icons/ai';
import { FaRetweet } from 'react-icons/fa';
import { User } from './Context';
import Profile from './Profile';
import { getProjectSchedules } from './projectService'; // Adjust the import path as needed

interface Tweet {
  id: string;
  content: string;
}

interface LiveUser {
  username: string;
  profileImageUrl: string;
}

interface ProjectSchedule {
  id: string;
  status: string;
  platform: string;
  content: string;
  mediaItem: string | null;
  scheduledTime: string;
}

interface Props {
  user?: User | null;
  pastTweets: Tweet[];
  liveUsers: LiveUser[];
  timeLeft: number;
}

const HomePage: React.FC<Props> = ({ user, liveUsers, timeLeft }) => {
  const [suggestedTweet, setSuggestedTweet] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedLiveUsers, setSelectedLiveUsers] = useState<string[]>([]);
  const [userSuggestedHashtags, setUserSuggestedHashtags] = useState<string[]>([]);
  const [chatGptResponse, setChatGptResponse] = useState<string>('');
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [projectSchedules, setProjectSchedules] = useState<ProjectSchedule[]>([]);

  useEffect(() => {
    const fetchProjectSchedules = async () => {
      try {
        const schedules = await getProjectSchedules();
        setProjectSchedules(schedules);
      } catch (error) {
        console.error('Error fetching project schedules:', error);
        // Use dummy data when fetching fails or returns empty
        setProjectSchedules([
          {
            id: '1',
            status: 'Scheduled',
            platform: 'Twitter',
            content: 'Check out our new feature! #newfeature #launch',
            mediaItem: null,
            scheduledTime: new Date().toISOString(),
          },
          {
            id: '2',
            status: 'Posted',
            platform: 'Facebook',
            content: 'We are excited to announce our latest update! #update #announcement',
            mediaItem: null,
            scheduledTime: new Date().toISOString(),
          },
          {
            id: '3',
            status: 'Scheduled',
            platform: 'Instagram',
            content: 'Sneak peek of our upcoming release! #sneakpeek #comingsoon',
            mediaItem: 'https://via.placeholder.com/150',
            scheduledTime: new Date().toISOString(),
          },
        ]);
      }
    };

    fetchProjectSchedules();
  }, []);

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

    const hashtagsInTweet = suggestedTweet.match(/#\w+/g) || [];
    const newHashtags = hashtagsInTweet.map((tag) => tag.slice(1));
    setUserSuggestedHashtags((prevHashtags) => Array.from(new Set([...prevHashtags, ...newHashtags])));

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
            <button
              onClick={() => setIsProfileVisible(!isProfileVisible)}
              className="mt-4 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
            >
              {isProfileVisible ? 'Hide Profile' : 'View Profile'}
            </button>
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
                className="ml-2 bg-blue-600 text-white rounded p-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Tweet
              </button>
            </div>
            {uploadedImage && (
              <div className="mt-4">
                <img src={uploadedImage} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
            {chatGptResponse && (
              <div className="mt-4 p-2 border border-green-500 rounded bg-green-100 text-green-800">
                <strong>Suggestion:</strong> {chatGptResponse}
              </div>
            )}
          </section>
          {/* Project Schedules Section */}
          <section className="mt-4 lg:mt-8 min-h-80 bg-green-800 p-4 rounded">
            <h4 className="text-xl font-bold mb-4 text-yellow-400">Project Schedules</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="py-2 px-4 border-b border-gray-700">Scheduled Time</th>
                    <th className="py-2 px-4 border-b border-gray-700">Media</th>
                    <th className="py-2 px-4 border-b border-gray-700">Platform</th>
                    <th className="py-2 px-4 border-b border-gray-700">Hashtags</th>
                    <th className="py-2 px-4 border-b border-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectSchedules.length > 0 ? (
                    projectSchedules.map((schedule) => (
                      <tr key={schedule.id} className="text-center">
                        <td className="py-2 px-4 border-b border-gray-700">{new Date(schedule.scheduledTime).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b border-gray-700">
                          {schedule.mediaItem ? <img src={schedule.mediaItem} alt="Media" className="w-12 h-12 object-cover rounded-lg mx-auto" /> : 'No Media'}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-700">{schedule.platform}</td>
                        <td className="py-2 px-4 border-b border-gray-700">{schedule.content.match(/#\w+/g)?.join(', ') || 'No Hashtags'}</td>
                        <td className="py-2 px-4 border-b border-gray-700">{schedule.status}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr className="text-center">
                        <td className="py-2 px-4 border-b border-gray-700">{new Date().toLocaleString()}</td>
                        <td className="py-2 px-4 border-b border-gray-700">No Media</td>
                        <td className="py-2 px-4 border-b border-gray-700">Twitter</td>
                        <td className="py-2 px-4 border-b border-gray-700">#example, #project</td>
                        <td className="py-2 px-4 border-b border-gray-700">Scheduled</td>
                      </tr>
                      <tr className="text-center">
                        <td className="py-2 px-4 border-b border-gray-700">{new Date().toLocaleString()}</td>
                        <td className="py-2 px-4 border-b border-gray-700">No Media</td>
                        <td className="py-2 px-4 border-b border-gray-700">Facebook</td>
                        <td className="py-2 px-4 border-b border-gray-700">#example, #project</td>
                        <td className="py-2 px-4 border-b border-gray-700">Posted</td>
                      </tr>
                      <tr className="text-center">
                        <td className="py-2 px-4 border-b border-gray-700">{new Date().toLocaleString()}</td>
                        <td className="py-2 px-4 border-b border-gray-700"><img src="https://via.placeholder.com/150" alt="Media" className="w-12 h-12 object-cover rounded-lg mx-auto" /></td>
                        <td className="py-2 px-4 border-b border-gray-700">Instagram</td>
                        <td className="py-2 px-4 border-b border-gray-700">#example, #project</td>
                        <td className="py-2 px-4 border-b border-gray-700">Scheduled</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
