import React from 'react';
import { Leaf } from 'lucide-react';

const Header = ({ visitorCount, onLogoClick }) => {
  return (
    <header className="relative z-10 bg-green-950 bg-opacity-60 backdrop-blur-sm border-b border-green-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
          <Leaf className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold">Kenya Forest Monitor</h1>
            <p className="text-xs text-green-300">Real-time Satellite Analysis System</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-right">
            <p className="text-green-300">Total Visitors</p>
            <p className="text-xl font-bold">{visitorCount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
