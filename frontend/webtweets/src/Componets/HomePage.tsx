import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import BadgeCard from './BadgeCard';
import { AiOutlineFileImage } from 'react-icons/ai';
import { FaRetweet } from 'react-icons/fa';
import { User} from './Context';
import Profile from './Profile';
import { getProjectSchedules } from './projectService'; // Adjust the import path as needed
import ProjectScheduleTable from './ProjectScheduleTable';
import MediaModal from './mediaModal'; // Import the new modal component
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader for loading spinner
import { ProjectSchedule } from './Context';

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

const HomePage: React.FC<Props> = ({ user, liveUsers, timeLeft }) => {
  const [suggestedTweet, setSuggestedTweet] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedLiveUsers, setSelectedLiveUsers] = useState<string[]>([]);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [projectSchedules, setProjectSchedules] = useState<ProjectSchedule[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ fileURL: string; fileType: string } | null>(null);

  useEffect(() => {
    const fetchProjectSchedules = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

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

      const filteredUserIds = userIds.filter((id): id is string => id !== undefined);

      if (filteredUserIds.length > 0) {
        try {
          const schedules = await getProjectSchedules({ username: filteredUserIds }, platforms);
          setProjectSchedules(schedules);
        } catch (error) {
          console.error('Error fetching project schedules:', error);
        }
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchProjectSchedules();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLiveUserSelection = (username: string) => {
    setSelectedLiveUsers((prevSelected) =>
      prevSelected.includes(username) ? prevSelected.filter((user) => user !== username) : [...prevSelected, username]
    );
  };

  const openModal = (fileURL: string, fileType: string) => {
    setModalContent({ fileURL, fileType });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Scheduled') {
      return 'text-yellow-500';
    } else if (status === 'Published') {
      return 'text-green-500';
    } else {
      return 'text-red-500';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Countdown timeLeft={timeLeft} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-1">
          <section className="mb-4">
            <h3 className="font-bold mb-2">Live Users</h3>
            <div className="flex flex-wrap">
              {liveUsers.map((liveUser, index) => (
                <div
                  key={index}
                  className={`relative w-10 h-10 rounded-full border-2 ${selectedLiveUsers.includes(liveUser.username) ? 'border-blue-500' : 'border-gray-300'} ${index === 0 ? 'ml-0' : 'ml-2'} ${selectedLiveUsers.includes(liveUser.username) ? 'bg-blue-600' : ''}`}
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
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader color="green" loading={loading} size={20} />
            </div>
          ) : (
            <ProjectScheduleTable
              projectSchedules={projectSchedules}
              openModal={openModal}
              getStatusColor={getStatusColor}
            />
          )}
        </div>
      </div>

      {modalIsOpen && modalContent && (
        <MediaModal
          isOpen={modalIsOpen}
          fileURL={modalContent.fileURL}
          fileType={modalContent.fileType}
          onRequestClose={closeModal}
        />
      )}
    </div>
  );
};

export default HomePage;
