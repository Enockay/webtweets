import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { schedulePost, linkAccount, requestPermissions } from '../Componets/projectService';
import { useUser } from '../Componets/Context';
import { ClipLoader } from 'react-spinners';
import Analytics from './Analytics';  // Import the new Analytics component

const CreateProject: React.FC = () => {
    const [content, setContent] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [linkedAccounts, setLinkedAccounts] = useState({
        tiktok: false,
        instagram: false,
        twitter: false,
    });
    const [loading, setLoading] = useState(false);
    const { user} = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLinkAccount = async (platform: string) => {
        setLoading(true);
        try {
            await linkAccount(platform);
            setLinkedAccounts((prev) => ({ ...prev, [platform]: true }));
            alert(`${platform} account linked successfully!`);
        } catch (error) {
            console.error(error);
            alert(`Failed to link ${platform} account.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await schedulePost({ content, scheduledTime });
            setContent('');
            setScheduledTime('');
            alert('Post scheduled successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to schedule post.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPermissions = async () => {
        setLoading(true);
        try {
            await requestPermissions();
            alert('Permissions granted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to request permissions.');
        } finally {
            setLoading(false);
        }
    };

    const tips = [
        "Post regularly and consistently.",
        "Engage with your audience by responding to comments and messages.",
        "Collaborate with other influencers and brands.",
        "Use relevant hashtags to reach a wider audience.",
        "Analyze your engagement metrics and adjust your content strategy accordingly.",
        "Create high-quality content that is visually appealing and informative.",
        "Run giveaways and contests to increase engagement.",
        "Utilize social media ads to boost your reach.",
        "Stay up-to-date with the latest trends and adapt your content."
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl  mb-3 text-lime-300 font-light">Create Project</h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-4">Link Accounts</h2>
                <div className="flex space-x-4">
                    {!linkedAccounts.tiktok && (
                        <button
                            className="p-2 bg-blue-500 text-white rounded"
                            onClick={() => handleLinkAccount('tiktok')}
                        >
                            Link TikTok
                        </button>
                    )}
                    {!linkedAccounts.instagram && (
                        <button
                            className="p-2 bg-pink-500 text-white rounded"
                            onClick={() => handleLinkAccount('instagram')}
                        >
                            Link Instagram
                        </button>
                    )}
                    {!linkedAccounts.twitter && (
                        <button
                            className="p-2 bg-blue-400 text-white rounded"
                            onClick={() => handleLinkAccount('twitter')}
                        >
                            Link Twitter
                        </button>
                    )}
                </div>
              <center> {loading && <ClipLoader size={30} color={"#0000FF"} loading={loading} />}</center> 
            </div>

            <div className="mb-4 hidden md:hidden">
                <button
                    className="p-2 bg-green-500 text-slate-700 rounded"
                    onClick={handleRequestPermissions}
                >
                    Request Permissions
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-2 border rounded mb-4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Create a new post"
                    required
                ></textarea>

                <div className="mb-4">
                    <label className="block mb-2">Post Shedule Time</label>
                    <input
                        type="datetime-local"
                        className="p-2 border rounded w-full text-slate-900"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                    />
                </div>

                <button className="p-2 bg-green-500 text-slate-800 rounded" type="submit">
                    Schedule Post
                </button>
            </form>

            <Analytics />  {/* Include the new Analytics component */}

            <div className="mt-8 bg-gradient-to-r from-slate-400 via-purple-500 to-pink-500 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-white mb-4">Tips to Increase Your Online Popularity</h4>
            <ul className="list-disc pl-5 text-violet-950 font-black">
                {tips.map((tip, index) => (
                    <li key={index} className="mb-2 hover:text-yellow-300 transition-colors duration-200">
                        {tip}
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default CreateProject;
