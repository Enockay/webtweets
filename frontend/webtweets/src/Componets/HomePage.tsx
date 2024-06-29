import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import BadgeCard from './BadgeCard';
import { AiOutlineFileImage } from 'react-icons/ai';
import { FaRetweet } from 'react-icons/fa';
import { User, SocialMedia } from './Context';
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
  state: string | 'Scheduled';
  platform: string;
  content: string;
  fileURL: string | null;
  scheduledTime: string;
  userDetails: SocialMedia;
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
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [projectSchedules, setProjectSchedules] = useState<ProjectSchedule[]>([]);

  useEffect(() => {
    const fetchProjectSchedules = async () => {
      if (!user) return;

      const userIds = [];
      const platforms = [];

      if (user.tiktok) {
        userIds.push(user.tiktok.username);
        platforms.push('tiktok');
      }

      if (user.instagram) {
        userIds.push(user.instagram.username);
        platforms.push('instagram');
      }

      if (user.twitter) {
        userIds.push(user.twitter.username);
        platforms.push('twitter');
      }

      // Filter out any undefined values from userIds
      const filteredUserIds = userIds.filter((id): id is string => id !== undefined);

      if (filteredUserIds.length > 0) {
        try {
          const schedules = await getProjectSchedules({ username: filteredUserIds }, platforms);
          setProjectSchedules(schedules);
        } catch (error) {
          console.error('Error fetching project schedules:', error);
        }
      }
    };

    fetchProjectSchedules();
  }, [user]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'text-yellow-500';
      case 'Posted':
        return 'text-green-500';
      default:
        return 'text-red-500';
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
                    <button className="flex items-center space-x-2">
                      <FaRetweet size={24} />
                      <span>Retweet</span>
                    </button>
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="What's happening?"
                value={suggestedTweet}
                onChange={(e) => setSuggestedTweet(e.target.value)}
                className="flex-grow bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {uploadedImage && (
              <div className="mt-4">
                <img src={uploadedImage} alt="Uploaded" className="w-12 h-12 object-cover rounded" />
              </div>
            )}
          </section>
          <section>
            <h4 className="text-xl font-bold mb-4">Project Schedules</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-700">Time</th>
                    <th className="py-2 px-4 border-b border-gray-700">Platform</th>
                    <th className="py-2 px-4 border-b border-gray-700">Content</th>
                    <th className="py-2 px-4 border-b border-gray-700">Status</th>
                    <th className="py-2 px-4 border-b border-gray-700">Media</th>
                    <th className="py-2 px-4 border-b border-gray-700">User Details</th>
                  </tr>
                </thead>
                <tbody>
                  {projectSchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-800">
                      <td className="py-2 px-4 border-b border-gray-700">{new Date(schedule.scheduledTime).toLocaleString()}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{schedule.platform}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{schedule.content}</td>
                      <td className={`py-2 px-4 border-b border-gray-700 ${getStatusColor(schedule.state)}`}>{schedule.state}</td>
                      <td className="py-2 px-4 border-b border-gray-700">
                      {schedule.fileURL ? (
                        <div className="mt-2">
                          {schedule.fileURL && schedule.fileURL.endsWith('.png') && (
                            <center><img src={schedule.fileURL} alt="Preview" className="max-w-10 h-auto" /></center>
                          )}
                          {schedule.fileURL && schedule.fileURL.endsWith('.mp4') && (
                            <center>
                              <video controls className="max-w-10 h-auto">
                                <source src={schedule.fileURL} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </center>
                          )}
                        </div>
                      ) : (
                        'No File '
                      )}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-700">
                        {schedule.userDetails && (
                          <div className='flex'>
                            <img src={schedule.userDetails.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover inline-block mr-2" />
                            <span>{schedule.userDetails.username}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
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
