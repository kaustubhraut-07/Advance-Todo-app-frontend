'use client';
import React from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode, toggleDarkMode } from '@/app/store/themslice';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  console.log(isDarkMode, "isDarkMode");

  const handleDarkMode = () => {

    dispatch(setDarkMode(!isDarkMode));
    toggleDarkMode();

  };



  console.log(session, "session");
  return (
    <nav className="bg-gray-400 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">

        <div className="flex items-center space-x-4">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="User Image"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          {session?.user?.name && (
            <span className="text-lg font-semibold">{session.user.name}</span>
          )}
        </div>


        <div className="flex-grow text-center">
          <h1 className="text-2xl font-bold">Advanced Todos App</h1>
        </div>
        <div className='m-2 p-2'>
          {isDarkMode ? (
            <button onClick={handleDarkMode}>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
          )
           :
            (
              <button onClick={handleDarkMode}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </button>
            )}
      </div>
      {session?.user && (
        <div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Log Out
        </button>
      </div>
      )}
      
    </div>
    </nav >
  );
};

export default Navbar;
