import React, { useState } from 'react';
import Signin from '../Signin/Signin';
import Signup from '../Signup/Signup';
import Doc from '../../images/Doc.png';
import Home from '../../images/Home.png';

const Index = () => {
  const [Active, SetActive] = useState(true);

  return (
    <div className='w-screen min-h-screen bg-gradient-to-br from-blue-200 to-blue-100'>
      {/* Navbar */}
      <div className='flex justify-between items-center p-4 bg-blue-600 text-white'>
        <h1 className='text-2xl font-bold'>Live Document App</h1>
      </div>

      {/* Sign In / Sign Up Section */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-6 px-4 my-12'>
        <div className='flex flex-col shadow-xl'>
          <div className='flex flex-row w-full h-12 bg-white rounded-t-2xl hover:cursor-pointer'>
            <div
              className={`w-1/2 ${Active && 'shadow-2xl shadow-gray-500 border-b-2 border-blue-200'} p-2 text-center rounded-b-xl font-serif text-lg`}
              onClick={() => SetActive(true)}
            >
              Signup
            </div>
            <div
              className={`w-1/2 ${!Active && 'shadow-2xl shadow-gray-500 border-b-2 border-blue-200'} p-2 text-center rounded-b-xl font-serif text-lg`}
              onClick={() => SetActive(false)}
            >
              SignIn
            </div>
          </div>
          {Active ? <Signup /> : <Signin />}
        </div>
      </div>

      {/* About Section */}
      <div className='w-full bg-white py-12 px-8 md:px-32'>
        <h3 className='text-center text-2xl font-bold text-blue-600 mb-6'>About Live Document App</h3>
        
        {/* SVG Element */}
        <div className='flex justify-center mb-6'>
          <svg
            className='w-32 h-32'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0013.172 2H6zm7 5a1 1 0 01-1-1V3.414L16.586 8H13zM5 14a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z'
              clipRule='evenodd'
            />
          </svg>
        </div>

        <p className='text-center text-gray-600 leading-7'>
          Live Document App is your go-to solution for real-time document collaboration. Whether you're working on projects, writing reports, or brainstorming ideas with your team, our app provides the tools you need to stay connected and productive. With robust version control, document sharing, and live editing capabilities, it’s built for teamwork, no matter where your team is located.
        </p>
      </div>

      {/* Screenshot Showcase */}
      <div className='w-full py-12 px-8 md:px-32 bg-gray-100'>
        <h3 className='text-center text-2xl font-bold text-blue-600 mb-6'>How the App Looks</h3>
        <div className='flex flex-col md:flex-row justify-center items-center gap-6'>
          <img
            src={Home}
            alt='App Screenshot 1'
            className='w-full md:w-1/2 rounded-lg shadow-lg'
          />
          <img
            src={Doc}
            alt='App Screenshot 2'
            className='w-full md:w-1/2 rounded-lg shadow-lg'
          />
        </div>
        <p className='text-center text-gray-500 mt-4'>
          Explore the app interface before you sign up.
        </p>
      </div>

      {/* Footer */}
      <div className='flex justify-center items-center p-4 bg-blue-600 text-white mt-8'>
        <p>&copy; 2024 Live Document App. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Index;
