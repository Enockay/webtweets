import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const Analytics: React.FC = () => {
  const likesData = [
    { name: 'Jan', likes: 400 },
    { name: 'Feb', likes: 300 },
    { name: 'Mar', likes: 500 },
    { name: 'Apr', likes: 200 },
    { name: 'May', likes: 278 },
    { name: 'Jun', likes: 189 },
    { name: 'Jul', likes: 239 },
    { name: 'Aug', likes: 349 },
    { name: 'Sep', likes: 200 },
    { name: 'Oct', likes: 300 },
    { name: 'Nov', likes: 400 },
    { name: 'Dec', likes: 500 },
  ];

  const tweetsData = [
    { name: 'Jan', tweets: 200 },
    { name: 'Feb', tweets: 400 },
    { name: 'Mar', tweets: 300 },
    { name: 'Apr', tweets: 100 },
    { name: 'May', tweets: 278 },
    { name: 'Jun', tweets: 189 },
    { name: 'Jul', tweets: 239 },
    { name: 'Aug', tweets: 349 },
    { name: 'Sep', tweets: 200 },
    { name: 'Oct', tweets: 300 },
    { name: 'Nov', tweets: 400 },
    { name: 'Dec', tweets: 500 },
  ];

  const followersData = [
    { name: 'TikTok', followers: 1500 },
    { name: 'Instagram', followers: 3000 },
    { name: 'Twitter', followers: 2000 },
  ];

  const demographicData = [
    { name: '18-24', value: 400 },
    { name: '25-34', value: 300 },
    { name: '35-44', value: 300 },
    { name: '45-54', value: 200 },
    { name: '55+', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Analytics</h2>

      <div className="mt-8">
        <center><h3 className="text-lg font-semibold mb-2">Likes Analysis</h3></center>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={likesData} margin={{ right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" fill="#8884d8" label={{ position: 'top' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <center><h3 className="text-lg font-semibold mb-2">Tweets Analysis</h3></center>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tweetsData} margin={{ right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tweets" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <center><h3 className="text-lg font-semibold mb-2">Followers Analysis</h3></center>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={followersData} margin={{ right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="followers" fill="#8884d8" label={{ position: 'top' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <center><h3 className="text-lg font-semibold mb-2">Demographic Analysis</h3></center>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={demographicData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {demographicData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}-${entry}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
