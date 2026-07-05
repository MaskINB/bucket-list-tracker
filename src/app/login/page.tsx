'use client';

import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { configureAmplify } from '@/src/lib/amplify';

configureAmplify();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn({ username: email, password });
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center px-4">
      <div className="bg-[#1e2335] border border-[#2d3748] p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-8">
          🪣 Sign In
        </h2>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a0aec0] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a0aec0] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#6366f1]/30 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#a0aec0] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#6366f1] font-medium hover:text-[#8b5cf6] transition">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}