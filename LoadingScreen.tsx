import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="text-center">
        <BookOpen className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Loading...</h2>
        <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;