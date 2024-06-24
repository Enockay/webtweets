import React from 'react';

interface CountdownProps {
  timeLeft: number;
}

const Countdown: React.FC<CountdownProps> = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-4 bg-gray-800 rounded shadow text-center">
      <h2 className="text-xl font-semibold">Next Amplification</h2>
      <p className="mt-4 text-2xl">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
};

export default Countdown;
