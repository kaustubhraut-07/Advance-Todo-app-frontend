import React from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
console.log(session , "session");
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

        <div>
          <button 
          onClick={()=>signOut({ callbackUrl: '/login' })}
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
