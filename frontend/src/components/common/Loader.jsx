import React from 'react';
import { Sparkles } from 'lucide-react';

const Loader = () => (
  <div className="flex gap-4 justify-start animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
      <Sparkles className="text-white" size={16} />
    </div>
    <div className="space-y-2 mt-2 w-1/3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export default Loader;