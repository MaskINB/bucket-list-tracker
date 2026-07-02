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
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🪣 Bucket List Tracker</h1>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm">
            Hello, {user.signInDetails?.loginId?.split('@')[0]}
          </span>
        )}
        <button
          onClick={handleSignOut}
          className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-50 transition"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}