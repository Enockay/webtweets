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
            <h1 className="text-2xl font-bold mb-4">Create Project</h1>
            {loading && <ClipLoader size={30} color={"#000000"} loading={loading} />}

            <div className="mb-4">
                <h2 className="text-xl font-semibold">Link Accounts</h2>
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
            </div>

            <div className="mb-4">
                <button
                    className="p-2 bg-green-500 text-white rounded"
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
                    <label className="block mb-2">Schedule Post</label>
                    <input
                        type="datetime-local"
                        className="p-2 border rounded w-full"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                    />
                </div>

                <button className="p-2 bg-green-500 text-white rounded" type="submit">
                    Schedule Post
                </button>
            </form>

            <Analytics />  {/* Include the new Analytics component */}

            <div className="mt-8">
                <h2 className="text-xl font-semibold">Tips to Increase Your Online Popularity</h2>
                <ul className="list-disc pl-5">
                    {tips.map((tip, index) => (
                        <li key={index} className="mb-2">
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CreateProject;
