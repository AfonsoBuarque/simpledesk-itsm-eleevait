
import React from 'react';

const AuthWelcomeSection = () => {
  return (
    <div className="flex-1 flex items-center justify-center relative z-10 px-16">
      <div className="text-white max-w-lg">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-xl font-bold">YOUR LOGO</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Hello,<br />
          welcome!
        </h1>
        
        <p className="text-blue-100 text-lg leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et nibh risus.
        </p>
      </div>
    </div>
  );
};

export default AuthWelcomeSection;
