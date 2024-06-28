import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BadgePurchaseModal from './BadgePurchaseModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../Componets/Context';
import BadgeList from './BagdeList'; // Ensure the correct import
import HomePage from './HomePage'; // Import HomePage component
import { ClipLoader } from 'react-spinners';
import CreateProject from './CreateProject';
import { jwtDecode ,JwtPayload} from 'jwt-decode';

interface Badge {
    id: string;
    name: string;
    duration: string;
    description: string;
    priceKsh: string;
    priceUsd: string;
    benefits: string[];
  }
  interface SocialMedia {
    username: string | undefined;
    followers: number;
    likes: number;
    profileImageUrl: string | undefined;
  }
   
  interface User {
    profileImageUrl: string | undefined;
    badges: any[];
    createdAt: string;
    email: string;
    hashtags: any[];
    isLive: boolean;
    password: string;
    username: string;
    displayName?: string;
    twitter?: SocialMedia;
    tiktok?: SocialMedia;
    instagram?: SocialMedia;
    __v: number;
    _id: string;
  }

interface LiveUser {
    username: string;
    profileImageUrl: string;
}

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
    const [pastTweets, setPastTweets] = useState<{ id: string; content: string }[]>([]);
    const [currentSection, setCurrentSection] = useState('home');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
    
      if (token) {
          const decodedUser = jwtDecode<JwtPayload & User>(token);
          setUser(decodedUser as User);
          localStorage.setItem('token', token);
          navigate('/Dashboard', { replace: true }); // Remove the query parameters from the URL
      }
    }, [location, setUser, navigate]);
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const liveUsersResponse = await fetch('https://webtweets-dawn-forest-2637.fly.dev/api/live-users', {
                    credentials: 'include',
                });
                const liveUsersData = await liveUsersResponse.json();
                setLiveUsers(liveUsersData);

                const pastTweetsResponse = await fetch('https://webtweets-dawn-forest-2637.fly.dev/api/past-tweets', {
                    credentials: 'include',
                });
                const pastTweetsData = await pastTweetsResponse.json();
                setPastTweets(pastTweetsData);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const endTime = new Date().getTime() + 60 * 60 * 1000; // Set the end time to 60 minutes from now

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = endTime - now;
            return difference > 0 ? Math.floor(difference / 1000) : 0;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft === 0) {
                clearInterval(timer);
                // Add the logic for automatic amplification here
            }
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    const openModal = (badge: Badge) => {
        setSelectedBadge(badge);
        setIsModalOpen(true);
    };

    const badgeOptions: Badge[] = [
        {
          id: '1',
          name: 'Monthly Badge',
          duration: '1 month',
          description: 'This badge gives you 1 month of extra features.',
          priceKsh: 'Ksh 1500',
          priceUsd: '$15',
          benefits: [
            'Detailed report and analysis of your online activity.',
            'Access to automatic scheduling of tweets and posts.',
            'USSD link access to your account.',
            'Tips on how to increase your online popularity.',
            'Priority customer support.'
          ]
        },
        {
          id: '2',
          name: 'Quarterly Badge',
          duration: '3 months',
          description: 'This badge gives you 3 months of extra features.',
          priceKsh: 'Ksh 4000',
          priceUsd: '$40',
          benefits: [
            'Detailed report and analysis of your online activity.',
            'Access to automatic scheduling of tweets and posts.',
            'USSD link access to your account.',
            'Tips on how to increase your online popularity.',
            'Priority customer support.'
          ]
        },
        {
          id: '3',
          name: 'Half-Year Badge',
          duration: '6 months',
          description: 'This badge gives you 6 months of extra features.',
          priceKsh: 'Ksh 7500',
          priceUsd: '$75',
          benefits: [
            'Detailed report and analysis of your online activity.',
            'Access to automatic scheduling of tweets and posts.',
            'USSD link access to your account.',
            'Tips on how to increase your online popularity.',
            'Priority customer support.'
          ]
        },
        {
          id: '4',
          name: 'Yearly Badge',
          duration: '1 year',
          description: 'This badge gives you 1 year of extra features.',
          priceKsh: 'Ksh 14000',
          priceUsd: '$140',
          benefits: [
            'Detailed report and analysis of your online activity.',
            'Access to automatic scheduling of tweets and posts.',
            'USSD link access to your account.',
            'Tips on how to increase your online popularity.',
            'Priority customer support.'
          ]
        },
        {
          id: '5',
          name: 'Weekly Badge',
          duration: '1 week',
          description: 'This badge gives you 1 week of extra features.',
          priceKsh: 'Ksh 500',
          priceUsd: '$5',
          benefits: [
            'Detailed report and analysis of your online activity.',
            'Access to automatic scheduling of tweets and posts.',
            'USSD link access to your account.',
            'Tips on how to increase your online popularity.',
            'Priority customer support.'
          ]
        }
      ];
      
    const renderSection = () => {
        switch (currentSection) {
            case 'home':
                return <HomePage user={user} pastTweets={pastTweets} liveUsers={liveUsers} timeLeft={timeLeft} />;
            case 'create project' :
                return <CreateProject/>
            case 'projects':
                return <div>Projects Section</div>;
            case 'settings':
                return <div>Settings Section</div>;
            case 'badges':
                return <BadgeList badgeOptions={badgeOptions} openModal={openModal} />;
            default:
                return null;
        }
    };

    return (
        <div className=' bg-gray-900'>
         <center>{loading && <ClipLoader size={30} color={"#ffffff"} loading={loading} />}</center>  
        <div className="flex flex-col lg:flex-row min-h-screen text-white">
          <Sidebar onSectionChange={setCurrentSection} />
          <div className="flex-1 lg:p-8 lg:ml-64 mb-10">
          <Header user={user} setUser={setUser} loading={loading} />
            {renderSection()}
            {isModalOpen && selectedBadge && (
              <BadgePurchaseModal
                badge={selectedBadge}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
        </div>
    );
};

export default Dashboard;
