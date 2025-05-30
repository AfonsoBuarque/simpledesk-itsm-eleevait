
import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const AuthSocialLinks = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-xs text-gray-500 mb-4">FOLLOW</p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white hover:bg-blue-700">
          <Facebook className="w-4 h-4" />
        </a>
        <a href="#" className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white hover:bg-blue-500">
          <Twitter className="w-4 h-4" />
        </a>
        <a href="#" className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center text-white hover:bg-pink-600">
          <Instagram className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default AuthSocialLinks;
