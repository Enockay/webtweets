import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BadgePurchaseModal from './BadgePurchaseModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../Componets/Context';
import BadgeList from './BagdeList'; // Ensure the correct import
import HomePage from './HomePage'; // Import HomePage component

interface User {
    username: string;
    displayName?: string;
    profileImageUrl?: string | null; // Allow null
    badges: { id: string; name: string; duration: string }[];
}

interface Badge {
    id: string;
    name: string;
    duration: string;
    description: string;
    price: string;
}

interface LiveUser {
    username: string;
    profileImageUrl: string;
}

const Dashboard: React.FC = () => {
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
        const username = params.get('username');
        const displayName = params.get('displayName');
        const profileImageUrl = params.get('profileImageUrl');

        if (username) {
            setUser({
                username,
                displayName: displayName || undefined,
                profileImageUrl: profileImageUrl || undefined, // Convert null to undefined
                badges: [], // Assuming badges can be fetched later
                createdAt: '', // Set appropriate default values for other properties
                email: '',
                hashtags: [],
                isLive: false,
                password: '',
                __v: 0,
                _id: '',
            });
            navigate('/Dashboard', { replace: true }); // Remove the query parameters from the URL
        }
    }, [location, setUser, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const liveUsersResponse = await fetch('http://localhost:3000/api/live-users', {
                    credentials: 'include',
                });
                const liveUsersData = await liveUsersResponse.json();
                setLiveUsers(liveUsersData);

                const pastTweetsResponse = await fetch('http://localhost:3000/api/past-tweets', {
                    credentials: 'include',
                });
                const pastTweetsData = await pastTweetsResponse.json();
                setPastTweets(pastTweetsData);
            } catch (error) {
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

    const handleLogout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        navigate("/login");
        setUser(null);
    };

    const openModal = (badge: Badge) => {
        setSelectedBadge(badge);
        setIsModalOpen(true);
    };

    const badgeOptions: Badge[] = [
        { id: '1', name: '1 Hour Badge', duration: '1 hour', description: 'This badge gives you 1 hour of extra features.', price: 'ksh 15' },
        { id: '2', name: '2 Hours Badge', duration: '2 hours', description: 'This badge gives you 2 hours of extra features.', price: 'ksh 25' },
        { id: '3', name: '3 Hours Badge', duration: '3 hours', description: 'This badge gives you 2.5 hours of extra features.', price: 'ksh 30' },
        { id: '4', name: '5 Hours Badge', duration: '5 hours', description: 'This badge gives you 5 hours of extra features.', price: 'ksh 50' },
        { id: '5', name: '10 Hours Badge', duration: '10 hours', description: 'This badge gives you 10 hours of extra features.', price: 'ksh 60' },
    ];

    const renderSection = () => {
        switch (currentSection) {
            case 'home':
                return <HomePage user={user} pastTweets={pastTweets} liveUsers={liveUsers} timeLeft={timeLeft} />;
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
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
          <Sidebar onSectionChange={setCurrentSection} />
          <div className="flex-1 lg:p-8 lg:ml-64 mb-10">
            {user && (
              <Header
                username={user.username}
                profileImageUrl={user.profileImageUrl || undefined} // Ensure profileImageUrl is not null
                onLogout={handleLogout}
              />
            )}
            {renderSection()}
            {isModalOpen && selectedBadge && (
              <BadgePurchaseModal
                badge={selectedBadge}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
    );
};

export default Dashboard;
