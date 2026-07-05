'use client';

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user?: {
    signInDetails?: {
      loginId?: string;
    };
  };
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-[#1e2335] to-[#2d3748] border-b border-[#3d4557] px-6 py-4 flex justify-between items-center backdrop-blur-sm">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">🪣 Bucket List Tracker</h1>
      <div className="flex items-center gap-6">
        {user && (
          <span className="text-sm text-[#a0aec0]">
            Welcome, <span className="text-[#e0e7ff] font-semibold">{user.signInDetails?.loginId?.split('@')[0]}</span>
          </span>
        )}
        <button
          onClick={handleSignOut}
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#6366f1]/50 transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}