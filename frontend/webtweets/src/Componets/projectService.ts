import axios from 'axios';

const API_URL = 'https://your-api-url.com/api';

export const schedulePost = async (post: { content: string; scheduledTime: string }) => {
  const response = await axios.post(`${API_URL}/posts/schedule`, post);
  return response.data;
};

export const linkAccount = async (platform: string) => {
  const response = await axios.post(`${API_URL}/accounts/link`, { platform });
  return response.data;
};

export const requestPermissions = async () => {
  const response = await axios.post(`${API_URL}/accounts/permissions`);
  return response.data;
};
