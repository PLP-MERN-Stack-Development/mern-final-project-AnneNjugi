import React from 'react';
import { MessageSquare } from 'lucide-react';

const Footer = ({ onContactClick }) => {
  return (
    <footer className="relative z-10 bg-green-950 bg-opacity-70 backdrop-blur-sm border-t border-green-700 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-green-300 text-sm">
          © 2024 Kenya Forest Monitor. All rights reserved.
        </p>
        <button
          onClick={onContactClick}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition font-semibold"
        >
          <MessageSquare className="w-4 h-4" />
          Contact Us
        </button>
      </div>
    </footer>
  );
};

export default Footer;
