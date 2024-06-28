import axios from 'axios';

const API_URL = 'https://your-api-url.com/api';

// Modify the schedulePost function to accept additional fields like platform, file, and tags
export const schedulePost = async (post: { content: string; scheduledTime: string; platform: string; file?: File | null; tags: string }) => {
  const formData = new FormData();
  formData.append('content', post.content);
  formData.append('scheduledTime', post.scheduledTime);
  formData.append('platform', post.platform);
  if (post.file) {
    formData.append('file', post.file);
  }
  formData.append('tags', post.tags);

  const response = await axios.post(`${API_URL}/posts/schedule`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Existing linkAccount function remains the same
export const linkAccount = async (platform: string) => {
  const response = await axios.post(`${API_URL}/accounts/link`, { platform });
  return response.data;
};

// Existing requestPermissions function remains the same
export const requestPermissions = async () => {
  const response = await axios.post(`${API_URL}/accounts/permissions`);
  return response.data;
};
