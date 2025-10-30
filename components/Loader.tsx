
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-gray-300 text-center">{message}</p>
    </div>
  );
};
