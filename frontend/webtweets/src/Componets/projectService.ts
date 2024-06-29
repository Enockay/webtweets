import axios from 'axios';
import { ProjectSchedule } from './Context';
const API_URL = 'https://webtweets-dawn-forest-2637.fly.dev/schedules';

interface UserDetails {
  username: string | undefined;
  followers: number;
  likes: number;
  profileImageUrl: string | undefined;
}

interface Post {
  state:string;
  content: string;
  scheduledTime: string;
  platform: string;
  file?: File | null;
  tags: string;
  userDetails: UserDetails;
}

export interface UserIds {
  username: string[];
}

export const schedulePost = async (post: Post) => {
  const formData = new FormData();
  formData.append('content', post.content);
  formData.append('scheduledTime', post.scheduledTime);
  formData.append('platform', post.platform);
  if (post.file) {
    formData.append('file', post.file);
  }
  formData.append('tags', post.tags);
  formData.append('state',post.state);
  formData.append('userDetails', JSON.stringify(post.userDetails)); // Add user details

  const response = await axios.post(`${API_URL}/projects/schedules`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

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

export const getProjectSchedules = async (userIds: UserIds, platforms: string[]): Promise<ProjectSchedule[]> => {
  const response = await axios.get(`${API_URL}/projects/schedules`, {
    params: {
      userIds: userIds.username,
      platforms,
    },
  });

  // Map the response data to the ProjectSchedule type
  const projectSchedules: ProjectSchedule[] = response.data.map((schedule: any) => ({
    id: schedule._id,
    state: schedule.state,
    platform: schedule.platform,
    content: schedule.content,
    fileURL: schedule.fileURL || null,
    fileType: schedule.fileType || null,
    scheduledTime: schedule.scheduledTime,
    userDetails: {
      username: schedule.userDetails.username,
      followers: schedule.userDetails.followers,
      likes: schedule.userDetails.likes,
      profileImageUrl: schedule.userDetails.profileImageUrl,
    },
  }));

  return projectSchedules;
};