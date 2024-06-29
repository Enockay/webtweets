import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { schedulePost, linkAccount, requestPermissions } from './projectService';
import { useUser } from './Context';
import { ClipLoader } from 'react-spinners';
import Analytics from './Analytics';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CreateProject: React.FC = () => {
    const [content, setContent] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [linkedAccounts, setLinkedAccounts] = useState({
        tiktok: false,
        instagram: false,
        twitter: false,
    });
    const [platform, setPlatform] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [tags, setTags] = useState('');
    const [state, setState] = useState('Schedule');
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
    const [linkAccountModalIsOpen, setLinkAccountModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const openModal = (content: string) => {
        setModalContent(content);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openConfirmationModal = () => {
        setConfirmationModalIsOpen(true);
    };

    const closeConfirmationModal = () => {
        setConfirmationModalIsOpen(false);
    };

    const openLinkAccountModal = () => {
        setLinkAccountModalIsOpen(true);
    };

    const closeLinkAccountModal = () => {
        setLinkAccountModalIsOpen(false);
    };

    const handleLinkAccount = async (platform: string) => {
        setLoading(true);
        openModal(`Linking ${platform} account...`);
        try {
            await linkAccount(platform);
            setLinkedAccounts((prev) => ({ ...prev, [platform]: true }));
            setModalContent(`${platform} account linked successfully!`);
        } catch (error) {
            console.error(error);
            setModalContent(`Failed to link ${platform} account.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        openConfirmationModal();
    };

    const handleConfirmSchedule = async () => {
        setLoading(true);
        closeConfirmationModal();
        openModal(`Scheduling post...`);
        
        const platformDetails = () => {
            switch (platform) {
                case 'twitter':
                    return user?.twitter;
                case 'tiktok':
                    return user?.tiktok;
                case 'instagram':
                    return user?.instagram;
                default:
                    return null;
            }
        };

        const userDetails = platformDetails();
        if (!userDetails) {
            closeModal();
            openLinkAccountModal();
            return;
        }
       setState('Schedule');
        try {
            await schedulePost({ state,content, scheduledTime, platform, file, tags, userDetails });
            setContent('');
            setScheduledTime('');
            setPlatform('');
            setFile(null);
            setFileURL(null);
            setTags('');
            setModalContent('Post scheduled successfully!');
        } catch (error) {
            console.error(error);
            setModalContent('Failed to schedule post.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Check if the uploaded file is a video
            if (selectedFile.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(selectedFile);
                video.onloadedmetadata = () => {
                    // Check the video duration
                    if (video.duration > 120) {
                        alert('Video duration exceeds 2 minutes. Please upload a shorter video.');
                        setFile(null);
                        setFileURL(null);
                    } else {
                        setFile(selectedFile);
                        setFileURL(video.src);
                    }
                };
            } else {
                // Handle image uploads
                setFile(selectedFile);
                setFileURL(URL.createObjectURL(selectedFile));
            }
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
            <h1 className="text-2xl mb-3 text-lime-300 font-light">Create Project</h1>
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
            </div>

            <div className="mb-4 hidden md:hidden">
                <button
                    className="p-2 bg-green-500 text-slate-700 rounded"
                    onClick={requestPermissions}
                >
                    Request Permissions
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Select Platform</label>
                    <select
                        className="p-2 border rounded w-full text-slate-900"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        required
                    >
                        <option value="">Select Platform</option>
                        <option value="tiktok">TikTok</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter</option>
                    </select>
                </div>

                <div className="mb-4 bg-gray-500 p-4 rounded">
                    <label className="block mb-2">Upload Media (Max 2 min video or image)</label>
                    <input
                        type="file"
                        className="p-2 border rounded w-full text-slate-900"
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                    />
                    {fileURL && (
                        <div className="mt-2">
                            {file && file.type.startsWith('image/') && (
                                <center><img src={fileURL} alt="Preview" className="max-w-80 h-auto" /></center>
                            )}
                            {file && file.type.startsWith('video/') && (
                                <center>
                                    <video controls className="max-w-72 h-auto">
                                        <source src={fileURL} type={file.type} />
                                        Your browser does not support the video tag.
                                    </video>
                                </center>
                            )}
                        </div>
                    )}
                    <label className="block mb-0">Caption</label>
                    <input
                        className="w-full p-1 border rounded mb-4 text-slate-700"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Create a new post"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Post Schedule Time</label>
                    <input
                        type="datetime-local"
                        className="p-2 border rounded w-full text-slate-900"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Hashtags/Tags</label>
                    <input
                        type="text"
                        className="p-2 border rounded w-full text-slate-900"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Enter hashtags/tags"
                    />
                </div>

                <button className="p-2 bg-green-500 text-slate-800 rounded" type="submit">
                    Schedule Post
                </button>
            </form>

            <Analytics />

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

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Processing Modal"
                className="bg-green-300 p-4 rounded shadow-lg w-80 mx-auto mt-24"
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-semibold mb-4">Processing</h2>
                <div className="flex flex-col items-center">
                    <ClipLoader size={30} color={"#0000FF"} loading={loading} />
                    <p className="mt-4">{modalContent}</p>
                </div>
                <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={closeModal}>
                    Close
                </button>
            </Modal>

            <Modal
                isOpen={confirmationModalIsOpen}
                onRequestClose={closeConfirmationModal}
                contentLabel="Confirmation Modal"
                className="bg-green-300 p-4 rounded shadow-lg w-80 mx-auto mt-24"
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl mb-4 text-red-800 text-center">Confirm Schedule</h2>
                <div className="flex flex-col items-center">
                    <p><strong>Platform:</strong> {platform}</p>
                    <p><strong>Content:</strong> {content}</p>
                    {file && <p><strong>File:</strong> {file.name}</p>}
                    <p><strong>Tags:</strong> {tags}</p>
                    <p><strong>Scheduled System Time:</strong> {scheduledTime}</p>
                </div>
                <div className="mt-4 flex space-x-4">
                    <button className="p-2 bg-blue-500 text-white rounded" onClick={handleConfirmSchedule}>
                        Confirm
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded" onClick={closeConfirmationModal}>
                        Cancel
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={linkAccountModalIsOpen}
                onRequestClose={closeLinkAccountModal}
                contentLabel="Link Account Modal"
                className="bg-green-300 p-4 rounded shadow-lg w-80 mx-auto mt-24"
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl mb-4 text-red-800 text-center">Link Account</h2>
                <div className="flex flex-col items-center">
                    <p>Your account for the selected platform is not linked. Would you like to link your {platform} account?</p>
                </div>
                <div className="mt-4 flex space-x-4">
                    <button className="p-2 bg-blue-500 text-white rounded" onClick={() => handleLinkAccount(platform)}>
                        Link {platform}
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded" onClick={closeLinkAccountModal}>
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default CreateProject;
